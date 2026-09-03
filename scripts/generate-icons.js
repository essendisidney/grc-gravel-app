const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function makeIcon(size, out) {
  const r = Math.round(size * 0.22)
  const inset = Math.round(size * 0.08)
  const inner = Math.round(size * 0.84)
  const ir = Math.round(size * 0.18)
  const font = Math.round(size * 0.28)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#1C1916"/>
  <rect x="${inset}" y="${inset}" width="${inner}" height="${inner}" rx="${ir}" fill="#E07A2F"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial Black, Arial, sans-serif" font-size="${font}" font-weight="800" fill="#FFFFFF">GRC</text>
</svg>`
  await sharp(Buffer.from(svg)).png().toFile(out)
}

;(async () => {
  const dir = path.join(__dirname, 'public', 'icons')
  fs.mkdirSync(dir, { recursive: true })
  await makeIcon(192, path.join(dir, 'icon-192.png'))
  await makeIcon(512, path.join(dir, 'icon-512.png'))
  await makeIcon(180, path.join(dir, 'apple-touch-icon.png'))
  console.log('icons-ok')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
