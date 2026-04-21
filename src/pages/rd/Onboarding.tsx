import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const STEPS: { id: OnboardingStepId; label: string }[] = [
  { id: "welcome", label: "Welcome" },
  { id: "profile", label: "Profile" },
  { id: "connect_ddf", label: "Connect DDF" },
  { id: "ai_voice", label: "AI voice" },
  { id: "go_live", label: "Go live" },
];

export default function Onboarding() {
  const [stepIndex, setStepIndex] = useState(0); // 0-based
  const currentStepId = STEPS[stepIndex].id;
  const navigate = useNavigate();

  const advance = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      navigate("/app");
    }
  };
  const back = () => setStepIndex(Math.max(0, stepIndex - 1));

  return (
    <OnbShell stepIndex={stepIndex}>
      <StepSwitch id={currentStepId} onBack={back} onContinue={advance} />
    </OnbShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function OnbShell({ children, stepIndex }: { children: React.ReactNode; stepIndex: number }) {
  return (
    <div className="rd-reset h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr_380px] bg-rd-paper text-rd-ink-900 overflow-hidden">
      {/* Progress rail */}
      <aside className="bg-rd-navy-800 text-white p-7 flex flex-col overflow-y-auto">
        <RDWordmark size={17} tone="paper" />
        <div className="mt-12 flex flex-col gap-1.5">
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={s.id} className="flex items-center gap-3.5 px-2 py-2.5">
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
                    {s.label}
                  </div>
                  <div className="text-[11px] text-white/45 mt-px">
                    {done ? "Complete" : active ? "In progress" : "—"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-auto text-xs text-white/55 leading-[1.5]">
          Typical setup takes 5 minutes. Your data is hosted in Canada from the second you sign up.
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 max-w-[1100px] mx-auto">
      <div>
        <div className="text-xs font-bold tracking-[0.12em] uppercase text-rd-terra-700">
          Step {stepNumber} of 5
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(true);

  return (
    <StepScaffold
      stepNumber={1}
      title={
        <>
          Welcome to{" "}
          <span className="font-rd-serif italic font-normal">RealtorDesk</span>.
        </>
      }
      subtitle="Let's get your AI deskmate on duty. In about five minutes, she'll be answering leads in French and English."
      rightContent={
        <>
          <HelperCard icon={<IconShield />} title="Hosted in Canada">
            Your leads, messages, and MLS data stay on Canadian soil. PIPEDA-compliant from minute
            one.
          </HelperCard>
          <HelperCard icon={<IconMaple />} title="Built for our market">
            Designed with brokers from Toronto, Montreal, Vancouver, Calgary — not retrofit from a
            US tool.
          </HelperCard>
          <HelperCard icon={<IconBolt />} title="Five minutes, live">
            Most agents answer their first lead before the setup email even arrives.
          </HelperCard>
        </>
      }
    >
      <TextField
        label="Work email"
        placeholder="sarah@royallepage.ca"
        value={email}
        onChange={setEmail}
        type="email"
      />
      <TextField
        label="Create a password"
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
          I consent to RealtorDesk AI storing my data in Canada per PIPEDA, and I'll only use the
          product to contact people who've consented (CASL).
        </span>
      </label>
      <div className="flex gap-2.5">
        <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />} onClick={onContinue}>
          Continue
        </RDButton>
        <Link to="/login">
          <RDButton variant="outline" size="lg">
            Sign in instead
          </RDButton>
        </Link>
      </div>
      <div className="flex items-center gap-4 my-8 text-rd-ink-400 text-xs">
        <div className="flex-1 h-px bg-rd-line" />
        or continue with
        <div className="flex-1 h-px bg-rd-line" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <RDButton variant="light" size="md">
          Google
        </RDButton>
        <RDButton variant="light" size="md">
          Microsoft 365
        </RDButton>
      </div>
    </StepScaffold>
  );
}

/* ────────────────────────────────────────────────────────── */

function StepProfile({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [first, setFirst] = useState("Sarah");
  const [last, setLast] = useState("Khoury");
  const [brokerage, setBrokerage] = useState("Royal LePage Signature Realty");
  const [province, setProvince] = useState("Ontario");
  const [language, setLanguage] = useState("English · EN");
  const [registration, setRegistration] = useState("RE-889-2201-TOR");

  return (
    <StepScaffold
      stepNumber={2}
      title="Tell us about your desk."
      subtitle="We use this to tailor templates, pick a default language, and make sure the AI sounds like you."
      rightContent={
        <>
          <HelperCard icon={<IconGlobe />} title="Language detection">
            Desk AI detects each lead's language automatically. You pick the default it reverts to
            if the message is short.
          </HelperCard>
          <HelperCard icon={<IconHome />} title="Brokerage templates">
            We pre-load RECO/OACIQ-safe disclaimers based on your province.
          </HelperCard>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <TextField label="First name" value={first} onChange={setFirst} />
        <TextField label="Last name" value={last} onChange={setLast} />
      </div>
      <TextField label="Brokerage" value={brokerage} onChange={setBrokerage} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <TextField label="Province" value={province} onChange={setProvince} />
        <TextField
          label="Default language"
          value={language}
          onChange={setLanguage}
          badge={<span className="text-[11px] text-rd-terra-700 font-semibold">+ FR detected</span>}
        />
      </div>
      <TextField
        label="RECO / OACIQ registration #"
        value={registration}
        onChange={setRegistration}
      />
      <div className="flex gap-2.5 mt-7">
        <RDButton variant="outline" size="lg" onClick={onBack}>
          Back
        </RDButton>
        <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />} onClick={onContinue}>
          Continue
        </RDButton>
      </div>
    </StepScaffold>
  );
}

/* ────────────────────────────────────────────────────────── */

function StepDDF({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <StepScaffold
      stepNumber={3}
      title="Connect your CREA DDF® feed."
      subtitle="Desk AI listens to your board's DDF so new inquiries, price changes, and status flips show up instantly."
      rightContent={
        <>
          <HelperCard icon={<IconShield />} title="Read-only & scoped">
            We only read listings assigned to your RECO/OACIQ #. No shared brokerage data leaves
            your seat.
          </HelperCard>
          <HelperCard icon={<IconBolt />} title="Sync in < 60 seconds">
            We reindex every minute. Your new listing is live in the AI's knowledge before your
            sign goes in the ground.
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
            <div className="text-[15px] font-semibold">Toronto Regional Real Estate Board</div>
            <div className="text-xs text-rd-ink-500">
              Matched from your RECO # · 247 active listings
            </div>
          </div>
          <RDBadge tone="success" size="sm" className="ml-auto">
            <IconCheck />
            Connected
          </RDBadge>
        </div>
        <div className="border-t border-rd-line pt-3.5 grid grid-cols-3 gap-3 text-xs">
          <MiniStat k="247" v="Listings" />
          <MiniStat k="89" v="New last 30d" />
          <MiniStat k="< 60s" v="Sync cadence" />
        </div>
      </div>

      <div className="bg-rd-paper-2 border border-dashed border-rd-line-strong rounded-[14px] p-5 flex items-center gap-3.5">
        <div className="w-9 h-9 bg-white border border-rd-line rounded-rd-sm flex items-center justify-center">
          <IconPlus />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Add another board</div>
          <div className="text-xs text-rd-ink-500">
            REBGV, OACIQ, CREB — connect as many as you service.
          </div>
        </div>
        <RDButton variant="outline" size="sm">
          Add
        </RDButton>
      </div>

      <div className="flex flex-wrap gap-2.5 mt-7">
        <RDButton variant="outline" size="lg" onClick={onBack}>
          Back
        </RDButton>
        <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />} onClick={onContinue}>
          Continue
        </RDButton>
        <RDButton variant="ghost" size="lg" onClick={onContinue}>
          Skip for now
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
  const [tone, setTone] = useState(0);
  const [sample, setSample] = useState(
    "Hi Priya! Great meeting you at the open house today. I pulled three more listings that match your criteria — two in Oakville and one in Burlington. One of them just hit the market this morning, might be worth a quick call tomorrow before offers come in. Let me know what works."
  );
  const tones = useMemo(
    () => [
      {
        t: "Warm & conversational",
        d: "Friendly, uses first names. Default.",
      },
      {
        t: "Polished & formal",
        d: "Good for luxury, QC OACIQ.",
      },
      {
        t: "Direct & brief",
        d: "For investors, commercial.",
      },
    ],
    []
  );

  return (
    <StepScaffold
      stepNumber={4}
      title="Give Desk AI your voice."
      subtitle="Pick a tone. Paste a sample of how you actually write. Desk AI will answer leads in your voice — not a generic chatbot."
      rightContent={
        <>
          <HelperCard icon={<IconSparkles />} title="It gets better daily">
            Every time you edit an AI draft, Desk learns. After week one, 90% of agents approve
            drafts without changes.
          </HelperCard>
          <HelperCard icon={<IconGlobe />} title="Bilingual by design">
            Train once — Desk adapts your tone across French and English automatically.
          </HelperCard>
        </>
      }
    >
      <div className="mb-6">
        <div className="text-[13px] font-semibold mb-2.5">Tone</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {tones.map((o, i) => (
            <button
              key={o.t}
              type="button"
              onClick={() => setTone(i)}
              className={cn(
                "text-left p-4 rounded-rd-md transition-colors",
                tone === i
                  ? "bg-rd-navy-50 border-2 border-rd-navy-800"
                  : "bg-white border border-rd-line"
              )}
            >
              <div className="text-[13px] font-semibold">{o.t}</div>
              <div className="text-[11px] text-rd-ink-500 mt-1 leading-[1.4]">{o.d}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-[13px] font-semibold mb-1.5">
          Paste a recent email or DM (optional, 50+ words)
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
          <strong className="font-semibold">Desk AI preview —</strong> "Hi Priya — quick one, a new
          listing in Oakville dropped this morning that fits your list. Want to swing by tomorrow
          before offers come in?"
        </div>
      </div>

      <div className="flex gap-2.5 mt-7">
        <RDButton variant="outline" size="lg" onClick={onBack}>
          Back
        </RDButton>
        <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />} onClick={onContinue}>
          Continue
        </RDButton>
      </div>
    </StepScaffold>
  );
}

/* ────────────────────────────────────────────────────────── */

function StepLive() {
  return (
    <StepScaffold
      stepNumber={5}
      title={
        <>
          Desk is{" "}
          <span className="font-rd-serif italic font-normal text-rd-terra-600">on duty</span>.
        </>
      }
      subtitle="You're live. The next lead that comes in — night or day, English or French — gets an instant reply in your voice."
      rightContent={
        <>
          <HelperCard icon={<IconBell />} title="How you'll be pinged">
            Push notifications on mobile. Email digest at 9 AM. SMS only for Hot leads (score ≥
            80).
          </HelperCard>
          <HelperCard icon={<IconCog />} title="Customize anytime">
            Workspace → Desk AI settings. Pause AI per lead, per listing, or per time of day.
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
              <div className="text-lg font-semibold">Desk AI</div>
              <RDBadge tone="success" size="sm">
                <IconDot />
                Live
              </RDBadge>
            </div>
            <div className="text-xs text-white/60 mt-0.5">
              Listening on TRREB · EN + FR · Warm tone
            </div>
          </div>
        </div>
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-white/10">
          <LiveKpi k="247" v="Listings synced" />
          <LiveKpi k="EN · FR" v="Languages" />
          <LiveKpi k="< 45s" v="Response SLA" />
          <LiveKpi k="24/7" v="Always on" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NextStepCard
          icon={<IconLead />}
          title="Import your leads"
          desc="CSV, BoldTrail, Follow Up Boss, kvCORE."
        />
        <NextStepCard
          icon={<IconMail />}
          title="Forward your inbox"
          desc="Set up lead@yourdomain.ca to forward here."
        />
        <NextStepCard
          icon={<IconHome />}
          title="Add your website widget"
          desc="One script tag. Bilingual chat bubble."
        />
        <NextStepCard
          icon={<IconGlobe />}
          title="Invite your team"
          desc="5 seats on Team plan. $15 each after."
        />
      </div>

      <div className="flex flex-wrap gap-2.5 mt-7">
        <Link to="/app">
          <RDButton variant="primary" size="lg" trailingIcon={<IconArrow />}>
            Take me to the dashboard
          </RDButton>
        </Link>
        <RDButton variant="ghost" size="lg">
          Watch the 2-min tour
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
