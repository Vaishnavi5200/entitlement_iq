import React from 'react';

interface LogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'print';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'md':
        return 'w-8 h-8';
      case 'lg':
        return 'w-11 h-11';
      case 'xl':
        return 'w-16 h-16';
      default:
        return 'w-8 h-8';
    }
  };

  // The Icon Shield SVG (matches uploaded image with golden shield, crane, rain storm & golden swoosh check)
  const ShieldIcon = ({ iconClass = '' }: { iconClass?: string }) => (
    <svg
      viewBox="0 0 100 100"
      className={`${getIconSize()} ${iconClass} shrink-0 drop-shadow-sm select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="shieldDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0B1120" />
        </linearGradient>
      </defs>

      {/* Shield Border */}
      <path
        d="M 50 8 C 72 14 84 20 84 45 C 84 68 68 84 50 92 C 32 84 16 68 16 45 C 16 20 28 14 50 8 Z"
        fill="url(#shieldDarkGrad)"
        stroke="url(#shieldGoldGrad)"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Crane & Building (Left) */}
      <g transform="translate(-4, -2)">
        <line x1="36" y1="32" x2="36" y2="68" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="26" y1="35" x2="48" y2="35" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="28" x2="36" y2="35" stroke="#94A3B8" strokeWidth="2" />
        <line x1="45" y1="35" x2="45" y2="44" stroke="#FCD34D" strokeWidth="1.5" />
        {/* Buildings */}
        <polygon points="38,52 46,45 46,74 38,74" fill="#64748B" />
        <polygon points="46,45 54,39 54,74 46,74" fill="#475569" />
      </g>

      {/* Storm Cloud & Lightning (Right) */}
      <g transform="translate(6, -2)">
        <path
          d="M 54 38 C 54 34 57 31 61 31 C 63 27 67 25 71 25 C 76 25 80 29 81 33 C 83 33 85 35 85 38 C 85 41 82 43 79 43 L 57 43 C 54 43 54 41 54 38 Z"
          fill="#94A3B8"
        />
        {/* Lightning */}
        <polygon
          points="68,41 62,50 67,50 64,59 72,48 67,48"
          fill="#F59E0B"
          filter="drop-shadow(0 0 2px #FBBF24)"
        />
        {/* Rain streaks */}
        <line x1="58" y1="46" x2="55" y2="52" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="75" y1="46" x2="72" y2="52" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Golden Checkmark Swoosh */}
      <path
        d="M 40 68 L 52 80 C 60 72 74 54 88 44 C 80 56 65 77 52 84 Z"
        fill="url(#shieldGoldGrad)"
      />
    </svg>
  );

  if (variant === 'icon') {
    return <ShieldIcon iconClass={className} />;
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <ShieldIcon iconClass="w-16 h-16" />
        </div>
        <div className="mt-3">
          <div className="text-xl font-extrabold tracking-tight">
            <span className="text-white">Entitlement</span>
            <span className="text-amber-400">IQ</span>
          </div>
          {showTagline && (
            <div className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-0.5">
              CONSTRUCTION CLAIMS INTELLIGENCE
            </div>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (Ideal for Navbar, Sidebar & Report Headers)
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <ShieldIcon />
      <div className="leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-extrabold tracking-tight text-white">
            Entitlement<span className="text-amber-400">IQ</span>
          </span>
        </div>
        {showTagline && (
          <div className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            Claims Intelligence
          </div>
        )}
      </div>
    </div>
  );
};
