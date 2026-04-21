import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  User,
  Users,
  Building2,
  Globe,
  Calendar,
  X,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// 5-step onboarding checklist card for /today. Persisted to user_onboarding
// so dismissal survives a logout and completion state is the single source
// of truth for the "60-minute guided setup" claim on /pricing.

interface TodayOnboardingChecklistProps {
  userId: string;
}

type StepId =
  | "profile"
  | "first_contact"
  | "first_property"
  | "website_widget"
  | "calendar";

interface Step {
  id: StepId;
  icon: React.ElementType;
  titleKey: string;
  defaultTitle: string;
  descKey: string;
  defaultDesc: string;
  href: string;
  checkCompleted: () => Promise<{ done: boolean; requiresAck?: boolean }>;
}

interface OnboardingRow {
  user_id: string;
  dismissed_at: string | null;
  step_profile_at: string | null;
  step_first_contact_at: string | null;
  step_first_property_at: string | null;
  step_website_widget_ack_at: string | null;
  step_calendar_connected_at: string | null;
}

const TodayOnboardingChecklist = ({ userId }: TodayOnboardingChecklistProps) => {
  const { t } = useTranslation();
  const [row, setRow] = useState<OnboardingRow | null>(null);
  const [derived, setDerived] = useState<Record<StepId, boolean>>({
    profile: false,
    first_contact: false,
    first_property: false,
    website_widget: false,
    calendar: false,
  });
  const [loading, setLoading] = useState(true);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "profile",
        icon: User,
        titleKey: "onboarding.step.profile.title",
        defaultTitle: "Complete your profile",
        descKey: "onboarding.step.profile.desc",
        defaultDesc: "Add your brokerage, license, and contact info.",
        href: "/settings",
        checkCompleted: async () => {
          const { data } = await supabase
            .from("profiles")
            .select("company_name, phone, full_name")
            .eq("id", userId)
            .maybeSingle();
          const p = data as { company_name?: string | null; phone?: string | null; full_name?: string | null } | null;
          return {
            done:
              !!p?.full_name &&
              !!p?.phone &&
              !!p?.company_name,
          };
        },
      },
      {
        id: "first_contact",
        icon: Users,
        titleKey: "onboarding.step.contact.title",
        defaultTitle: "Add your first contact",
        descKey: "onboarding.step.contact.desc",
        defaultDesc: "Import a CSV or add a lead manually.",
        href: "/contacts",
        checkCompleted: async () => {
          const { count } = await supabase
            .from("contacts")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);
          return { done: (count ?? 0) > 0 };
        },
      },
      {
        id: "first_property",
        icon: Building2,
        titleKey: "onboarding.step.property.title",
        defaultTitle: "Add your first property",
        descKey: "onboarding.step.property.desc",
        defaultDesc: "Paste a realtor.ca URL or enter details.",
        href: "/properties",
        checkCompleted: async () => {
          const { count } = await supabase
            .from("property_listings")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);
          return { done: (count ?? 0) > 0 };
        },
      },
      {
        id: "website_widget",
        icon: Globe,
        titleKey: "onboarding.step.widget.title",
        defaultTitle: "Set up your website widget",
        descKey: "onboarding.step.widget.desc",
        defaultDesc: "Launches Q3 2026 — see roadmap.",
        href: "/roadmap",
        checkCompleted: async () => {
          // Not shipped yet; user can acknowledge to clear the step.
          return { done: false, requiresAck: true };
        },
      },
      {
        id: "calendar",
        icon: Calendar,
        titleKey: "onboarding.step.calendar.title",
        defaultTitle: "Connect Google or Outlook Calendar",
        descKey: "onboarding.step.calendar.desc",
        defaultDesc: "Sync appointments into /today.",
        href: "/integrations",
        checkCompleted: async () => {
          const { count } = await supabase
            .from("integrations")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .in("provider", ["google-calendar", "outlook-calendar", "google", "microsoft"]);
          return { done: (count ?? 0) > 0 };
        },
      },
    ],
    [userId]
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const { data: onboarding } = await (supabase as any)
        .from("user_onboarding")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled) return;
      const rowVal = (onboarding as OnboardingRow | null) ?? {
        user_id: userId,
        dismissed_at: null,
        step_profile_at: null,
        step_first_contact_at: null,
        step_first_property_at: null,
        step_website_widget_ack_at: null,
        step_calendar_connected_at: null,
      };
      setRow(rowVal);

      // Derive live-state completion from the DB.
      const results: Record<StepId, boolean> = {
        profile: false,
        first_contact: false,
        first_property: false,
        website_widget: !!rowVal.step_website_widget_ack_at,
        calendar: false,
      };
      for (const step of steps) {
        try {
          const r = await step.checkCompleted();
          if (r.requiresAck) {
            // website_widget acknowledgment — read from the DB row only.
            continue;
          }
          results[step.id] = r.done;
        } catch {
          // ignore individual check failures
        }
      }
      if (cancelled) return;
      setDerived(results);
      setLoading(false);

      // If a step is newly complete but not timestamped yet, persist it
      // so the "completed-at" history is accurate. Ignore website_widget (ack only).
      const updates: Partial<OnboardingRow> = {};
      if (results.profile && !rowVal.step_profile_at) updates.step_profile_at = new Date().toISOString();
      if (results.first_contact && !rowVal.step_first_contact_at) updates.step_first_contact_at = new Date().toISOString();
      if (results.first_property && !rowVal.step_first_property_at) updates.step_first_property_at = new Date().toISOString();
      if (results.calendar && !rowVal.step_calendar_connected_at) updates.step_calendar_connected_at = new Date().toISOString();
      if (Object.keys(updates).length > 0) {
        await (supabase as any)
          .from("user_onboarding")
          .upsert({ user_id: userId, ...rowVal, ...updates }, { onConflict: "user_id" });
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [userId, steps]);

  const dismiss = async () => {
    const next = { ...(row ?? { user_id: userId }), dismissed_at: new Date().toISOString() };
    setRow(next as OnboardingRow);
    await (supabase as any)
      .from("user_onboarding")
      .upsert(next, { onConflict: "user_id" });
  };

  const ackWidget = async () => {
    const now = new Date().toISOString();
    const next = { ...(row ?? { user_id: userId }), step_website_widget_ack_at: now };
    setRow(next as OnboardingRow);
    setDerived({ ...derived, website_widget: true });
    await (supabase as any)
      .from("user_onboarding")
      .upsert(next, { onConflict: "user_id" });
  };

  const completedCount = Object.values(derived).filter(Boolean).length;
  const allDone = completedCount === steps.length;

  if (loading) return null;
  if (row?.dismissed_at) return null;
  if (allDone) return null;

  const progress = (completedCount / steps.length) * 100;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-medium">
              {t("onboarding.heading", "Getting started — 60 minutes, guided")}
            </CardTitle>
            <Badge variant="secondary" className="ml-2 text-xs">
              {completedCount}/{steps.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={dismiss} aria-label="dismiss">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-sm">
          {t(
            "onboarding.subheading",
            "Five steps to go from empty dashboard to first follow-up call."
          )}
        </CardDescription>
        <Progress value={progress} className="h-1.5 mt-2" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {steps.map((step) => {
            const done = derived[step.id];
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  done ? "bg-accent/30 opacity-70" : "bg-background hover:bg-accent/20"
                }`}
              >
                <div className="flex-shrink-0">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      done ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {t(step.titleKey, step.defaultTitle)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(step.descKey, step.defaultDesc)}
                  </p>
                </div>
                {!done && step.id === "website_widget" ? (
                  <Button size="sm" variant="outline" onClick={ackWidget}>
                    {t("onboarding.ack", "Got it")}
                  </Button>
                ) : !done ? (
                  <Link to={step.href} className="text-primary">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayOnboardingChecklist;
