import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, Plug, Clock, CheckCircle, Bell, Send, ExternalLink } from "lucide-react";

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

// ─── Component ────────────────────────────────────────

const IntegrationHub = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "connected" | "available" | "coming_soon">("all");
  const [connectedSlugs, setConnectedSlugs] = useState<Set<string>>(new Set());
  const [interestedSlugs, setInterestedSlugs] = useState<Set<string>>(new Set());
  const [requestName, setRequestName] = useState("");
  const [requestUseCase, setRequestUseCase] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(profileData);

      // Fetch connected integrations
      const { data: connections } = await supabase
        .from("integration_connections").select("tool_slug")
        .eq("status", "connected");
      if (connections) setConnectedSlugs(new Set(connections.map(c => c.tool_slug)));

      // Fetch interests
      const { data: interests } = await supabase
        .from("integration_interest").select("tool_slug");
      if (interests) setInterestedSlugs(new Set(interests.map(i => i.tool_slug)));

      setLoading(false);
    };
    init();
  }, []);

  const handleNotifyMe = async (slug: string) => {
    const { error } = await supabase.from("integration_interest").insert({ user_id: (user as any).id, tool_slug: slug });
    if (!error) {
      setInterestedSlugs(prev => new Set([...prev, slug]));
      toast.success(t('integrations.notified', "You'll be notified when this integration launches!"));
    }
  };

  const handleRequestIntegration = async () => {
    if (!requestName.trim()) return;
    const { error } = await supabase.from("integration_requests").insert({
      user_id: (user as any).id,
      tool_name: requestName.trim(),
      use_case: requestUseCase.trim() || null,
    });
    if (!error) {
      toast.success(t('integrations.requestSubmitted', 'Integration request submitted!'));
      setRequestName("");
      setRequestUseCase("");
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
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs">{t('integrations.manage', 'Manage')}</Button>
          <Button size="sm" variant="ghost" className="text-xs text-destructive">{t('integrations.disconnect', 'Disconnect')}</Button>
        </div>
      );
    }
    if (tool.status === "coming_soon") {
      if (interestedSlugs.has(tool.slug)) {
        return <Button size="sm" variant="ghost" disabled className="text-xs"><CheckCircle className="w-3.5 h-3.5 mr-1" />{t('integrations.notifiedBtn', 'Notified')}</Button>;
      }
      return <Button size="sm" variant="secondary" className="text-xs" onClick={() => handleNotifyMe(tool.slug)}><Bell className="w-3.5 h-3.5 mr-1" />{t('integrations.notifyMe', 'Notify Me')}</Button>;
    }
    return <Button size="sm" className="text-xs">{t('integrations.connect', 'Connect')}</Button>;
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
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                            <img
                              src={tool.logoUrl}
                              alt={tool.name}
                              className="w-6 h-6 object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{tool.name}</h3>
                            <p className="text-xs text-muted-foreground">{tool.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                          {getStatusBadge(tool)}
                          {tool.eta && tool.status === "coming_soon" && (
                            <Badge variant="outline" className="text-[10px]">{tool.eta}</Badge>
                          )}
                        </div>
                        {getActionButton(tool)}
                      </div>
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
    </AppLayout>
  );
};

export default IntegrationHub;
