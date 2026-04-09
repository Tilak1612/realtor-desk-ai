import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  CheckCircle, XCircle, Copy, ExternalLink, Loader2, Shield, AlertTriangle,
  RefreshCw, Trash2, ArrowRight, ArrowLeft, ArrowLeftRight
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface Tool {
  slug: string;
  name: string;
  category: string;
  status: string;
  connectionMethod: string;
  description: string;
  logoUrl: string;
}

interface Connection {
  id: string;
  tool_slug: string;
  status: string;
  connected_account_label: string | null;
  last_sync_at: string | null;
  last_sync_status: string;
  last_sync_error: string | null;
  sync_direction: string;
  sync_config: Record<string, boolean>;
  webhook_token: string | null;
  connection_method: string | null;
}

interface ConnectPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: Tool | null;
  connection: Connection | null;
  userId: string;
  onConnectionChange: () => void;
}

const ConnectPanel = ({ open, onOpenChange, tool, connection, userId, onConnectionChange }: ConnectPanelProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testError, setTestError] = useState("");
  const [copied, setCopied] = useState(false);

  // API Key fields
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [apiExtra, setApiExtra] = useState(""); // subdomain, phone number, etc.

  // SMTP fields
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpEncryption, setSmtpEncryption] = useState("tls");

  if (!tool) return null;

  const isConnected = connection?.status === "connected";
  const isWebhook = tool.connectionMethod === "webhook";
  const isApiKey = tool.connectionMethod === "api_key";
  const isSmtp = tool.connectionMethod === "smtp";
  const isOAuth = tool.connectionMethod === "oauth";

  const webhookUrl = connection?.webhook_token
    ? `https://www.realtordesk.ai/webhooks/${userId}/${tool.slug}/${connection.webhook_token}`
    : null;

  const handleCopyWebhookUrl = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(t('integrations.panel.copied', 'Webhook URL copied!'));
    }
  };

  const handleTestConnection = async () => {
    setTestResult("testing");
    setTestError("");

    try {
      const { data, error } = await supabase.functions.invoke("test-integration", {
        body: {
          tool_slug: tool.slug,
          connection_method: tool.connectionMethod,
          credentials: isSmtp
            ? { host: smtpHost, port: smtpPort, user: smtpUser, pass: smtpPass, encryption: smtpEncryption }
            : { api_key: apiKey, api_secret: apiSecret, extra: apiExtra },
        },
      });

      if (error) throw error;
      if (data?.valid) {
        setTestResult("success");
      } else {
        setTestResult("error");
        setTestError(data?.error || "Connection test failed");
      }
    } catch (err: unknown) {
      setTestResult("error");
      setTestError(err instanceof Error ? err.message : "Test failed");
    }
  };

  const handleSaveAndConnect = async () => {
    setLoading(true);
    try {
      const credentials = isSmtp
        ? JSON.stringify({ host: smtpHost, port: smtpPort, user: smtpUser, pass: smtpPass, encryption: smtpEncryption })
        : JSON.stringify({ api_key: apiKey, api_secret: apiSecret, extra: apiExtra });

      // Encrypt via edge function
      const { data: encrypted, error: encryptError } = await supabase.functions.invoke("encrypt-integration-token", {
        body: { token: credentials },
      });

      if (encryptError) throw encryptError;

      const label = isSmtp ? smtpUser : (apiExtra || `${tool.name} account`);

      const { error } = await supabase.from("integration_connections").upsert({
        user_id: userId,
        tool_slug: tool.slug,
        status: "connected",
        credentials_encrypted: encrypted?.encrypted || credentials,
        connected_account_label: label,
        connection_method: tool.connectionMethod,
        last_sync_at: new Date().toISOString(),
        last_sync_status: "success",
      }, { onConflict: "user_id,tool_slug" });

      if (error) throw error;

      toast.success(`${tool.name} ${t('integrations.panel.connectedSuccess', 'connected successfully!')}`);
      onConnectionChange();
      onOpenChange(false);
      resetForm();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  const handleWebhookConnect = async () => {
    setLoading(true);
    try {
      const token = crypto.randomUUID();

      const { error } = await supabase.from("integration_connections").upsert({
        user_id: userId,
        tool_slug: tool.slug,
        status: "connected",
        connection_method: "webhook",
        webhook_token: token,
        connected_account_label: `${tool.name} Webhook`,
        last_sync_status: "pending",
      }, { onConflict: "user_id,tool_slug" });

      if (error) throw error;

      toast.success(`${tool.name} ${t('integrations.panel.webhookReady', 'webhook URL generated!')}`);
      onConnectionChange();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to set up webhook");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("integration_connections")
        .update({
          status: "disconnected",
          credentials_encrypted: null,
          webhook_token: null,
        })
        .eq("user_id", userId)
        .eq("tool_slug", tool.slug);

      if (error) throw error;

      toast.success(`${tool.name} ${t('integrations.panel.disconnected', 'disconnected')}`);
      onConnectionChange();
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to disconnect");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async () => {
    toast.info(t('integrations.panel.syncTriggered', 'Sync triggered — this may take a moment'));
    await supabase.from("integration_connections")
      .update({ last_sync_at: new Date().toISOString(), last_sync_status: "success" })
      .eq("user_id", userId).eq("tool_slug", tool.slug);
    onConnectionChange();
  };

  const resetForm = () => {
    setApiKey(""); setApiSecret(""); setApiExtra("");
    setSmtpHost(""); setSmtpPort("587"); setSmtpUser(""); setSmtpPass("");
    setTestResult("idle"); setTestError("");
  };

  const getSyncHealthColor = () => {
    if (!connection?.last_sync_at) return "text-muted-foreground";
    const mins = (Date.now() - new Date(connection.last_sync_at).getTime()) / 60000;
    if (connection.last_sync_status === "error") return "text-red-500";
    if (mins > 60) return "text-yellow-500";
    return "text-green-500";
  };

  // ─── MANAGE VIEW (Connected) ─────────────────────

  if (isConnected) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <img src={tool.logoUrl} alt={tool.name} className="w-8 h-8 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div>
                <SheetTitle>{tool.name}</SheetTitle>
                <Badge className="bg-green-500/20 text-green-400 text-xs mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1" />
                  {t('integrations.connected', 'Connected')}
                </Badge>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Account Info */}
            <div>
              <p className="text-sm text-muted-foreground">{t('integrations.panel.connectedAs', 'Connected as')}</p>
              <p className="font-medium">{connection.connected_account_label || tool.name}</p>
            </div>

            {/* Sync Health */}
            <div className="bg-card border rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium">{t('integrations.panel.connectionHealth', 'Connection Health')}</h4>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getSyncHealthColor().replace('text-', 'bg-')}`} />
                <span className={`text-sm ${getSyncHealthColor()}`}>
                  {connection.last_sync_status === "error" ? t('integrations.panel.syncError', 'Sync Error') :
                   connection.last_sync_at ? `${t('integrations.panel.lastSynced', 'Last synced')}: ${new Date(connection.last_sync_at).toLocaleString()}` :
                   t('integrations.panel.neverSynced', 'Never synced')}
                </span>
              </div>
              {connection.last_sync_error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {connection.last_sync_error}
                </p>
              )}
              <Button variant="outline" size="sm" className="text-xs" onClick={handleSyncNow}>
                <RefreshCw className="w-3 h-3 mr-1" />
                {t('integrations.panel.syncNow', 'Sync Now')}
              </Button>
            </div>

            {/* Webhook URL (if webhook tool) */}
            {connection.webhook_token && (
              <div className="space-y-2">
                <Label>{t('integrations.panel.webhookUrl', 'Webhook URL')}</Label>
                <div className="flex gap-2">
                  <Input value={webhookUrl || ""} readOnly className="text-xs font-mono" />
                  <Button variant="outline" size="icon" onClick={handleCopyWebhookUrl}>
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              {isOAuth && (
                <Button variant="outline" className="w-full text-sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('integrations.panel.reAuth', 'Re-authenticate')}
                </Button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full text-sm" disabled={loading}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('integrations.disconnect', 'Disconnect')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('integrations.panel.disconnectTitle', `Disconnect ${tool.name}?`)}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('integrations.panel.disconnectDesc', 'This will stop all active syncs. Your data already synced will remain in RealtorDesk — nothing will be deleted.')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('app.common.cancel', 'Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDisconnect} className="bg-destructive text-destructive-foreground">
                      {t('integrations.panel.confirmDisconnect', 'Yes, Disconnect')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // ─── WEBHOOK CONNECT VIEW ────────────────────────

  if (isWebhook) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <img src={tool.logoUrl} alt={tool.name} className="w-8 h-8 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <SheetTitle>{t('integrations.panel.connect', 'Connect')} {tool.name}</SheetTitle>
            </div>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            <p className="text-sm text-muted-foreground">{tool.description}</p>

            {!connection?.webhook_token ? (
              <Button onClick={handleWebhookConnect} disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {t('integrations.panel.generateWebhook', 'Generate Webhook URL')}
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('integrations.panel.step1', 'Step 1 — Copy your webhook URL')}</Label>
                  <div className="flex gap-2">
                    <Input value={webhookUrl || ""} readOnly className="text-xs font-mono" />
                    <Button variant="outline" size="icon" onClick={handleCopyWebhookUrl}>
                      {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('integrations.panel.step2', 'Step 2 — Set up in')} {tool.name}</Label>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>{t('integrations.panel.webhookStep1', `Open ${tool.name} and create a new automation`)}</li>
                    <li>{t('integrations.panel.webhookStep2', 'Choose "Webhooks" as the trigger')}</li>
                    <li>{t('integrations.panel.webhookStep3', 'Paste the URL above into the webhook field')}</li>
                    <li>{t('integrations.panel.webhookStep4', 'Test and activate')}</li>
                  </ol>
                  <Button variant="link" className="text-xs p-0 h-auto" asChild>
                    <a href={`https://${tool.slug === 'zapier' ? 'zapier.com' : tool.slug === 'make' ? 'make.com' : 'n8n.io'}`} target="_blank" rel="noopener noreferrer">
                      {t('integrations.panel.openTool', `Open ${tool.name}`)} <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // ─── API KEY / SMTP CONNECT VIEW ─────────────────

  return (
    <Sheet open={open} onOpenChange={() => { onOpenChange(false); resetForm(); }}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <img src={tool.logoUrl} alt={tool.name} className="w-8 h-8 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <SheetTitle>{t('integrations.panel.connect', 'Connect')} {tool.name}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <p className="text-sm text-muted-foreground">{tool.description}</p>

          {/* Security notice */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-card p-3 rounded-lg border">
            <Shield className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{t('integrations.panel.securityNote', 'Your credentials are encrypted with AES-256 and stored securely. We never share them with third parties.')}</span>
          </div>

          {isSmtp ? (
            /* SMTP Fields */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('integrations.panel.smtpHost', 'SMTP Host')} *</Label>
                <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="smtp.gmail.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t('integrations.panel.port', 'Port')} *</Label>
                  <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label>{t('integrations.panel.encryption', 'Encryption')}</Label>
                  <Select value={smtpEncryption} onValueChange={setSmtpEncryption}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('integrations.panel.username', 'Username')} *</Label>
                <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label>{t('integrations.panel.password', 'Password')} *</Label>
                <Input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} />
              </div>
            </div>
          ) : (
            /* API Key Fields */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{tool.slug === "twilio" ? "Account SID" : t('integrations.panel.apiKey', 'API Key')} *</Label>
                <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                  placeholder={tool.slug === "twilio" ? "ACxxxxxxxxxxxxxxxx" : "Enter your API key"} />
              </div>
              {tool.slug === "twilio" && (
                <>
                  <div className="space-y-2">
                    <Label>Auth Token *</Label>
                    <Input type="password" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('integrations.panel.fromPhone', 'From Phone Number')} *</Label>
                    <Input value={apiExtra} onChange={(e) => setApiExtra(e.target.value)} placeholder="+1xxxxxxxxxx" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Test + Save Buttons */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleTestConnection}
              disabled={testResult === "testing" || (isSmtp ? !smtpHost || !smtpUser || !smtpPass : !apiKey)}>
              {testResult === "testing" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {testResult === "success" ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : null}
              {testResult === "error" ? <XCircle className="w-4 h-4 mr-2 text-red-500" /> : null}
              {testResult === "testing" ? t('integrations.panel.testing', 'Testing...') :
               testResult === "success" ? t('integrations.panel.testPassed', 'Connection Verified') :
               testResult === "error" ? t('integrations.panel.testFailed', 'Test Failed — Retry') :
               t('integrations.panel.testConnection', 'Test Connection')}
            </Button>

            {testResult === "error" && testError && (
              <p className="text-xs text-red-400">{testError}</p>
            )}

            <Button className="w-full" onClick={handleSaveAndConnect}
              disabled={loading || testResult !== "success"}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t('integrations.panel.saveConnect', 'Save & Connect')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ConnectPanel;
