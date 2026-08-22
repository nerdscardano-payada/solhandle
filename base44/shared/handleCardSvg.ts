// Deterministic SolHandle NFT card SVG — mirrors the on-site HandleNftCard design.
// Built to be maximally compatible with limited SVG renderers (e.g. Phantom mobile):
// NO filters (feGaussianBlur), NO <use>/<symbol> references — everything inlined.
// Only linearGradient/radialGradient + basic rect/text/path are used.

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function buildHandleCardSvg(handle: string): string {
  const label = `@${handle}`;
  const fontSize = label.length <= 6 ? 132 : label.length <= 10 ? 104 : label.length <= 14 ? 84 : 66;
  const charWidth = fontSize * 0.58;
  const textWidth = label.length * charWidth;
  const minX = 130;
  const maxX = 1150;
  const textX = Math.max(minX + textWidth / 2, Math.min(640, maxX - textWidth / 2));
  const logoScale = 0.17;
  const logoBox = 397 * logoScale;
  const logoX = 640 - logoBox / 2;
  const logoY = 150;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#022B27"/>
      <stop offset="0.5" stop-color="#05060A"/>
      <stop offset="1" stop-color="#1A0838"/>
    </linearGradient>
    <radialGradient id="tealGlow" cx="0.18" cy="0.5" r="0.55">
      <stop offset="0" stop-color="#00F5C8" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#00F5C8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="purpleGlow" cx="0.85" cy="0.5" r="0.55">
      <stop offset="0" stop-color="#8A2BE2" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#8A2BE2" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="borderGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#67E8F9"/>
      <stop offset="0.5" stop-color="#7DD3FC"/>
      <stop offset="1" stop-color="#A855F7"/>
    </linearGradient>
    <linearGradient id="handleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22D3EE"/>
      <stop offset="0.5" stop-color="#7DD3FC"/>
      <stop offset="1" stop-color="#A855F7"/>
    </linearGradient>
    <linearGradient id="sepGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#67E8F9" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#A5F3FC" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#A855F7" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="solMark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#9945FF"/>
      <stop offset="0.4" stop-color="#8A2BE2"/>
      <stop offset="1" stop-color="#14F195"/>
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="1280" height="720" fill="url(#bgGrad)"/>
  <rect x="0" y="0" width="1280" height="720" fill="url(#tealGlow)"/>
  <rect x="0" y="0" width="1280" height="720" fill="url(#purpleGlow)"/>

  <rect x="280" y="96" width="720" height="528" rx="40" fill="#04060D" stroke="url(#borderGrad)" stroke-width="3"/>

  <g transform="translate(${logoX.toFixed(0)} ${logoY.toFixed(0)}) scale(${logoScale})">
    <path d="M64 129.5C66.1 127.4 69 126.3 72 126.3H341.9C346.9 126.3 349.4 132.4 345.9 135.9L292.5 189.3C290.4 191.4 287.5 192.5 284.5 192.5H14.6C9.6 192.5 7.1 186.4 10.6 182.9L64 129.5Z" fill="url(#solMark)"/>
    <path d="M292.5 198.5C290.4 196.4 287.5 195.3 284.5 195.3H14.6C9.6 195.3 7.1 201.4 10.6 204.9L64 258.3C66.1 260.4 69 261.5 72 261.5H341.9C346.9 261.5 349.4 255.4 345.9 251.9L292.5 198.5Z" fill="url(#solMark)"/>
    <path d="M64 267.5C66.1 265.4 69 264.3 72 264.3H341.9C346.9 264.3 349.4 270.4 345.9 273.9L292.5 327.3C290.4 329.4 287.5 330.5 284.5 330.5H14.6C9.6 330.5 7.1 324.4 10.6 320.9L64 267.5Z" fill="url(#solMark)"/>
  </g>

  <text x="${textX.toFixed(0)}" y="420" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" text-anchor="middle" fill="url(#handleGrad)">${escapeXml(label)}</text>

  <rect x="380" y="470" width="520" height="1.5" fill="url(#sepGrad)"/>

  <text x="640" y="540" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="26" text-anchor="middle" letter-spacing="10" fill="#A5F3FC">SOLHANDLE</text>

  <text x="640" y="588" font-family="Arial, Helvetica, sans-serif" font-weight="500" font-size="24" text-anchor="middle" fill="#F1F5F9">✦ Official SolHandle</text>
</svg>`;
}