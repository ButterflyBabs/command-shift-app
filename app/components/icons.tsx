export function Emblem({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/lccs-emblem.png" alt="LifeCharter Command Suite" className={className} />
  );
}

export function Compass({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <circle cx="50" cy="50" r="37" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <polygon points="50,14 57,50 50,44 43,50" fill="currentColor" />
      <polygon points="50,86 43,50 50,56 57,50" fill="currentColor" opacity="0.45" />
      <circle cx="50" cy="50" r="3.6" fill="currentColor" />
    </svg>
  );
}

export function Butterfly({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d="M60 50c-6-22-24-34-40-30-14 3.5-18 20-8 32 9 11 30 11 48 4z" opacity="0.85" />
        <path d="M60 50c6-22 24-34 40-30 14 3.5 18 20 8 32-9 11-30 11-48 4z" opacity="0.85" />
        <path d="M60 50c-5 16-18 26-30 24-10-2-13-14-5-22 7-7 22-8 35-2z" opacity="0.55" />
        <path d="M60 50c5 16 18 26 30 24 10-2 13-14 5-22-7-7-22-8-35-2z" opacity="0.55" />
        <ellipse cx="60" cy="50" rx="2.6" ry="16" />
      </g>
    </svg>
  );
}

export function IconTarget({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="5" aria-hidden="true">
      <circle cx="50" cy="50" r="30" />
      <circle cx="50" cy="50" r="6" fill="currentColor" stroke="none" />
      <path d="M50 4v16M50 80v16M4 50h16M80 50h16" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeadphones({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="6" aria-hidden="true">
      <path d="M20 62V50a30 30 0 0160 0v12" strokeLinecap="round" />
      <rect x="12" y="58" width="18" height="26" rx="6" fill="currentColor" stroke="none" />
      <rect x="70" y="58" width="18" height="26" rx="6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBook({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="6" aria-hidden="true">
      <path d="M50 26C40 18 24 18 16 22v50c8-4 24-4 34 4 10-8 26-8 34-4V22c-8-4-24-4-34 4z" />
      <path d="M50 30v46" />
    </svg>
  );
}

export function IconSun({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="6" aria-hidden="true">
      <circle cx="50" cy="50" r="18" />
      <path d="M50 8v14M50 78v14M8 50h14M78 50h14M22 22l10 10M68 68l10 10M78 22L68 32M32 68 22 78" strokeLinecap="round" />
    </svg>
  );
}

export function IconChat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="6" aria-hidden="true">
      <path d="M18 24h64a6 6 0 016 6v34a6 6 0 01-6 6H44L26 82V70h-8a6 6 0 01-6-6V30a6 6 0 016-6z" />
    </svg>
  );
}

export function IconMoon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden="true">
      <path d="M62 12a38 38 0 1026 44A30 30 0 0162 12z" />
    </svg>
  );
}

export function IconCompassMove({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.5" />
      <polygon points="50,26 56,50 50,46 44,50" fill="currentColor" />
      <polygon points="50,74 44,50 50,54 56,50" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
