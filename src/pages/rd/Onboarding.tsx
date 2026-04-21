import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOnboardingWizard } from "@/hooks/rd/useOnboardingWizard";
import { RDWordmark } from "@/components/rd/Logo";
import {
  RDButton,
  RDBadge,
  IconCheck,
  IconArrow,
  IconShield,
  IconMaple,
  IconBolt,
  IconGlobe,
  IconHome,
  IconSparkles,
  IconLead,
  IconMail,
  IconBell,
  IconCog,
  IconDot,
  IconPlus,
} from "@/components/rd";
import { cn } from "@/lib/utils";
import type { OnboardingStepId } from "@/types/rd";

// /onboarding — Five-step signup flow per rd-onboarding.jsx. Step state
// is local-only for Phase 4; backend wiring hydrates/persists to the
// user_onboarding table in a later phase.
//
// Steps: 1 Welcome · 2 Profile · 3 Connect DDF · 4 AI voice · 5 Go live

// Step IDs are stable; labels are looked up via t() inside the rail.
const STEP_IDS: OnboardingStepId[] = [
  "welcome",
  "profile",
  "connect_ddf",
  "ai_voice",
  "go_live",
];

const STEP_LABEL_KEY: Record<OnboardingStepId, string> = {
  welcome: "rd.onboarding.stepLabels.welcome",
  profile: "rd.onboarding.stepLabels.profile",
  connect_ddf: "rd.onboarding.stepLabels.connectDdf",
  ai_voice: "rd.onboarding.stepLabels.aiVoice",
  go_live: "rd.onboarding.stepLabels.goLive",
};

const STEP_LABEL_DEFAULT: Record<OnboardingStepId, string> = {
  welcome: "Welcome",
  profile: "Profile",
  connect_ddf: "Connect DDF",
  ai_voice: "AI voice",
  go_live: "Go live",
};

export default function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, loading, saving, advance: persistAdvance } = useOnboardingWizard();
  const stepIndex = STEP_IDS.indexOf(state.currentStep);
  const safeIndex = stepIndex === -1 ? 0 : stepIndex;
  const currentStepId = STEP_IDS[safeIndex];

  const advance = () => {
    if (safeIndex < STEP_IDS.length - 1) {
      persistAdvance(STEP_IDS[safeIndex + 1]);
    } else {
      // Final step — mark go_live as completed and route into the app.
      persistAdvance("go_live");
      navigate("/app");
    }
  };
  const back = () => {
    if (safeIndex > 0) {
      persistAdvance(STEP_IDS[safeIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="rd-reset h-screen bg-rd-paper flex items-center justify-center text-sm text-rd-ink-500">
        {t("rd.onboarding.loading", "Loading your onboarding…")}
      </div>
    );
  }

  return (
    <OnbShell stepIndex={safeIndex} saving={saving}>
      <StepSwitch id={currentStepId} onBack={back} onContinue={advance} />
    </OnbShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function OnbShell({
  children,
  stepIndex,
  saving,
}: {
  children: React.ReactNode;
  stepIndex: number;
  saving?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="rd-reset h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr_380px] bg-rd-paper text-rd-ink-900 overflow-hidden">
      {/* Progress rail */}
      <aside className="bg-rd-navy-800 text-white p-7 flex flex-col overflow-y-auto">
        <RDWordmark size={17} tone="paper" />
        <div className="mt-12 flex flex-col gap-1.5">
          {STEP_IDS.map((id, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={id} className="flex items-center gap-3.5 px-2 py-2.5">
                <div
                  className={cn(
                    "w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    done && "bg-rd-terra-600 text-white",
                    active && !done && "bg-white text-rd-navy-800",
                    !done && !active && "bg-white/[0.08] text-white/50 border border-white/15"
                  )}
                >
                  {done ? <IconCheck /> : i + 1}
                </div>
                <div>
                  <div
                    className={cn(
                      "text-[13px] font-semibold",
                      active && "text-white",
                      done && "text-white/85",
                      !done && !active && "text-white/50"
                    )}
                  >
                    {t(STEP_LABEL_KEY[id], STEP_LABEL_DEFAULT[id])}
                  </div>
                  <div className="text-[11px] text-white/45 mt-px">
                    {done
                      ? t("rd.onboarding.status.complete", "Complete")
                      : active
                      ? t("rd.onboarding.status.inProgress", "In progress")
                      : "—"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-auto text-xs text-white/55 leading-[1.5]">
          {t(
            "rd.onboarding.rail.setupTime",
            "Typical setup takes 5 minutes. Your data is hosted in Canada from the second you sign up."
          )}
          {saving && (
            <span className="block mt-3 text-[11px] text-rd-terra-300">
              {t("rd.onboarding.rail.saving", "Saving your progress…")}
            </span>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="overflow-y-auto px-8 sm:px-14 py-14 sm:py-16">{children}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function StepSwitch({
  id,
  onBack,
  onContinue,
}: {
  id: OnboardingStepId;
  onBack: () => void;
  onContinue: () => void;
}) {
  switch (id) {
    case "welcome":
      return <StepWelcome onContinue={onContinue} />;
    case "profile":
      return <StepProfile onBack={onBack} onContinue={onContinue} />;
    case "connect_ddf":
      return <StepDDF onBack={onBack} onContinue={onContinue} />;
    case "ai_voice":
      return <StepVoice onBack={onBack} onContinue={onContinue} />;
    case "go_live":
      return <StepLive />;
  }
}

/* ────────────────────────────────────────────────────────── */

function StepScaffold({
  stepNumber,
  title,
  subtitle,
  children,
  rightContent,
}: {
  stepNumber: number;
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  rightContent: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 max-w-[1100px] mx-auto">
      <div>
        <div className="text-xs font-bold tracking-[0.12em] uppercase text-rd-terra-700">
          {t("rd.onboarding.stepOfFive", "Step {{n}} of 5", { n: stepNumber })}
        </div>
        <h1 className="text-[32px] md:text-[42px] font-semibold tracking-[-0.02em] leading-[1.08] mt-2.5 max-w-[560px]">
          {title}
        </h1>
        <p className="text-base text-rd-ink-600 mt-3 max-w-[520px] leading-[1.55]">{subtitle}</p>
        <div className="mt-9">{children}</div>
      </div>
      <aside className="lg:border-l lg:border-rd-line lg:pl-9 flex flex-col gap-4">
        {rightContent}
      </aside>
    </div>
  );
}

function HelperCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-rd-paper-2 border border-rd-line rounded-[12px] p-5">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-7 h-7 rounded-[7px] bg-rd-navy-100 text-rd-navy-800 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-[13px] font-semibold">{title}</div>
      </div>
      <div className="text-[13px] text-rd-ink-600 leading-[1.55]">{children}</div>
    </div>
  );
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  badge,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-[13px] font-semibold text-rd-ink-900">{label}</label>
        {badge}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-rd-line rounded-rd-md px-3.5 py-3 text-sm text-rd-ink-900 placeholder:text-rd-ink-400 focus:border-rd-navy-500 focus:outline-none"
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function StepWelcome({ onContinue }: { onContinue: () => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(true);

  return (
    <StepScaffold
      stepNumber={1}
      title={
        <>
          {t("rd.onboarding.welcome.titleLead", "Welcome to")}{" "}
          <span className="font-rd-serif italic font-normal">
            {t("rd.onboarding.welcome.titleBrand", "RealtorDesk")}
          </span>
          .
        </>
      }
      subtitle={t(
        "rd.onboarding.welcome.subtitle",
        "Let's get your AI deskmate on duty. In about five minutes, she'll be answering leads in French and English."
      )}
      rightContent={
        <>
          <HelperCard icon={<IconShield />} title={t("rd.onboarding.welcome.helperCanadaTitle", "Hosted in Canada")}>
            {t(
              "rd.onboarding.welcome.helperCanadaBody",
              "Your leads, messages, and MLS data stay on Canadian soil. PIPEDA-compliant from minute one."
            )}
          </HelperCard>
          <HelperCard icon={<IconMaple />} title={t("rd.onboarding.welcome.helperMarketTitle", "Built for our market")}>
            {t(
              "rd.onboarding.welcome.helperMarketBody",
              "Designed with brokers from Toronto, Montreal, Vancouver, Calgary — not retrofit from a US tool."
            )}
          </HelperCard>
          <HelperCard icon={<IconBolt />} title={t("rd.onboarding.welcome.helperLiveTitle", "Five minutes, live")}>
            {t(
              "rd.onboarding.welcome.helperLiveBody",
              "Most agents answer their first lead before the setup email even arrives."
            )}
          </HelperCard>
        </>
      }
    >
      <TextField
        label={t("rd.onboarding.welcome.workEmail", "Work email")}
        placeholder="sarah@royallepage.ca"
        value={email}
        onChange={setEmail}
        type="email"
      />
      <TextField
        label={t("rd.onboarding.welcome.password", "Create a password")}
        placeholder="•••••••••••"
        value={password}
        onChange={setPassword}
        type="password"
      />
      <label className="flex items-start gap-3 my-5 px-3.5 py-3.5 bg-white border border-rd-line rounded-rd-md cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 flex-shrink-0"
        />
        <span className="text-[13px] text-rd-ink-700 leading-[1.5]">
          {t(
            "rd.onboarding.welcome.consent",
            "I consent to RealtorDesk AI storing my data in Canada per PIPEDA, and I'll only use the product to contact people who've consented (CASL)."
          )}
        </span>
      </label>
      <div className="flex gap-2.5">
        <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />} onClick={onContinue}>
          {t("rd.onboarding.welcome.continueBtn", "Continue")}
        </RDButton>
        <Link to="/login">
          <RDButton variant="outline" size="lg">
            {t("rd.onboarding.welcome.signInInstead", "Sign in instead")}
          </RDButton>
        </Link>
      </div>
      <div className="flex items-center gap-4 my-8 text-rd-ink-400 text-xs">
        <div className="flex-1 h-px bg-rd-line" />
        {t("rd.onboarding.welcome.orContinueWith", "or continue with")}
        <div className="flex-1 h-px bg-rd-line" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <RDButton variant="light" size="md">
          {t("rd.onboarding.welcome.google", "Google")}
        </RDButton>
        <RDButton variant="light" size="md">
          {t("rd.onboarding.welcome.microsoft", "Microsoft 365")}
        </RDButton>
      </div>
    </StepScaffold>
  );
}

/* ────────────────────────────────────────────────────────── */

function StepProfile({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const { t } = useTranslation();
  const [first, setFirst] = useState("Sarah");
  const [last, setLast] = useState("Khoury");
  const [brokerage, setBrokerage] = useState("Royal LePage Signature Realty");
  const [province, setProvince] = useState("Ontario");
  const [language, setLanguage] = useState("English · EN");
  const [registration, setRegistration] = useState("RE-889-2201-TOR");

  return (
    <StepScaffold
      stepNumber={2}
      title={t("rd.onboarding.profile.title", "Tell us about your desk.")}
      subtitle={t(
        "rd.onboarding.profile.subtitle",
        "We use this to tailor templates, pick a default language, and make sure the AI sounds like you."
      )}
      rightContent={
        <>
          <HelperCard
            icon={<IconGlobe />}
            title={t("rd.onboarding.profile.helperLanguageTitle", "Language detection")}
          >
            {t(
              "rd.onboarding.profile.helperLanguageBody",
              "Desk AI detects each lead's language automatically. You pick the default it reverts to if the message is short."
            )}
          </HelperCard>
          <HelperCard
            icon={<IconHome />}
            title={t("rd.onboarding.profile.helperTemplatesTitle", "Brokerage templates")}
          >
            {t(
              "rd.onboarding.profile.helperTemplatesBody",
              "We pre-load RECO/OACIQ-safe disclaimers based on your province."
            )}
          </HelperCard>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <TextField label={t("rd.onboarding.profile.firstName", "First name")} value={first} onChange={setFirst} />
        <TextField label={t("rd.onboarding.profile.lastName", "Last name")} value={last} onChange={setLast} />
      </div>
      <TextField label={t("rd.onboarding.profile.brokerage", "Brokerage")} value={brokerage} onChange={setBrokerage} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <TextField label={t("rd.onboarding.profile.province", "Province")} value={province} onChange={setProvince} />
        <TextField
          label={t("rd.onboarding.profile.defaultLanguage", "Default language")}
          value={language}
          onChange={setLanguage}
          badge={
            <span className="text-[11px] text-rd-terra-700 font-semibold">
              {t("rd.onboarding.profile.frDetectedBadge", "+ FR detected")}
            </span>
          }
        />
      </div>
      <TextField
        label={t("rd.onboarding.profile.regNumber", "RECO / OACIQ registration #")}
        value={registration}
        onChange={setRegistration}
      />
      <div className="flex gap-2.5 mt-7">
        <RDButton variant="outline" size="lg" onClick={onBack}>
          {t("rd.onboarding.profile.back", "Back")}
        </RDButton>
        <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />} onClick={onContinue}>
          {t("rd.onboarding.profile.continueBtn", "Continue")}
        </RDButton>
      </div>
    </StepScaffold>
  );
}

/* ────────────────────────────────────────────────────────── */

function StepDDF({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const { t } = useTranslation();
  return (
    <StepScaffold
      stepNumber={3}
      title={t("rd.onboarding.ddf.title", "Connect your CREA DDF® feed.")}
      subtitle={t(
        "rd.onboarding.ddf.subtitle",
        "Desk AI listens to your board's DDF so new inquiries, price changes, and status flips show up instantly."
      )}
      rightContent={
        <>
          <HelperCard
            icon={<IconShield />}
            title={t("rd.onboarding.ddf.helperReadOnlyTitle", "Read-only & scoped")}
          >
            {t(
              "rd.onboarding.ddf.helperReadOnlyBody",
              "We only read listings assigned to your RECO/OACIQ #. No shared brokerage data leaves your seat."
            )}
          </HelperCard>
          <HelperCard
            icon={<IconBolt />}
            title={t("rd.onboarding.ddf.helperSyncTitle", "Sync in < 60 seconds")}
          >
            {t(
              "rd.onboarding.ddf.helperSyncBody",
              "We reindex every minute. Your new listing is live in the AI's knowledge before your sign goes in the ground."
            )}
          </HelperCard>
        </>
      }
    >
      <div className="bg-white border border-rd-line rounded-[14px] p-6 mb-3.5">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 bg-rd-terra-600 text-white rounded-rd-md flex items-center justify-center font-bold">
            DDF
          </div>
          <div>
            <div className="text-[15px] font-semibold">
              {t("rd.onboarding.ddf.boardName", "Toronto Regional Real Estate Board")}
            </div>
            <div className="text-xs text-rd-ink-500">
              {t("rd.onboarding.ddf.boardMeta", "Matched from your RECO # · 247 active listings")}
            </div>
          </div>
          <RDBadge tone="success" size="sm" className="ml-auto">
            <IconCheck />
            {t("rd.onboarding.ddf.connectedBadge", "Connected")}
          </RDBadge>
        </div>
        <div className="border-t border-rd-line pt-3.5 grid grid-cols-3 gap-3 text-xs">
          <MiniStat k="247" v={t("rd.onboarding.ddf.statListings", "Listings")} />
          <MiniStat k="89" v={t("rd.onboarding.ddf.statNewLast30d", "New last 30d")} />
          <MiniStat k="< 60s" v={t("rd.onboarding.ddf.statSyncCadence", "Sync cadence")} />
        </div>
      </div>

      <div className="bg-rd-paper-2 border border-dashed border-rd-line-strong rounded-[14px] p-5 flex items-center gap-3.5">
        <div className="w-9 h-9 bg-white border border-rd-line rounded-rd-sm flex items-center justify-center">
          <IconPlus />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">
            {t("rd.onboarding.ddf.addBoard", "Add another board")}
          </div>
          <div className="text-xs text-rd-ink-500">
            {t(
              "rd.onboarding.ddf.addBoardDesc",
              "REBGV, OACIQ, CREB — connect as many as you service."
            )}
          </div>
        </div>
        <RDButton variant="outline" size="sm">
          {t("rd.onboarding.ddf.addBtn", "Add")}
        </RDButton>
      </div>

      <div className="flex flex-wrap gap-2.5 mt-7">
        <RDButton variant="outline" size="lg" onClick={onBack}>
          {t("rd.onboarding.ddf.back", "Back")}
        </RDButton>
        <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />} onClick={onContinue}>
          {t("rd.onboarding.ddf.continueBtn", "Continue")}
        </RDButton>
        <RDButton variant="ghost" size="lg" onClick={onContinue}>
          {t("rd.onboarding.ddf.skip", "Skip for now")}
        </RDButton>
      </div>
    </StepScaffold>
  );
}

function MiniStat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-lg font-bold tabular-nums">{k}</div>
      <div className="text-[11px] text-rd-ink-500 mt-0.5">{v}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function StepVoice({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const { t } = useTranslation();
  const [tone, setTone] = useState(0);
  const [sample, setSample] = useState(
    "Hi Priya! Great meeting you at the open house today. I pulled three more listings that match your criteria — two in Oakville and one in Burlington. One of them just hit the market this morning, might be worth a quick call tomorrow before offers come in. Let me know what works."
  );
  const tones = useMemo(
    () => [
      {
        label: t("rd.onboarding.voice.toneWarmLabel", "Warm & conversational"),
        desc: t("rd.onboarding.voice.toneWarmDesc", "Friendly, uses first names. Default."),
      },
      {
        label: t("rd.onboarding.voice.tonePolishedLabel", "Polished & formal"),
        desc: t("rd.onboarding.voice.tonePolishedDesc", "Good for luxury, QC OACIQ."),
      },
      {
        label: t("rd.onboarding.voice.toneDirectLabel", "Direct & brief"),
        desc: t("rd.onboarding.voice.toneDirectDesc", "For investors, commercial."),
      },
    ],
    [t]
  );

  return (
    <StepScaffold
      stepNumber={4}
      title={t("rd.onboarding.voice.title", "Give Desk AI your voice.")}
      subtitle={t(
        "rd.onboarding.voice.subtitle",
        "Pick a tone. Paste a sample of how you actually write. Desk AI will answer leads in your voice — not a generic chatbot."
      )}
      rightContent={
        <>
          <HelperCard
            icon={<IconSparkles />}
            title={t("rd.onboarding.voice.helperBetterTitle", "It gets better daily")}
          >
            {t(
              "rd.onboarding.voice.helperBetterBody",
              "Every time you edit an AI draft, Desk learns. After week one, 90% of agents approve drafts without changes."
            )}
          </HelperCard>
          <HelperCard
            icon={<IconGlobe />}
            title={t("rd.onboarding.voice.helperBilingualTitle", "Bilingual by design")}
          >
            {t(
              "rd.onboarding.voice.helperBilingualBody",
              "Train once — Desk adapts your tone across French and English automatically."
            )}
          </HelperCard>
        </>
      }
    >
      <div className="mb-6">
        <div className="text-[13px] font-semibold mb-2.5">
          {t("rd.onboarding.voice.toneLabel", "Tone")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {tones.map((o, i) => (
            <button
              key={o.label}
              type="button"
              onClick={() => setTone(i)}
              className={cn(
                "text-left p-4 rounded-rd-md transition-colors",
                tone === i
                  ? "bg-rd-navy-50 border-2 border-rd-navy-800"
                  : "bg-white border border-rd-line"
              )}
            >
              <div className="text-[13px] font-semibold">{o.label}</div>
              <div className="text-[11px] text-rd-ink-500 mt-1 leading-[1.4]">{o.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-[13px] font-semibold mb-1.5">
          {t(
            "rd.onboarding.voice.pasteLabel",
            "Paste a recent email or DM (optional, 50+ words)"
          )}
        </div>
        <textarea
          value={sample}
          onChange={(e) => setSample(e.target.value)}
          className="w-full bg-white border border-rd-line rounded-rd-md px-4 py-3.5 text-[13px] text-rd-ink-700 leading-[1.6] min-h-[120px] focus:border-rd-navy-500 focus:outline-none resize-none"
        />
      </div>

      <div className="bg-rd-terra-100 border border-rd-terra-200 rounded-rd-md p-4 flex gap-3">
        <div className="w-8 h-8 rounded-rd-sm bg-rd-terra-600 text-white flex items-center justify-center flex-shrink-0">
          <IconSparkles />
        </div>
        <div className="text-[13px] text-rd-terra-900 leading-[1.55]">
          <strong className="font-semibold">
            {t("rd.onboarding.voice.previewLabel", "Desk AI preview —")}
          </strong>{" "}
          "{t(
            "rd.onboarding.voice.previewText",
            "Hi Priya — quick one, a new listing in Oakville dropped this morning that fits your list. Want to swing by tomorrow before offers come in?"
          )}"
        </div>
      </div>

      <div className="flex gap-2.5 mt-7">
        <RDButton variant="outline" size="lg" onClick={onBack}>
          {t("rd.onboarding.voice.back", "Back")}
        </RDButton>
        <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />} onClick={onContinue}>
          {t("rd.onboarding.voice.continueBtn", "Continue")}
        </RDButton>
      </div>
    </StepScaffold>
  );
}

/* ────────────────────────────────────────────────────────── */

function StepLive() {
  const { t } = useTranslation();
  return (
    <StepScaffold
      stepNumber={5}
      title={
        <>
          {t("rd.onboarding.live.titleLead", "Desk is")}{" "}
          <span className="font-rd-serif italic font-normal text-rd-terra-600">
            {t("rd.onboarding.live.titleAccent", "on duty")}
          </span>
          .
        </>
      }
      subtitle={t(
        "rd.onboarding.live.subtitle",
        "You're live. The next lead that comes in — night or day, English or French — gets an instant reply in your voice."
      )}
      rightContent={
        <>
          <HelperCard
            icon={<IconBell />}
            title={t("rd.onboarding.live.helperPingsTitle", "How you'll be pinged")}
          >
            {t(
              "rd.onboarding.live.helperPingsBody",
              "Push notifications on mobile. Email digest at 9 AM. SMS only for Hot leads (score ≥ 80)."
            )}
          </HelperCard>
          <HelperCard
            icon={<IconCog />}
            title={t("rd.onboarding.live.helperCustomizeTitle", "Customize anytime")}
          >
            {t(
              "rd.onboarding.live.helperCustomizeBody",
              "Workspace → Desk AI settings. Pause AI per lead, per listing, or per time of day."
            )}
          </HelperCard>
        </>
      }
    >
      <div className="bg-rd-navy-800 text-white rounded-[14px] p-7 mb-5 relative overflow-hidden">
        <div
          className="absolute -top-10 -right-10 w-[200px] h-[200px] opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--rd-terra-600), transparent 70%)" }}
        />
        <div className="relative flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-rd-md bg-rd-terra-600 flex items-center justify-center">
            <IconSparkles />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold">
                {t("rd.onboarding.live.deskLabel", "Desk AI")}
              </div>
              <RDBadge tone="success" size="sm">
                <IconDot />
                {t("rd.onboarding.live.liveBadge", "Live")}
              </RDBadge>
            </div>
            <div className="text-xs text-white/60 mt-0.5">
              {t("rd.onboarding.live.listeningNote", "Listening on TRREB · EN + FR · Warm tone")}
            </div>
          </div>
        </div>
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-white/10">
          <LiveKpi k="247" v={t("rd.onboarding.live.kpiListings", "Listings synced")} />
          <LiveKpi k="EN · FR" v={t("rd.onboarding.live.kpiLanguages", "Languages")} />
          <LiveKpi k="< 45s" v={t("rd.onboarding.live.kpiSla", "Response SLA")} />
          <LiveKpi k="24/7" v={t("rd.onboarding.live.kpiAlwaysOn", "Always on")} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NextStepCard
          icon={<IconLead />}
          title={t("rd.onboarding.live.nextLeadsTitle", "Import your leads")}
          desc={t("rd.onboarding.live.nextLeadsDesc", "CSV, BoldTrail, Follow Up Boss, kvCORE.")}
        />
        <NextStepCard
          icon={<IconMail />}
          title={t("rd.onboarding.live.nextInboxTitle", "Forward your inbox")}
          desc={t("rd.onboarding.live.nextInboxDesc", "Set up lead@yourdomain.ca to forward here.")}
        />
        <NextStepCard
          icon={<IconHome />}
          title={t("rd.onboarding.live.nextWidgetTitle", "Add your website widget")}
          desc={t("rd.onboarding.live.nextWidgetDesc", "One script tag. Bilingual chat bubble.")}
        />
        <NextStepCard
          icon={<IconGlobe />}
          title={t("rd.onboarding.live.nextTeamTitle", "Invite your team")}
          desc={t("rd.onboarding.live.nextTeamDesc", "5 seats on Team plan. $15 each after.")}
        />
      </div>

      <div className="flex flex-wrap gap-2.5 mt-7">
        <Link to="/app">
          <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />}>
            {t("rd.onboarding.live.takeToDashboard", "Take me to the dashboard")}
          </RDButton>
        </Link>
        <RDButton variant="ghost" size="lg">
          {t("rd.onboarding.live.tour", "Watch the 2-min tour")}
        </RDButton>
      </div>
    </StepScaffold>
  );
}

function LiveKpi({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[22px] font-bold tracking-[-0.015em]">{k}</div>
      <div className="text-[11px] text-white/55 mt-0.5 tracking-[0.02em]">{v}</div>
    </div>
  );
}

function NextStepCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white border border-rd-line rounded-[12px] p-4 flex gap-3 items-start">
      <div className="w-8 h-8 rounded-rd-sm bg-rd-navy-100 text-rd-navy-800 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-semibold">{title}</div>
        <div className="text-[11px] text-rd-ink-500 mt-0.5 leading-[1.45]">{desc}</div>
      </div>
      <IconArrow className="text-rd-ink-400" />
    </div>
  );
}
