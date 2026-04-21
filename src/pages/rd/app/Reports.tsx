import { AppShell } from "@/components/rd/layout/AppShell";
import {
  RDButton,
  RDStatCard,
  RDCard,
  RDAvatar,
  Spark,
  IconCalendar,
} from "@/components/rd";
import { cn } from "@/lib/utils";

// /app/reports — Reports per rd-app-extra.jsx Artboard_Reports.
// KPI row + response-time chart + pipeline funnel + source ROI +
// agent leaderboard. Numbers are mock; swap for real queries during
// backend wiring ("reports" step in the agreed order).

export default function Reports() {
  return (
    <AppShell>
      <div className="p-7 pb-10">
        <Header />
        <KPIRow />
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mt-5">
          <ResponseTimeCard />
          <FunnelCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          <SourceROICard />
          <AgentLeaderboardCard />
        </div>
      </div>
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function Header() {
  return (
    <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
      <div>
        <div className="text-xs text-rd-ink-500 font-semibold">Apr 1 – Apr 21, 2026 · 21 days</div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] mt-0.5">Reports</h1>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="px-3 py-1.5 text-xs font-semibold border border-rd-line bg-white rounded-rd-sm flex items-center gap-1.5"
        >
          <IconCalendar />
          April 2026
        </button>
        <RDButton variant="outline" size="sm">
          Export CSV
        </RDButton>
        <RDButton variant="primary" size="sm">
          Share
        </RDButton>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function KPIRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <RDStatCard
        label="Avg response time"
        value="38s"
        delta="−14% vs Mar"
        deltaTone="success"
        sparkline={<Spark points={[0.8, 0.7, 0.65, 0.5, 0.45, 0.4, 0.35]} color="var(--rd-success)" direction="down" />}
      />
      <RDStatCard
        label="AI reply rate"
        value="92%"
        delta="+4pp"
        deltaTone="success"
        sparkline={<Spark points={[0.5, 0.55, 0.6, 0.65, 0.75, 0.85, 0.9]} color="var(--rd-terra-600)" />}
      />
      <RDStatCard
        label="Lead → Showing"
        value="23%"
        delta="+6pp"
        deltaTone="success"
        sparkline={<Spark points={[0.2, 0.3, 0.35, 0.5, 0.6, 0.65, 0.75]} color="var(--rd-navy-500)" />}
      />
      <RDStatCard
        label="Revenue attributed"
        value="$4.2M"
        delta="+$890K"
        deltaTone="success"
        sparkline={<Spark points={[0.3, 0.35, 0.5, 0.55, 0.7, 0.8, 0.9]} color="var(--rd-navy-700)" />}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function ResponseTimeCard() {
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line flex justify-between items-center flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
            Response time trend
          </div>
          <div className="text-base font-semibold mt-1">AI vs. Agent · last 21 days</div>
        </div>
        <div className="flex gap-3.5 text-xs">
          <LegendDot color="var(--rd-terra-600)" label="AI · 38s avg" />
          <LegendDot color="var(--rd-navy-700)" label="Agent · 4h 12m avg" />
        </div>
      </div>
      <div className="p-6">
        <BigChart />
      </div>
    </RDCard>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-rd-ink-600">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

/** Deterministic 21-day 2-line chart — AI flat at ~30s, agent volatile. */
function BigChart() {
  const w = 820;
  const h = 200;
  const days = 21;
  const xStep = w / (days - 1);

  // Deterministic synthesised traces so the chart renders the same every mount.
  const aiPts = Array.from({ length: days }, (_, i) => {
    const y = 170 + Math.sin(i * 0.9) * 6;
    return [i * xStep, y] as const;
  });
  const agentPts = Array.from({ length: days }, (_, i) => {
    const base = 60 + Math.sin(i * 0.4) * 20 + Math.cos(i * 0.7) * 15;
    return [i * xStep, base] as const;
  });

  const toPath = (pts: readonly (readonly [number, number])[]) =>
    pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const area = (pts: readonly (readonly [number, number])[]) =>
    `${toPath(pts)} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="0"
          y1={40 + i * 40}
          x2={w}
          y2={40 + i * 40}
          stroke="var(--rd-line)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      ))}
      <path d={area(agentPts)} fill="var(--rd-navy-100)" opacity="0.6" />
      <path
        d={toPath(agentPts)}
        fill="none"
        stroke="var(--rd-navy-700)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={toPath(aiPts)}
        fill="none"
        stroke="var(--rd-terra-600)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {aiPts.map(
        (p, i) =>
          i % 4 === 0 && (
            <circle key={`a${i}`} cx={p[0]} cy={p[1]} r="3" fill="var(--rd-terra-600)" />
          )
      )}
      {[0, 5, 10, 15, 20].map((i) => (
        <text
          key={i}
          x={i * xStep}
          y={h - 4}
          fontSize="10"
          fill="var(--rd-ink-500)"
          textAnchor="middle"
          fontFamily="Inter"
        >
          Apr {i + 1}
        </text>
      ))}
      <text x="4" y="44" fontSize="10" fill="var(--rd-ink-500)" fontFamily="Inter">
        6h
      </text>
      <text x="4" y="84" fontSize="10" fill="var(--rd-ink-500)" fontFamily="Inter">
        4h
      </text>
      <text x="4" y="124" fontSize="10" fill="var(--rd-ink-500)" fontFamily="Inter">
        2h
      </text>
      <text x="4" y="164" fontSize="10" fill="var(--rd-ink-500)" fontFamily="Inter">
        1m
      </text>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────── */

function FunnelCard() {
  const rows: { stage: string; count: number; pct: number; tone: string }[] = [
    { stage: "Leads captured", count: 247, pct: 100, tone: "bg-rd-navy-800" },
    { stage: "Contacted by AI", count: 231, pct: 94, tone: "bg-rd-navy-600" },
    { stage: "Qualified", count: 142, pct: 58, tone: "bg-rd-terra-600" },
    { stage: "Showing booked", count: 57, pct: 23, tone: "bg-rd-terra-500" },
    { stage: "Offer", count: 18, pct: 7, tone: "bg-rd-success" },
    { stage: "Closed won", count: 9, pct: 4, tone: "bg-rd-ink-900" },
  ];
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line">
        <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
          Pipeline conversion
        </div>
        <div className="text-base font-semibold mt-1">Stage funnel</div>
      </div>
      <div className="p-5 flex flex-col gap-2.5">
        {rows.map((r) => (
          <div key={r.stage}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">{r.stage}</span>
              <span className="text-rd-ink-500">
                <span className="text-rd-ink-900 font-bold mr-1.5 tabular-nums">{r.count}</span>
                {r.pct}%
              </span>
            </div>
            <div className="h-5 bg-rd-ink-50 rounded-rd-xs overflow-hidden">
              <div className={cn("h-full", r.tone)} style={{ width: `${r.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </RDCard>
  );
}

/* ────────────────────────────────────────────────────────── */

function SourceROICard() {
  const rows: { s: string; spend: string; leads: number; closed: number; roi: string; tone: string }[] = [
    { s: "CREA DDF", spend: "$0", leads: 104, closed: 5, roi: "∞", tone: "bg-rd-navy-800" },
    { s: "Website form", spend: "$800", leads: 68, closed: 3, roi: "18×", tone: "bg-rd-terra-600" },
    { s: "Facebook Ads", spend: "$3,400", leads: 42, closed: 1, roi: "2.4×", tone: "bg-rd-navy-400" },
    { s: "Referral", spend: "$0", leads: 18, closed: 2, roi: "∞", tone: "bg-rd-success" },
    { s: "Open house", spend: "$200", leads: 15, closed: 1, roi: "12×", tone: "bg-rd-ink-400" },
  ];
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line">
        <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
          Source ROI
        </div>
        <div className="text-base font-semibold mt-1">Revenue per lead source</div>
      </div>
      <div>
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.8fr] px-6 py-2.5 bg-rd-ink-50 text-[10px] font-bold uppercase tracking-[0.06em] text-rd-ink-500 border-b border-rd-line">
          <div>Source</div>
          <div>Spend</div>
          <div>Leads</div>
          <div>Closed</div>
          <div>ROI</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.s}
            className={cn(
              "grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.8fr] px-6 py-3 text-sm items-center",
              i === rows.length - 1 ? "" : "border-b border-rd-line"
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-[2px]", r.tone)} />
              <span className="font-semibold">{r.s}</span>
            </div>
            <div className="tabular-nums text-rd-ink-600">{r.spend}</div>
            <div className="tabular-nums">{r.leads}</div>
            <div className="tabular-nums font-semibold">{r.closed}</div>
            <div className="tabular-nums font-bold text-rd-success">{r.roi}</div>
          </div>
        ))}
      </div>
    </RDCard>
  );
}

/* ────────────────────────────────────────────────────────── */

function AgentLeaderboardCard() {
  const agents: { rank: number; name: string; deals: number; vol: string; me?: boolean }[] = [
    { rank: 1, name: "Sarah Khoury", deals: 4, vol: "$1.8M", me: true },
    { rank: 2, name: "Ahmed Rahimi", deals: 3, vol: "$1.4M" },
    { rank: 3, name: "Julie Bélanger", deals: 3, vol: "$1.1M" },
    { rank: 4, name: "Tom Chen", deals: 2, vol: "$920K" },
    { rank: 5, name: "Priyanka Reddy", deals: 2, vol: "$740K" },
  ];
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line">
        <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
          Agent leaderboard
        </div>
        <div className="text-base font-semibold mt-1">This month</div>
      </div>
      <div className="py-3.5">
        {agents.map((a, i) => (
          <div
            key={a.name}
            className={cn(
              "grid grid-cols-[32px_32px_1fr_auto_auto] gap-3 px-6 py-2.5 items-center text-sm",
              a.me && "bg-rd-navy-100"
            )}
          >
            <div
              className={cn(
                "font-rd-serif italic text-base font-normal",
                i === 0 ? "text-rd-terra-600" : "text-rd-ink-500"
              )}
            >
              {a.rank}
            </div>
            <RDAvatar name={a.name} size={26} />
            <div className="font-semibold flex items-center gap-1.5 min-w-0">
              <span className="truncate">{a.name}</span>
              {a.me && (
                <span className="text-[9px] px-1.5 py-[1px] bg-rd-navy-800 text-white rounded-[3px] font-bold tracking-[0.04em]">
                  YOU
                </span>
              )}
            </div>
            <div className="text-[11px] text-rd-ink-500 tabular-nums">{a.deals} deals</div>
            <div className="text-sm font-bold tabular-nums">{a.vol}</div>
          </div>
        ))}
      </div>
    </RDCard>
  );
}
