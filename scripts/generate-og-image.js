import fs from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const svgPath = path.resolve('public/og-image.svg')
const pngPath = path.resolve('public/og-image.png')

const svg = fs.readFileSync(svgPath, 'utf8')
const resvg = new Resvg(svg, {
  fitTo: {
    mode: 'width',
    value: 1200,
  },
})

const pngData = resvg.render()
const pngBuffer = pngData.asPng()

fs.writeFileSync(pngPath, pngBuffer)
console.log('Successfully generated public/og-image.png (' + pngBuffer.length + ' bytes)')
