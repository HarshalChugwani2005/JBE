import fs from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const outputDir = path.resolve('src/assets/images/ceiling-fans')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const fans = [
  {
    name: 'titan.jpg',
    title: 'ZIPSY Titan',
    subtitle: '100% Copper Winding · Double Ball Bearing',
    accentColor: '#92400E',
    bodyColor: '#78350F',
    trimColor: '#F59E0B',
    bgColor: '#1C1917',
    bladeColor: '#451A03',
    bladeTrim: '#D97706',
  },
  {
    name: 'glory.jpg',
    title: 'ZIPSY Glory',
    subtitle: '405 RPM · Hi-Air Delivery · Cherry Red',
    accentColor: '#991B1B',
    bodyColor: '#7F1D1D',
    trimColor: '#F87171',
    bgColor: '#18181B',
    bladeColor: '#5C1D1D',
    bladeTrim: '#EF4444',
  },
  {
    name: 'bounce.jpg',
    title: 'ZIPSY Bounce',
    subtitle: 'Contemporary Aero Blade · Energy Saver',
    accentColor: '#0284C7',
    bodyColor: '#0369A1',
    trimColor: '#38BDF8',
    bgColor: '#0F172A',
    bladeColor: '#1E293B',
    bladeTrim: '#38BDF8',
  },
  {
    name: 'zoro.jpg',
    title: 'ZIPSY Zoro',
    subtitle: 'Metallic Antique Finish · High Torque Motor',
    accentColor: '#B45309',
    bodyColor: '#78350F',
    trimColor: '#FDE68A',
    bgColor: '#18181B',
    bladeColor: '#292524',
    bladeTrim: '#F59E0B',
  },
  {
    name: 'wonder.jpg',
    title: 'ZIPSY Wonder',
    subtitle: 'High Speed Aero Dynamic Finish',
    accentColor: '#4F46E5',
    bodyColor: '#3730A3',
    trimColor: '#818CF8',
    bgColor: '#1E1B4B',
    bladeColor: '#312E81',
    bladeTrim: '#A5B4FC',
  },
  {
    name: 'intex-designer.jpg',
    title: 'Intex Designer (Sona)',
    subtitle: '850 RPM Hi-Speed · Dust-Free Tech · Super Enamelled',
    accentColor: '#D97706',
    bodyColor: '#854D0E',
    trimColor: '#FEF08A',
    bgColor: '#1C1917',
    bladeColor: '#3F2C1D',
    bladeTrim: '#FBBF24',
  },
]

for (const fan of fans) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none">
    <!-- Gradient background with studio spotlight -->
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stop-color="${fan.accentColor}" stop-opacity="0.35"/>
        <stop offset="60%" stop-color="${fan.bgColor}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#09090B" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${fan.bladeColor}"/>
        <stop offset="100%" stop-color="#18181B"/>
      </linearGradient>
      <linearGradient id="motorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${fan.trimColor}"/>
        <stop offset="40%" stop-color="${fan.bodyColor}"/>
        <stop offset="100%" stop-color="#0F0F10"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>

    <rect width="800" height="600" fill="url(#bgGlow)"/>

    <!-- Subtle product stage pedestal -->
    <ellipse cx="400" cy="460" rx="260" ry="40" fill="#000000" fill-opacity="0.45" filter="url(#shadow)"/>
    <ellipse cx="400" cy="450" rx="220" ry="24" fill="${fan.accentColor}" fill-opacity="0.1"/>

    <!-- Ceiling Fan Assembly -->
    <g transform="translate(400, 260)" filter="url(#shadow)">
      <!-- Downrod & Canopy -->
      <rect x="-8" y="-190" width="16" height="120" fill="#27272A" rx="4"/>
      <path d="M-28 -190 L28 -190 L18 -150 L-18 -150 Z" fill="${fan.bodyColor}" stroke="${fan.trimColor}" stroke-width="1.5"/>
      <path d="M-36 -80 L36 -80 L20 -50 L-20 -50 Z" fill="${fan.bodyColor}" stroke="${fan.trimColor}" stroke-width="1.5"/>

      <!-- 3 Fan Blades -->
      <!-- Blade 1: Top Right (Angle ~30 deg) -->
      <g transform="rotate(30)">
        <path d="M25 -18 C90 -24, 210 -35, 270 -20 C290 -15, 290 15, 270 20 C210 35, 90 24, 25 18 Z" fill="url(#bladeGrad)" stroke="${fan.bladeTrim}" stroke-width="2"/>
        <line x1="45" y1="0" x2="255" y2="0" stroke="${fan.trimColor}" stroke-width="2" stroke-dasharray="8 6" stroke-opacity="0.6"/>
      </g>

      <!-- Blade 2: Bottom Right (Angle 150 deg) -->
      <g transform="rotate(150)">
        <path d="M25 -18 C90 -24, 210 -35, 270 -20 C290 -15, 290 15, 270 20 C210 35, 90 24, 25 18 Z" fill="url(#bladeGrad)" stroke="${fan.bladeTrim}" stroke-width="2"/>
        <line x1="45" y1="0" x2="255" y2="0" stroke="${fan.trimColor}" stroke-width="2" stroke-dasharray="8 6" stroke-opacity="0.6"/>
      </g>

      <!-- Blade 3: Left (Angle 270 deg) -->
      <g transform="rotate(270)">
        <path d="M25 -18 C90 -24, 210 -35, 270 -20 C290 -15, 290 15, 270 20 C210 35, 90 24, 25 18 Z" fill="url(#bladeGrad)" stroke="${fan.bladeTrim}" stroke-width="2"/>
        <line x1="45" y1="0" x2="255" y2="0" stroke="${fan.trimColor}" stroke-width="2" stroke-dasharray="8 6" stroke-opacity="0.6"/>
      </g>

      <!-- Central Motor Housing -->
      <circle cx="0" cy="0" r="54" fill="url(#motorGrad)" stroke="${fan.trimColor}" stroke-width="3"/>
      <circle cx="0" cy="0" r="42" fill="${fan.bodyColor}" stroke="${fan.trimColor}" stroke-width="1.5" stroke-opacity="0.8"/>
      
      <!-- Center Emblem / Logo Plate -->
      <circle cx="0" cy="0" r="26" fill="#18181B" stroke="${fan.trimColor}" stroke-width="2"/>
      <polygon points="0,-14 12,10 -12,10" fill="${fan.trimColor}"/>
    </g>

    <!-- Top Badge -->
    <rect x="36" y="36" width="160" height="32" rx="16" fill="#18181B" fill-opacity="0.8" stroke="${fan.trimColor}" stroke-width="1"/>
    <text x="116" y="57" fill="${fan.trimColor}" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1">AUTHENTIC MODEL</text>

    <!-- Product Title & Info Banner at Bottom -->
    <rect x="36" y="490" width="728" height="76" rx="16" fill="#18181B" fill-opacity="0.85" stroke="#3F3F46" stroke-width="1"/>
    <text x="64" y="526" fill="#F4F4F5" font-family="system-ui, sans-serif" font-size="22" font-weight="800">${fan.title}</text>
    <text x="64" y="548" fill="#A1A1AA" font-family="system-ui, sans-serif" font-size="14">${fan.subtitle}</text>
    
    <rect x="610" y="510" width="130" height="36" rx="8" fill="${fan.accentColor}"/>
    <text x="675" y="533" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">JBE ORIGINAL</text>
  </svg>
  `

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 800 },
  })
  const pngBuffer = resvg.render().asPng()
  const filePath = path.join(outputDir, fan.name)
  fs.writeFileSync(filePath, pngBuffer)
  console.log(`Generated ${fan.name} (${pngBuffer.length} bytes)`)
}
