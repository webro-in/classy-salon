/**
 * Generates favicon/touch icons from the client's logo mark and the default
 * share image (real salon photo + emblem). Re-run after changing either file:
 *
 *   npx tsx scripts/generate-icons.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const serif = readFileSync('node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2').toString('base64')
const sans = readFileSync('node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2').toString('base64')
const fonts = `@font-face{font-family:S;src:url(data:font/woff2;base64,${serif})}@font-face{font-family:G;src:url(data:font/woff2;base64,${sans})}`
const mark = readFileSync('public/logo/logo-mark.svg', 'utf8')
const markData = `data:image/svg+xml;base64,${Buffer.from(mark).toString('base64')}`
const photoOf = (file: string) => `data:image/jpeg;base64,${readFileSync(`public/media/photos/${file}`).toString('base64')}`

// favicon.svg: the emblem on white, padded (no ® at favicon size is not possible to strip safely, so keep the file as supplied).
writeFileSync('public/icons/favicon.svg', mark.replace('<svg ', '<svg width="64" height="64" '))

const iconHtml = (size: number) => `<html><head><style>html,body{margin:0}</style></head><body><div style="width:${size}px;height:${size}px;background:#fff;display:flex;align-items:center;justify-content:center"><img src="${markData}" style="width:${size * 0.78}px;height:${size * 0.78}px"></div></body></html>`

const ogHtml = (photo: string, kicker: string) => `<html><head><style>${fonts}html,body{margin:0}</style></head><body>
<div style="width:1200px;height:630px;display:flex;background:#fff;color:#17140F">
  <div style="width:560px;padding:64px 64px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
    <img src="${markData}" style="width:96px;height:96px">
    <div>
      <div style="font-family:S;font-size:112px;line-height:.9;letter-spacing:.06em;text-transform:uppercase">Classy</div>
      <div style="font-family:G;font-weight:500;font-size:18px;letter-spacing:.32em;text-transform:uppercase;color:#6B6158;margin-top:18px">Unisex Salon · Jaipur</div>
    </div>
    <div style="font-family:G;font-size:24px;border-top:1px solid #E5DED4;padding-top:24px">${kicker}</div>
  </div>
  <div style="flex:1;background:url(${photo}) center/cover"></div>
</div></body></html>`

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH })
const page = await browser.newPage()
for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]] as const) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(iconHtml(size))
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: `public/icons/${file}` })
}
await page.setViewportSize({ width: 1200, height: 630 })
for (const [file, photo, kicker] of [
  ['og-default.jpg', 'heroSlideHair.jpg', 'Hair · Skin · Makeup &nbsp;·&nbsp; Jagatpura'],
  ['og-services.jpg', 'serviceHairImage.jpg', 'Our Services &nbsp;·&nbsp; Hair · Skin · Makeup'],
  ['og-gallery.jpg', 'work01.jpg', 'Gallery &nbsp;·&nbsp; Real work from the salon'],
] as const) {
  await page.setContent(ogHtml(photoOf(photo), kicker))
  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: `public/icons/${file}`, type: 'jpeg', quality: 86 })
}
await browser.close()
console.log('Icons + og-default.jpg written to public/icons/ from the client logo mark')
