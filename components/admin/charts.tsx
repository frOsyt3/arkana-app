/** Lightweight SVG charts for the admin dashboard (no chart library needed). */

function smoothPath(points: [number, number][]) {
  if (points.length === 0) return ""
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const t = 0.18
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t]
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t]
    // Keep control points inside the plot so the curve never dips below zero.
    c1[1] = Math.min(c1[1], Math.max(p1[1], p2[1]))
    c2[1] = Math.min(c2[1], Math.max(p1[1], p2[1]))
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

function niceMax(value: number) {
  if (value <= 4) return 4
  const step = Math.pow(10, Math.floor(Math.log10(value)))
  return Math.ceil(value / step) * step
}

export function Sparkline({ values, id }: { values: number[]; id: string }) {
  const w = 96
  const h = 34
  const max = Math.max(...values, 1)
  const pts = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * w, h - 2 - (v / max) * (h - 6)] as [number, number])
  const line = smoothPath(pts)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[34px] w-24" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#5DB8BA" stopOpacity="0.28" />
          <stop offset="1" stopColor="#5DB8BA" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="#4A9698" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function LeadsAreaChart({ data }: { data: { label: string; total: number }[] }) {
  const w = 640
  const h = 200
  const max = niceMax(Math.max(...data.map((d) => d.total), 0))
  const step = w / Math.max(data.length - 1, 1)
  const pts = data.map((d, i) => [i * step, h - (d.total / max) * h] as [number, number])
  const line = smoothPath(pts)
  const ticks = [max, (max * 3) / 4, max / 2, max / 4, 0]
  const labelEvery = Math.ceil(data.length / 5)

  return (
    <div className="px-6 pb-5 pt-6">
      <div className="grid grid-cols-[32px_1fr] gap-3">
        <div className="flex h-[200px] flex-col justify-between text-right text-[11px] text-[#A3B1BA]">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">
              {Number.isInteger(t) ? t : t.toFixed(1)}
            </span>
          ))}
        </div>
        <div className="relative h-[200px]">
          <div className="absolute inset-0 flex flex-col justify-between">
            {ticks.map((t, i) => (
              <div key={t} className={i === ticks.length - 1 ? "h-px bg-[#DDE4E8]" : "h-px bg-[#EEF2F4]"} />
            ))}
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="leads-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#5DB8BA" stopOpacity="0.3" />
                <stop offset="1" stopColor="#5DB8BA" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="url(#leads-area)" />
            <path d={line} fill="none" stroke="#4A9698" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {data.map((d, i) =>
            d.total > 0 ? (
              <span
                key={d.label}
                title={`${d.label}: ${d.total} lead${d.total === 1 ? "" : "s"}`}
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary-dark shadow"
                style={{ left: `${(i / Math.max(data.length - 1, 1)) * 100}%`, top: `${100 - (d.total / max) * 100}%` }}
              />
            ) : null
          )}
        </div>
        <div />
        <div className="relative h-4 text-[11px] text-[#A3B1BA]">
          {data.map((d, i) =>
            i % labelEvery === 0 || i === data.length - 1 ? (
              <span
                key={d.label}
                className="absolute -translate-x-1/2 whitespace-nowrap"
                style={{ left: `${(i / Math.max(data.length - 1, 1)) * 100}%` }}
              >
                {i === data.length - 1 && i % labelEvery !== 0 ? "" : d.label}
              </span>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}

export const SOURCE_COLORS = ["#4A9698", "#3D5A6C", "#93D1D2", "#F2B84B", "#C9D3D9", "#8B5CF6", "#EC4899"]

export function Donut({ segments, total }: { segments: { label: string; value: number }[]; total: number }) {
  const r = 56
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="relative h-[148px] w-[148px] shrink-0">
      <svg viewBox="0 0 148 148" className="-rotate-90">
        <circle cx="74" cy="74" r={r} fill="none" stroke="#F1F4F6" strokeWidth="16" />
        {total > 0 &&
          segments.map((s, i) => {
            const len = (s.value / total) * c
            const gap = segments.length > 1 ? 3 : 0
            const el = (
              <circle
                key={s.label}
                cx="74"
                cy="74"
                r={r}
                fill="none"
                stroke={SOURCE_COLORS[i % SOURCE_COLORS.length]}
                strokeWidth="16"
                strokeDasharray={`${Math.max(len - gap, 0)} ${c}`}
                strokeDashoffset={-offset}
              />
            )
            offset += len
            return el
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-bold leading-none">{total}</span>
        <span className="mt-1 text-xs text-[#8A9AA6]">total leads</span>
      </div>
    </div>
  )
}
