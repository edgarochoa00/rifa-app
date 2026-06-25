import React from 'react';

export default function CrownVicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 120 40" 
      fill="none" 
      {...props}
    >
      {/* Wheels - Black tires, gray hubcaps */}
      <circle cx="28" cy="28" r="6" fill="#000" />
      <circle cx="28" cy="28" r="3.5" fill="#e2e8f0" />
      <circle cx="28" cy="28" r="1.5" fill="#94a3b8" />
      
      <circle cx="92" cy="28" r="6" fill="#000" />
      <circle cx="92" cy="28" r="3.5" fill="#e2e8f0" />
      <circle cx="92" cy="28" r="1.5" fill="#94a3b8" />

      {/* Main Body - White with Black Outline */}
      <path 
        d="M 6 26
           L 6 18 
           L 10 18 
           L 14 17 
           L 32 17 
           L 44 7 
           L 68 7 
           L 78 17 
           L 112 18 
           L 114 20 
           L 114 26 
           L 108 26 
           L 108 28 
           L 100 28 
           A 7 7 0 0 0 84 28
           L 36 28
           A 7 7 0 0 0 20 28
           L 12 28
           L 12 26
           Z" 
        fill="#f8fafc" 
        stroke="#0f172a" 
        strokeWidth="1.5" 
        strokeLinejoin="round" 
      />

      {/* Chrome Bumpers */}
      <path d="M 4 23 L 7 23 L 7 26 L 4 26 Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1" />
      <path d="M 113 23 L 116 23 L 116 26 L 113 26 Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1" />
      
      {/* Side Trim (Chrome strip) */}
      <line x1="12" y1="21" x2="108" y2="21" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="12" y1="22" x2="108" y2="22" stroke="#0f172a" strokeWidth="0.5" />

      {/* Windows - Dark tinted */}
      {/* Rear Window & C-Pillar */}
      <path d="M 33 17 L 45 8 L 54 8 L 54 17 Z" fill="#0f172a" />
      {/* Front Window & Door */}
      <path d="M 58 8 L 67 8 L 76 17 L 58 17 Z" fill="#0f172a" />
      
      {/* Front Grille area */}
      <rect x="111" y="18" width="3" height="4" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.5" />
      
      {/* Headlight */}
      <rect x="108" y="18.5" width="2" height="2" fill="#fde047" />
      
      {/* Taillight */}
      <rect x="6" y="18.5" width="2" height="3" fill="#ef4444" />
      
      {/* Door handle */}
      <rect x="55" y="19" width="3" height="1" fill="#0f172a" />
    </svg>
  );
}
