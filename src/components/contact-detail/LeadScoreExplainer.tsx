import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Mail, Home, Clock, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Contact } from "@/types/contact";

// "Why this lead scored X" panel. Pulls up to 3 behavioural rows from the
// signal tables we actually populate today. Rows with zero data are hidden
// rather than shown as "0" — better to look small than to look fake.
//
// When scoring is still manual (i.e. AI derivation not yet shipped), the
// footer disclaimer tells the user exactly when the AI version is due.

interface LeadScoreExplainerProps {
  contact: Contact;
  children: React.ReactNode; // the clickable score display
}

interface SignalRow {
  icon: React.ElementType;
  label: string;
  value: string;
}

const LeadScoreExplainer = ({ contact, children }: LeadScoreExplainerProps) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<SignalRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const signals: SignalRow[] = [];
      const since30 = new Date(Date.now() - 30 * 86400_000).toISOString();

      // Email activity last 30d
      const { count: emailCount } = await supabase
        .from("contact_activities")
        .select("*", { count: "exact", head: true })
        .eq("contact_id", contact.id)
        .in("activity_type", ["email_sent", "email_received"])
        .gte("created_at", since30);
      if ((emailCount ?? 0) > 0) {
        signals.push({
          icon: Mail,
          label: t("leadScore.emailActivity", "Email activity (last 30 days)"),
          value: String(emailCount),
        });
      }

      // Property views
      const { count: viewCount } = await supabase
        .from("contact_activities")
        .select("*", { count: "exact", head: true })
        .eq("contact_id", contact.id)
        .eq("activity_type", "property_viewed");
      if ((viewCount ?? 0) > 0) {
        signals.push({
          icon: Home,
          label: t("leadScore.propertyViews", "Property views"),
          value: String(viewCount),
        });
      }

      // Days since last contact
      if (contact.last_contact_date) {
        const days = Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(contact.last_contact_date).getTime()) / 86400_000
          )
        );
        signals.push({
          icon: Clock,
          label: t("leadScore.daysSinceContact", "Days since last contact"),
          value: String(days),
        });
      }

      if (!cancelled) {
        setRows(signals);
        setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [open, contact.id, contact.last_contact_date, t]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-lg transition-all hover:ring-2 hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={t("leadScore.openExplainer", "Why this lead scored") as string}
        >
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">
              {t("leadScore.title", "Why this lead scored") + " " + (contact.ai_score ?? 0)}
            </h4>
            <Badge variant="outline" className="text-xs">{contact.ai_score ?? 0}/100</Badge>
          </div>

          {loading && (
            <p className="text-xs text-muted-foreground">{t("leadScore.loading", "Loading signals…")}</p>
          )}

          {!loading && rows.length === 0 && (
            <p className="text-xs text-muted-foreground">
              {t(
                "leadScore.noSignals",
                "No behavioural signals yet. Log calls, emails, and property views to see this panel populate."
              )}
            </p>
          )}

          {!loading && rows.length > 0 && (
            <div className="space-y-2">
              {rows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      <span>{row.label}</span>
                    </div>
                    <span className="font-medium">{row.value}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-3 border-t border-border">
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
              <p>
                {t(
                  "leadScore.manualNotice",
                  "Your score is currently derived from a fixed formula. AI-derived scoring trained on your own conversion history ships Q2 2026."
                )}
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LeadScoreExplainer;
