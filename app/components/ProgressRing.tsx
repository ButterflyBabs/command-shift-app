export function ProgressRing({ percent, size = 104 }: { percent: number; size?: number }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.max(0, Math.min(100, percent)) / 100);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 104 104" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="52" cy="52" r={r} fill="none" stroke="rgba(31,49,91,.12)" strokeWidth="9" />
        <circle
          cx="52"
          cy="52"
          r={r}
          fill="none"
          stroke="#D4AF63"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-serif text-[23px] font-semibold text-indigo">
        {percent}%
      </div>
    </div>
  );
}
