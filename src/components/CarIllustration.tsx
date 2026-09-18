import React from 'react';
import { Car } from '../types';

interface Props {
  car: Car;
  className?: string;
}

export const CarIllustration: React.FC<Props> = ({ car, className = 'w-full h-48' }) => {
  const primary = car.colorHex;
  const secondary = car.secondaryHex || '#1e293b';

  // Render distinctive silhouette based on body type / model
  const renderSilhouette = () => {
    if (car.bodyType === '4x4') {
      // Boxy offroader like Mahindra Thar
      return (
        <g id="thar-silhouette">
          {/* Ground shadow */}
          <ellipse cx="200" cy="182" rx="160" ry="12" fill="#000000" opacity="0.18" />

          {/* Underbody chassis */}
          <rect x="58" y="146" width="284" height="14" rx="4" fill="#18181b" />

          {/* Rear mounted spare wheel */}
          <rect x="36" y="70" width="26" height="74" rx="8" fill="#27272a" />
          <circle cx="49" cy="107" r="18" fill="#52525b" />
          <circle cx="49" cy="107" r="8" fill="#18181b" />

          {/* Main rugged body shell */}
          <path
            d="M 60 148 L 60 82 L 102 82 L 126 38 L 244 38 L 272 82 L 340 86 L 348 108 L 348 148 Z"
            fill={primary}
          />

          {/* Hardtop roof (Secondary color) */}
          <path
            d="M 60 82 L 126 38 L 246 38 L 274 82 Z"
            fill={secondary}
            opacity="0.95"
          />

          {/* Heavy wheel arches / flares */}
          <path d="M 88 152 A 38 38 0 0 1 164 152 Z" fill="#27272a" />
          <path d="M 238 152 A 38 38 0 0 1 314 152 Z" fill="#27272a" />

          {/* Windows / Tinted Glass */}
          {/* Rear quarter glass */}
          <polygon points="74,80 118,50 162,50 162,80" fill="#0f172a" opacity="0.82" />
          {/* Front side glass */}
          <polygon points="172,50 236,50 258,80 172,80" fill="#0f172a" opacity="0.82" />
          {/* Windshield pillar highlight */}
          <line x1="240" y1="42" x2="266" y2="80" stroke="#ffffff" strokeWidth="2.5" opacity="0.35" />

          {/* Distinctive Vertical Grille & Round Headlamp */}
          <rect x="336" y="88" width="10" height="28" rx="2" fill="#27272a" />
          <circle cx="342" cy="100" r="7" fill="#fef08a" opacity="0.9" />
          <circle cx="342" cy="100" r="4" fill="#ffffff" />

          {/* Heavy-duty steel front bumper with tow hooks */}
          <rect x="328" y="132" width="26" height="20" rx="3" fill="#18181b" />
          <rect x="348" y="138" width="4" height="8" rx="2" fill="#dc2626" />

          {/* Character lines & door hinge details */}
          <line x1="68" y1="108" x2="330" y2="108" stroke="#000000" strokeWidth="1.5" opacity="0.4" />
          <rect x="164" y="98" width="4" height="14" rx="2" fill="#3f3f46" />
          <rect x="168" y="112" width="14" height="4" rx="2" fill="#18181b" />

          {/* Heavy Duty All-Terrain Offroad Wheels */}
          {/* Left Wheel */}
          <circle cx="126" cy="154" r="32" fill="#18181b" />
          <circle cx="126" cy="154" r="23" fill="#3f3f46" />
          <circle cx="126" cy="154" r="14" fill="#71717a" stroke="#d4d4d8" strokeWidth="3" />
          <circle cx="126" cy="154" r="5" fill="#18181b" />

          {/* Right Wheel */}
          <circle cx="276" cy="154" r="32" fill="#18181b" />
          <circle cx="276" cy="154" r="23" fill="#3f3f46" />
          <circle cx="276" cy="154" r="14" fill="#71717a" stroke="#d4d4d8" strokeWidth="3" />
          <circle cx="276" cy="154" r="5" fill="#18181b" />
        </g>
      );
    }

    if (car.bodyType === 'Sedan') {
      // Flowing sedan like Honda City, Hyundai Verna
      return (
        <g id="sedan-silhouette">
          <ellipse cx="200" cy="178" rx="165" ry="10" fill="#000000" opacity="0.16" />

          {/* Underbody */}
          <rect x="52" y="148" width="298" height="8" rx="4" fill="#18181b" />

          {/* Aerodynamic Sedan Body */}
          <path
            d="M 50 148 L 54 116 L 86 110 L 132 64 L 230 64 L 284 104 L 344 114 L 354 130 L 354 148 Z"
            fill={primary}
          />

          {/* Sleek roof reflection */}
          <path
            d="M 132 64 L 230 64 L 280 102 L 134 102 Z"
            fill="#ffffff"
            opacity="0.12"
          />

          {/* Greenhouse Glass / Windows with chrome garnish */}
          <path
            d="M 94 106 L 136 68 L 194 68 L 194 106 Z"
            fill="#0f172a"
            opacity="0.86"
          />
          <path
            d="M 200 68 L 226 68 L 272 106 L 200 106 Z"
            fill="#0f172a"
            opacity="0.86"
          />

          {/* Chrome window underline belt */}
          <line x1="92" y1="107" x2="276" y2="107" stroke="#e2e8f0" strokeWidth="2" opacity="0.85" />

          {/* Full-width Horizon LED DRL / Headlamp cluster */}
          <polygon points="328,114 354,118 350,126 322,122" fill="#38bdf8" opacity="0.9" />
          <line x1="330" y1="116" x2="354" y2="119" stroke="#ffffff" strokeWidth="2.5" />

          {/* Tail light cluster with connecting lightbar cue */}
          <polygon points="50,118 64,116 64,128 52,128" fill="#ef4444" />

          {/* Sharp body crease line */}
          <path d="M 70 120 Q 200 114 340 124" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" fill="none" />

          {/* Wheel cutouts */}
          <path d="M 86 150 A 30 30 0 0 1 146 150 Z" fill="#18181b" />
          <path d="M 256 150 A 30 30 0 0 1 316 150 Z" fill="#18181b" />

          {/* Precision Diamond-cut Alloys */}
          {/* Front Wheel */}
          <circle cx="116" cy="150" r="26" fill="#18181b" />
          <circle cx="116" cy="150" r="19" fill="#334155" />
          <circle cx="116" cy="150" r="10" fill="#94a3b8" stroke="#ffffff" strokeWidth="2" />
          {/* Wheel spokes */}
          <line x1="98" y1="150" x2="134" y2="150" stroke="#f1f5f9" strokeWidth="2" />
          <line x1="116" y1="132" x2="116" y2="168" stroke="#f1f5f9" strokeWidth="2" />
          <circle cx="116" cy="150" r="4" fill="#0f172a" />

          {/* Rear Wheel */}
          <circle cx="286" cy="150" r="26" fill="#18181b" />
          <circle cx="286" cy="150" r="19" fill="#334155" />
          <circle cx="286" cy="150" r="10" fill="#94a3b8" stroke="#ffffff" strokeWidth="2" />
          <line x1="268" y1="150" x2="304" y2="150" stroke="#f1f5f9" strokeWidth="2" />
          <line x1="286" y1="132" x2="286" y2="168" stroke="#f1f5f9" strokeWidth="2" />
          <circle cx="286" cy="150" r="4" fill="#0f172a" />

          {/* Shark fin antenna */}
          <polygon points="120,64 126,56 130,64" fill={primary} />
        </g>
      );
    }

    if (car.bodyType === 'MUV') {
      // Innova Crysta executive 7-seater MUV
      return (
        <g id="muv-silhouette">
          <ellipse cx="200" cy="180" rx="168" ry="11" fill="#000000" opacity="0.18" />

          {/* Side footstep board */}
          <rect x="136" y="152" width="128" height="6" rx="2" fill="#64748b" />

          {/* Big MUV Body */}
          <path
            d="M 52 148 L 50 86 L 76 56 L 230 56 L 282 92 L 348 106 L 354 134 L 354 148 Z"
            fill={primary}
          />

          {/* Extended Glasshouse for 3 Rows */}
          <polygon points="76,62 126,62 126,94 72,94" fill="#0f172a" opacity="0.85" />
          <polygon points="132,62 194,62 194,94 132,94" fill="#0f172a" opacity="0.85" />
          <polygon points="200,62 230,62 268,94 200,94" fill="#0f172a" opacity="0.85" />

          {/* Roof rails */}
          <rect x="90" y="52" width="130" height="3" rx="1.5" fill="#94a3b8" />

          {/* Big Chrome Slatted Grille */}
          <polygon points="328,102 354,106 352,130 324,128" fill="#334155" />
          <line x1="332" y1="112" x2="352" y2="114" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="330" y1="120" x2="350" y2="122" stroke="#cbd5e1" strokeWidth="2" />

          {/* Dual LED Projector Headlamp */}
          <polygon points="318,100 344,104 338,114 316,112" fill="#e0f2fe" opacity="0.95" />
          <circle cx="330" cy="107" r="3" fill="#ffffff" />

          {/* Wheel cutouts with cladding */}
          <path d="M 82 150 A 32 32 0 0 1 146 150 Z" fill="#1e293b" />
          <path d="M 254 150 A 32 32 0 0 1 318 150 Z" fill="#1e293b" />

          {/* Wheels */}
          <circle cx="114" cy="152" r="28" fill="#18181b" />
          <circle cx="114" cy="152" r="20" fill="#475569" />
          <circle cx="114" cy="152" r="11" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
          <circle cx="114" cy="152" r="4" fill="#0f172a" />

          <circle cx="286" cy="152" r="28" fill="#18181b" />
          <circle cx="286" cy="152" r="20" fill="#475569" />
          <circle cx="286" cy="152" r="11" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
          <circle cx="286" cy="152" r="4" fill="#0f172a" />
        </g>
      );
    }

    if (car.bodyType === 'Hatchback') {
      // Compact sporty Hatchback / Tiago EV / Baleno
      const isEv = car.fuelType === 'Electric';
      return (
        <g id="hatchback-silhouette">
          <ellipse cx="200" cy="176" rx="155" ry="10" fill="#000000" opacity="0.16" />

          {/* Body */}
          <path
            d="M 64 148 L 58 114 L 88 100 L 136 56 L 224 56 L 274 96 L 334 108 L 344 130 L 344 148 Z"
            fill={primary}
          />

          {/* Dual tone roof if secondary specified */}
          {car.secondaryHex && (
            <path
              d="M 88 100 L 136 56 L 224 56 L 244 80 L 100 80 Z"
              fill={secondary}
              opacity="0.95"
            />
          )}

          {/* Windows */}
          <polygon points="98,96 138,62 184,62 184,96" fill="#0f172a" opacity="0.84" />
          <polygon points="190,62 218,62 260,96 190,96" fill="#0f172a" opacity="0.84" />

          {/* Sporty Rear Spoiler */}
          <rect x="74" y="54" width="22" height="6" rx="2" fill={secondary} />

          {/* Headlamp */}
          <polygon points="314,106 342,112 334,124 310,118" fill={isEv ? '#38bdf8' : '#fef08a'} opacity="0.9" />

          {/* EV Aero Grille or Chrome Accents */}
          {isEv ? (
            <g>
              <rect x="318" y="122" width="24" height="6" rx="3" fill="#0284c7" />
              <text x="323" y="127" fill="#ffffff" fontSize="5" fontWeight="bold">EV</text>
            </g>
          ) : (
            <rect x="316" y="122" width="26" height="5" rx="2" fill="#334155" />
          )}

          {/* Wheel cutouts */}
          <path d="M 88 150 A 28 28 0 0 1 144 150 Z" fill="#18181b" />
          <path d="M 246 150 A 28 28 0 0 1 302 150 Z" fill="#18181b" />

          {/* Wheels */}
          <circle cx="116" cy="150" r="25" fill="#18181b" />
          <circle cx="116" cy="150" r="17" fill="#475569" />
          <circle cx="116" cy="150" r="9" fill="#94a3b8" stroke={isEv ? '#0284c7' : '#ffffff'} strokeWidth="2" />
          <circle cx="116" cy="150" r="4" fill="#0f172a" />

          <circle cx="274" cy="150" r="25" fill="#18181b" />
          <circle cx="274" cy="150" r="17" fill="#475569" />
          <circle cx="274" cy="150" r="9" fill="#94a3b8" stroke={isEv ? '#0284c7' : '#ffffff'} strokeWidth="2" />
          <circle cx="274" cy="150" r="4" fill="#0f172a" />
        </g>
      );
    }

    // Default: Modern Compact / Mid SUV (Nexon, Creta, Brezza, Seltos, Punch, Scorpio-N)
    const isBigSuv = car.model.includes('Scorpio');
    return (
      <g id="suv-silhouette">
        <ellipse cx="200" cy="180" rx="164" ry="11" fill="#000000" opacity="0.18" />

        {/* Rugged Bottom Cladding */}
        <rect x="52" y="142" width="298" height="14" rx="4" fill="#18181b" />

        {/* Silver Skid Plate */}
        <rect x="320" y="146" width="28" height="6" rx="2" fill="#94a3b8" />
        <rect x="56" y="146" width="24" height="6" rx="2" fill="#94a3b8" />

        {/* Muscular SUV Body */}
        <path
          d={
            isBigSuv
              ? "M 52 144 L 52 86 L 78 52 L 236 52 L 278 88 L 346 102 L 354 130 L 354 144 Z"
              : "M 54 144 L 56 94 L 84 62 L 230 62 L 276 96 L 344 106 L 352 130 L 352 144 Z"
          }
          fill={primary}
        />

        {/* Contrast Dual Tone Roof */}
        {car.secondaryHex && (
          <path
            d={
              isBigSuv
                ? "M 78 52 L 236 52 L 254 76 L 82 76 Z"
                : "M 84 62 L 230 62 L 250 82 L 88 82 Z"
            }
            fill={secondary}
            opacity="0.95"
          />
        )}

        {/* Roof Rails */}
        <rect x="94" y={isBigSuv ? "48" : "58"} width="124" height="4" rx="2" fill="#cbd5e1" />

        {/* SUV Glasshouse */}
        <polygon
          points={isBigSuv ? "82,58 132,58 132,88 78,88" : "90,68 136,68 136,94 86,94"}
          fill="#0f172a"
          opacity="0.85"
        />
        <polygon
          points={isBigSuv ? "138,58 200,58 200,88 138,88" : "142,68 198,68 198,94 142,94"}
          fill="#0f172a"
          opacity="0.85"
        />
        <polygon
          points={isBigSuv ? "206,58 232,58 266,88 206,88" : "204,68 226,68 262,94 204,94"}
          fill="#0f172a"
          opacity="0.85"
        />

        {/* High-Mounted LED DRL & Projector Lamp */}
        <polygon points="318,102 348,108 340,118 314,114" fill="#38bdf8" opacity="0.9" />
        <circle cx="334" cy="110" r="3.5" fill="#ffffff" />

        {/* Front Signature Grille */}
        <polygon points="328,118 350,120 348,136 324,134" fill="#18181b" />
        <line x1="330" y1="124" x2="348" y2="125" stroke="#94a3b8" strokeWidth="2" />
        <line x1="328" y1="130" x2="346" y2="131" stroke="#94a3b8" strokeWidth="2" />

        {/* Dynamic Shoulder Character Line */}
        <path d="M 64 104 Q 190 98 334 114" stroke="#ffffff" strokeWidth="1.8" opacity="0.35" fill="none" />

        {/* Wheel Arches with Thick SUV Cladding */}
        <path d="M 84 148 A 34 34 0 0 1 152 148 Z" fill="#18181b" />
        <path d="M 252 148 A 34 34 0 0 1 320 148 Z" fill="#18181b" />

        {/* SUV Alloy Wheels with Brake Discs */}
        <circle cx="118" cy="150" r="28" fill="#18181b" />
        <circle cx="118" cy="150" r="20" fill="#334155" />
        <circle cx="118" cy="150" r="11" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="2" />
        <line x1="98" y1="150" x2="138" y2="150" stroke="#f1f5f9" strokeWidth="2.5" />
        <line x1="118" y1="130" x2="118" y2="170" stroke="#f1f5f9" strokeWidth="2.5" />
        <circle cx="118" cy="150" r="4.5" fill="#0f172a" />

        <circle cx="286" cy="150" r="28" fill="#18181b" />
        <circle cx="286" cy="150" r="20" fill="#334155" />
        <circle cx="286" cy="150" r="11" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="2" />
        <line x1="266" y1="150" x2="306" y2="150" stroke="#f1f5f9" strokeWidth="2.5" />
        <line x1="286" y1="130" x2="286" y2="170" stroke="#f1f5f9" strokeWidth="2.5" />
        <circle cx="286" cy="150" r="4.5" fill="#0f172a" />
      </g>
    );
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-100 to-slate-200/80 p-2 ${className}`}>
      {/* Subtle Studio Backdrop Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/70 via-transparent to-slate-200/40" />

      {/* SVG Canvas with standard viewBox */}
      <svg
        viewBox="0 0 400 210"
        className="w-full h-full object-contain relative z-10 drop-shadow-sm transition-transform duration-300 hover:scale-105"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${car.brand} ${car.model}`}
      >
        <defs>
          <linearGradient id={`grad-${car.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {renderSilhouette()}
      </svg>
    </div>
  );
};
