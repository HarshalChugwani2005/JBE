import fs from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const svgPath = path.resolve('public/favicon.svg')
if (!fs.existsSync(svgPath)) {
  console.error('favicon.svg not found in public/')
  process.exit(1)
}

const svg = fs.readFileSync(svgPath, 'utf8')

const targets = [
  { file: 'public/pwa-192x192.png', size: 192 },
  { file: 'public/pwa-512x512.png', size: 512 },
  { file: 'public/apple-touch-icon.png', size: 180 },
  { file: 'public/pwa-maskable-512x512.png', size: 512 },
]

for (const { file, size } of targets) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  const pngBuffer = resvg.render().asPng()
  fs.writeFileSync(path.resolve(file), pngBuffer)
  console.log(`✓ Generated ${file} (${size}x${size}, ${pngBuffer.length} bytes)`)
}
