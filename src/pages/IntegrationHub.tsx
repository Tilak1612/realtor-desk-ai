import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import type { IntegrationConnection, IntegrationInterest, IntegrationRequest } from "@/types/integrations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, Plug, Clock, CheckCircle, Bell, Send, ExternalLink } from "lucide-react";
import ConnectPanel from "@/components/integrations/ConnectPanel";
import SyncHealthBadge from "@/components/integrations/SyncHealthBadge";

// ─── Tool Registry ────────────────────────────────────

interface Tool {
  slug: string;
  name: string;
  category: string;
  status: "available" | "coming_soon" | "via_zapier";
  connectionMethod: "oauth" | "api_key" | "webhook" | "smtp";
  description: string;
  logoUrl: string;
  eta?: string;
}

const TOOLS: Tool[] = [
  // CRM Platforms
  { slug: "salesforce", name: "Salesforce", category: "CRM Platforms", status: "coming_soon", connectionMethod: "oauth", description: "Sync contacts and deals with Salesforce CRM", logoUrl: "https://logo.clearbit.com/salesforce.com", eta: "Q4 2026" },
  { slug: "zoho-crm", name: "Zoho CRM", category: "CRM Platforms", status: "coming_soon", connectionMethod: "oauth", description: "Two-way sync with Zoho CRM contacts and deals", logoUrl: "https://logo.clearbit.com/zoho.com", eta: "Q4 2026" },
  { slug: "pipedrive", name: "Pipedrive", category: "CRM Platforms", status: "coming_soon", connectionMethod: "oauth", description: "Sync your Pipedrive pipeline with RealtorDesk", logoUrl: "https://logo.clearbit.com/pipedrive.com", eta: "Q4 2026" },
  { slug: "freshsales", name: "Freshsales", category: "CRM Platforms", status: "coming_soon", connectionMethod: "api_key", description: "Import contacts from Freshsales", logoUrl: "https://logo.clearbit.com/freshworks.com" },
  { slug: "microsoft-dynamics", name: "Microsoft Dynamics", category: "CRM Platforms", status: "coming_soon", connectionMethod: "oauth", description: "Connect Microsoft Dynamics 365 CRM", logoUrl: "https://logo.clearbit.com/microsoft.com" },
  { slug: "keap", name: "Keap", category: "CRM Platforms", status: "via_zapier", connectionMethod: "webhook", description: "Connect via Zapier or Make", logoUrl: "https://logo.clearbit.com/keap.com" },
  { slug: "agile-crm", name: "Agile CRM", category: "CRM Platforms", status: "via_zapier", connectionMethod: "webhook", description: "Connect via Zapier or Make", logoUrl: "https://logo.clearbit.com/agilecrm.com" },
  { slug: "close-crm", name: "Close CRM", category: "CRM Platforms", status: "via_zapier", connectionMethod: "webhook", description: "Connect via Zapier or Make", logoUrl: "https://logo.clearbit.com/close.com" },
  { slug: "nutshell", name: "Nutshell", category: "CRM Platforms", status: "via_zapier", connectionMethod: "webhook", description: "Connect via Zapier or Make", logoUrl: "https://logo.clearbit.com/nutshell.com" },
  // Automation
  { slug: "zapier", name: "Zapier", category: "Automation", status: "available", connectionMethod: "webhook", description: "Connect 5,000+ apps with automated workflows", logoUrl: "https://logo.clearbit.com/zapier.com" },
  { slug: "make", name: "Make", category: "Automation", status: "available", connectionMethod: "webhook", description: "Build complex automation scenarios", logoUrl: "https://logo.clearbit.com/make.com" },
  { slug: "n8n", name: "n8n", category: "Automation", status: "available", connectionMethod: "webhook", description: "Self-hosted workflow automation", logoUrl: "https://logo.clearbit.com/n8n.io" },
  { slug: "ifttt", name: "IFTTT", category: "Automation", status: "via_zapier", connectionMethod: "webhook", description: "Simple trigger-action automations", logoUrl: "https://logo.clearbit.com/ifttt.com" },
  // Communication
  { slug: "twilio", name: "Twilio", category: "Communication", status: "available", connectionMethod: "api_key", description: "SMS and voice communication for lead follow-up", logoUrl: "https://logo.clearbit.com/twilio.com" },
  { slug: "whatsapp", name: "WhatsApp Cloud API", category: "Communication", status: "coming_soon", connectionMethod: "oauth", description: "Send WhatsApp messages to leads and clients", logoUrl: "https://logo.clearbit.com/whatsapp.com", eta: "Q1 2027" },
  { slug: "smtp", name: "Email SMTP", category: "Communication", status: "available", connectionMethod: "smtp", description: "Connect your own email server for sending", logoUrl: "https://logo.clearbit.com/gmail.com" },
  // Calendar
  { slug: "google-calendar", name: "Google Calendar", category: "Calendar", status: "available", connectionMethod: "oauth", description: "Two-way sync showings and meetings", logoUrl: "https://logo.clearbit.com/google.com" },
  { slug: "outlook-calendar", name: "Outlook Calendar", category: "Calendar", status: "available", connectionMethod: "oauth", description: "Sync with Microsoft Outlook calendar", logoUrl: "https://logo.clearbit.com/outlook.com" },
  // Contacts & Lead Sources
  { slug: "google-contacts", name: "Google Contacts", category: "Contacts & Leads", status: "available", connectionMethod: "oauth", description: "Import and sync Google contacts", logoUrl: "https://logo.clearbit.com/google.com" },
  { slug: "microsoft-contacts", name: "Microsoft Contacts", category: "Contacts & Leads", status: "available", connectionMethod: "oauth", description: "Import and sync Outlook contacts", logoUrl: "https://logo.clearbit.com/microsoft.com" },
  { slug: "linkedin-lead-gen", name: "LinkedIn Lead Gen", category: "Contacts & Leads", status: "coming_soon", connectionMethod: "oauth", description: "Auto-import leads from LinkedIn forms", logoUrl: "https://logo.clearbit.com/linkedin.com", eta: "Q3 2026" },
  { slug: "facebook-lead-ads", name: "Facebook Lead Ads", category: "Contacts & Leads", status: "coming_soon", connectionMethod: "oauth", description: "Auto-import leads from Facebook ad forms", logoUrl: "https://logo.clearbit.com/facebook.com", eta: "Q3 2026" },
  { slug: "centris", name: "Centris (Quebec MLS)", category: "Contacts & Leads", status: "coming_soon", connectionMethod: "api_key", description: "Quebec MLS listing data integration", logoUrl: "https://logo.clearbit.com/centris.ca", eta: "Q4 2026" },
];

const CATEGORIES = [...new Set(TOOLS.map(t => t.category))];

const integrationConnectionsTable = () => (supabase as any).from("integration_connections");
const integrationInterestTable = () => (supabase as any).from("integration_interest");
const integrationRequestsTable = () => (supabase as any).from("integration_requests");

const TOOL_COLORS: Record<string, string> = {
  salesforce: "#00A1E0", "zoho-crm": "#D32F2F", pipedrive: "#4CAF50",
  freshsales: "#F57C00", "microsoft-dynamics": "#0078D4", keap: "#2D8C3C",
  "agile-crm": "#00BCD4", "close-crm": "#333333", nutshell: "#FF9800",
  zapier: "#FF4A00", make: "#6D3BF5", n8n: "#EA4B71", ifttt: "#33CCFF",
  twilio: "#F22F46", whatsapp: "#25D366", smtp: "#EA4335",
  "google-calendar": "#4285F4", "outlook-calendar": "#0078D4",
  "google-contacts": "#34A853", "microsoft-contacts": "#0078D4",
  "linkedin-lead-gen": "#0A66C2", "facebook-lead-ads": "#1877F2", centris: "#E31837",
};

const ToolLogo = ({ tool }: { tool: Tool }) => {
  const [imgError, setImgError] = useState(false);
  const color = TOOL_COLORS[tool.slug] || "#ea580c";

  if (imgError) {
    return (
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: color }}>
        {tool.name[0]}
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden p-1.5">
      <img
        src={tool.logoUrl}
        alt={tool.name}
        className="w-full h-full object-contain"
        onError={() => setImgError(true)}
        loading="lazy"
      />
    </div>
  );
};

// ─── Component ────────────────────────────────────────

const IntegrationHub = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "connected" | "available" | "coming_soon">("all");
  const [connectedSlugs, setConnectedSlugs] = useState<Set<string>>(new Set());
  const [connectionsMap, setConnectionsMap] = useState<Record<string, IntegrationConnection>>({});
  const [interestedSlugs, setInterestedSlugs] = useState<Set<string>>(new Set());
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [requestName, setRequestName] = useState("");
  const [requestUseCase, setRequestUseCase] = useState("");
  const [loading, setLoading] = useState(true);

  const applyConnections = (connections: IntegrationConnection[]) => {
    const activeConnections = connections.filter((connection) => connection.status === "connected");
    setConnectedSlugs(new Set(activeConnections.map((connection) => connection.tool_slug)));
    setConnectionsMap(
      connections.reduce<Record<string, IntegrationConnection>>((map, connection) => {
        map[connection.tool_slug] = connection;
        return map;
      }, {})
    );
  };

  const refreshConnections = async () => {
    const { data, error } = await integrationConnectionsTable().select("*");

    if (error) {
      console.error("[IntegrationHub] Failed to load connections", error);
      return;
    }

    applyConnections((data ?? []) as IntegrationConnection[]);
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (!session) {
        setLoading(false);
        return;
      }

      setUser(session.user);

      const [
        { data: profileData },
        { data: connectionsData, error: connectionsError },
        { data: interestsData, error: interestsError },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", session.user.id).single(),
        integrationConnectionsTable().select("*"),
        integrationInterestTable().select("tool_slug"),
      ]);

      if (!isMounted) return;

      setProfile(profileData);

      if (connectionsError) {
        console.error("[IntegrationHub] Failed to load connections", connectionsError);
      } else {
        applyConnections((connectionsData ?? []) as IntegrationConnection[]);
      }

      if (interestsError) {
        console.error("[IntegrationHub] Failed to load interests", interestsError);
      } else {
        setInterestedSlugs(new Set(((interestsData ?? []) as IntegrationInterest[]).map((interest) => interest.tool_slug)));
      }

      setLoading(false);
    };

    void init();

    // Auto-refresh connection health every 60 seconds
    const interval = window.setInterval(() => {
      void refreshConnections();
    }, 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const openPanel = (tool: Tool) => {
    setSelectedTool(tool);
    setPanelOpen(true);
  };

  const handleNotifyMe = async (slug: string) => {
    if (!user) return;

    const { error } = await integrationInterestTable().insert({ user_id: user.id, tool_slug: slug });

    if (!error) {
      setInterestedSlugs(prev => new Set([...prev, slug]));
      toast.success(t('integrations.notified', "You'll be notified when this integration launches!"));
    } else {
      toast.error(error.message || t('integrations.notifyError', 'Unable to save your notification request'));
    }
  };

  const handleRequestIntegration = async () => {
    if (!requestName.trim() || !user) return;

    const payload: IntegrationRequest = {
      user_id: user.id,
      tool_name: requestName.trim(),
      use_case: requestUseCase.trim() || null,
    };

    const { error } = await integrationRequestsTable().insert(payload);

    if (!error) {
      toast.success(t('integrations.requestSubmitted', 'Integration request submitted!'));
      setRequestName("");
      setRequestUseCase("");
    } else {
      toast.error(error.message || t('integrations.requestError', 'Unable to submit your request'));
    }
  };

  const filteredTools = useMemo(() => {
    let result = TOOLS;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }

    // Filter
    if (filter === "connected") result = result.filter(t => connectedSlugs.has(t.slug));
    else if (filter === "available") result = result.filter(t => t.status === "available" || t.status === "via_zapier");
    else if (filter === "coming_soon") result = result.filter(t => t.status === "coming_soon");

    return result;
  }, [search, filter, connectedSlugs]);

  const stats = {
    connected: connectedSlugs.size,
    available: TOOLS.filter(t => t.status === "available").length,
    comingSoon: TOOLS.filter(t => t.status === "coming_soon").length,
  };

  const getStatusBadge = (tool: Tool) => {
    if (connectedSlugs.has(tool.slug)) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5" />{t('integrations.connected', 'Connected')}</Badge>;
    }
    if (tool.status === "coming_soon") {
      return <Badge variant="secondary" className="text-primary border-primary/30">{t('integrations.comingSoon', 'Coming Soon')}</Badge>;
    }
    if (tool.status === "via_zapier") {
      return <Badge variant="outline">{t('integrations.viaZapier', 'Via Zapier/Make')}</Badge>;
    }
    return <Badge variant="outline" className="text-green-400 border-green-400/30">{t('integrations.native', 'Native')}</Badge>;
  };

  const getActionButton = (tool: Tool) => {
    if (connectedSlugs.has(tool.slug)) {
      return (
        <Button size="sm" variant="outline" className="text-xs" onClick={() => openPanel(tool)}>
          {t('integrations.manage', 'Manage')}
        </Button>
      );
    }
    if (tool.status === "coming_soon") {
      if (interestedSlugs.has(tool.slug)) {
        return <Button size="sm" variant="ghost" disabled className="text-xs"><CheckCircle className="w-3.5 h-3.5 mr-1" />{t('integrations.notifiedBtn', 'Notified')}</Button>;
      }
      return <Button size="sm" variant="secondary" className="text-xs" onClick={() => handleNotifyMe(tool.slug)}><Bell className="w-3.5 h-3.5 mr-1" />{t('integrations.notifyMe', 'Notify Me')}</Button>;
    }
    return <Button size="sm" className="text-xs" onClick={() => openPanel(tool)}>{t('integrations.connect', 'Connect')}</Button>;
  };

  if (loading) {
    return (
      <AppLayout user={user} profile={profile}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} profile={profile}>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t('integrations.hubTitle', 'Integrations')}</h1>
            <p className="text-sm text-muted-foreground">{t('integrations.hubSubtitle', 'Connect your favorite tools to RealtorDesk AI')}</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('integrations.searchPlaceholder', 'Search integrations...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("connected")}>
            <div className="text-2xl font-bold text-green-400">{stats.connected}</div>
            <div className="text-xs text-muted-foreground">{t('integrations.statsConnected', 'Connected')}</div>
          </Card>
          <Card className="p-3 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("available")}>
            <div className="text-2xl font-bold text-primary">{stats.available}</div>
            <div className="text-xs text-muted-foreground">{t('integrations.statsAvailable', 'Available')}</div>
          </Card>
          <Card className="p-3 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("coming_soon")}>
            <div className="text-2xl font-bold text-muted-foreground">{stats.comingSoon}</div>
            <div className="text-xs text-muted-foreground">{t('integrations.statsComingSoon', 'Coming Soon')}</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">5,000+</div>
            <div className="text-xs text-muted-foreground">{t('integrations.statsZapier', 'Via Zapier')}</div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "connected", "available", "coming_soon"] as const).map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} className="text-xs" onClick={() => setFilter(f)}>
              {f === "all" ? t('integrations.filterAll', 'All') :
               f === "connected" ? t('integrations.filterConnected', 'Connected') :
               f === "available" ? t('integrations.filterAvailable', 'Available') :
               t('integrations.filterComingSoon', 'Coming Soon')}
            </Button>
          ))}
        </div>

        {/* Tool Grid by Category */}
        {filteredTools.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t('integrations.noResults', 'No integrations found')}</p>
            <Button variant="outline" onClick={() => { setSearch(""); setFilter("all"); }}>{t('integrations.clearFilters', 'Clear Filters')}</Button>
          </Card>
        ) : (
          CATEGORIES.filter(cat => filteredTools.some(t => t.category === cat)).map((category) => (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-3">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredTools.filter(t => t.category === category).map((tool) => (
                  <Card key={tool.slug} className={`p-4 transition-all hover:border-primary/30 ${tool.status === "coming_soon" && !connectedSlugs.has(tool.slug) ? "opacity-80" : ""}`}>
                    <CardContent className="p-0 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <ToolLogo tool={tool} />
                          <div>
                            <h3 className="font-medium text-sm">{tool.name}</h3>
                            <p className="text-xs text-muted-foreground">{tool.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                          {getStatusBadge(tool)}
                          {tool.eta && tool.status === "coming_soon" && (
                            <Badge variant="outline" className="text-[10px]">{tool.eta}</Badge>
                          )}
                        </div>
                        {getActionButton(tool)}
                      </div>
                      {connectedSlugs.has(tool.slug) && connectionsMap[tool.slug] && (
                        <SyncHealthBadge
                          lastSyncAt={connectionsMap[tool.slug].last_sync_at}
                          lastSyncStatus={connectionsMap[tool.slug].last_sync_status}
                          lastSyncError={connectionsMap[tool.slug].last_sync_error}
                          onReauthClick={() => openPanel(tool)}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Request an Integration */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">{t('integrations.requestTitle', "Don't see your tool?")}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t('integrations.requestSubtitle', 'Tell us what you need. We prioritize integrations based on demand.')}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('integrations.requestToolName', 'Tool / Platform name')}</Label>
              <Input value={requestName} onChange={(e) => setRequestName(e.target.value)} placeholder={t('integrations.requestPlaceholder', 'e.g., HubSpot, Monday.com')} />
            </div>
            <div className="space-y-2">
              <Label>{t('integrations.requestUseCase', 'How would you use it? (optional)')}</Label>
              <Textarea value={requestUseCase} onChange={(e) => setRequestUseCase(e.target.value)} placeholder={t('integrations.requestUseCasePlaceholder', 'Describe your use case...')} rows={1} />
            </div>
          </div>
          <Button className="mt-4" onClick={handleRequestIntegration} disabled={!requestName.trim()}>
            <Send className="w-4 h-4 mr-2" />
            {t('integrations.submitRequest', 'Submit Request')}
          </Button>
        </Card>
      </div>

      {/* Connect / Manage Panel */}
      <ConnectPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        tool={selectedTool}
        connection={selectedTool ? connectionsMap[selectedTool.slug] || null : null}
        userId={user?.id || ""}
        onConnectionChange={refreshConnections}
      />
    </AppLayout>
  );
};

export default IntegrationHub;
