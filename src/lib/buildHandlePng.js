// Renders the SolHandle NFT card directly to a 1280x720 PNG via the Canvas 2D API.
// Drawing primitives (not SVG rasterization) guarantees identical output across
// browsers and wallets, matching the on-site HandleNftCard design exactly.

const BG_URL = "https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/21d822722_image.png";

const SOL_PATHS = [
  "M64 129.5C66.1 127.4 69 126.3 72 126.3H341.9C346.9 126.3 349.4 132.4 345.9 135.9L292.5 189.3C290.4 191.4 287.5 192.5 284.5 192.5H14.6C9.6 192.5 7.1 186.4 10.6 182.9L64 129.5Z",
  "M292.5 198.5C290.4 196.4 287.5 195.3 284.5 195.3H14.6C9.6 195.3 7.1 201.4 10.6 204.9L64 258.3C66.1 260.4 69 261.5 72 261.5H341.9C346.9 261.5 349.4 255.4 345.9 251.9L292.5 198.5Z",
  "M64 267.5C66.1 265.4 69 264.3 72 264.3H341.9C346.9 264.3 349.4 270.4 345.9 273.9L292.5 327.3C290.4 329.4 287.5 330.5 284.5 330.5H14.6C9.6 330.5 7.1 324.4 10.6 320.9L64 267.5Z"
];

function loadImage(src, crossOrigin) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawSolanaLogo(ctx, cx, top, targetHeight) {
  const scale = targetHeight / 204; // original logo height ~204
  const lw = 357 * scale;
  const left = cx - lw / 2;
  const grad = ctx.createLinearGradient(cx, top, cx, top + targetHeight);
  grad.addColorStop(0, "#67E8F9");
  grad.addColorStop(0.5, "#8A2BE2");
  grad.addColorStop(1, "#A855F7");
  ctx.save();
  ctx.transform(scale, 0, 0, scale, left, top);
  ctx.lineWidth = 2 / scale;
  ctx.fillStyle = grad;
  ctx.fill(new Path2D(SOL_PATHS[0]));
  ctx.fill(new Path2D(SOL_PATHS[1]));
  ctx.fill(new Path2D(SOL_PATHS[2]));
  ctx.restore();
}

export async function buildHandlePngBlob(handle) {
  const W = 1280, H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // --- Background (same asset the on-site card uses) ---
  let bg = null;
  try {
    bg = await loadImage(BG_URL, true);
  } catch (_) {
    bg = null;
  }
  if (bg && bg.width > 0) {
    ctx.drawImage(bg, 0, 0, W, H);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, W, 0);
    bgGrad.addColorStop(0, "#022B27");
    bgGrad.addColorStop(0.5, "#05060A");
    bgGrad.addColorStop(1, "#1A0838");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    const teal = ctx.createRadialGradient(W * 0.18, H * 0.5, 0, W * 0.18, H * 0.5, W * 0.55);
    teal.addColorStop(0, "rgba(0,245,200,0.34)");
    teal.addColorStop(1, "rgba(0,245,200,0)");
    ctx.fillStyle = teal;
    ctx.fillRect(0, 0, W, H);
    const purple = ctx.createRadialGradient(W * 0.82, H * 0.5, 0, W * 0.82, H * 0.5, W * 0.55);
    purple.addColorStop(0, "rgba(138,43,226,0.34)");
    purple.addColorStop(1, "rgba(138,43,226,0)");
    ctx.fillStyle = purple;
    ctx.fillRect(0, 0, W, H);
  }

  // dark wash over artwork
  ctx.fillStyle = "rgba(2,6,23,0.38)";
  ctx.fillRect(0, 0, W, H);

  // --- Inner glass card ---
  const cx = W * 0.08;
  const cy = H * 0.15;
  const cw = W * 0.84;
  const ch = H * 0.7;
  const r = 28;

  roundRect(ctx, cx, cy, cw, ch, r);
  ctx.fillStyle = "rgba(2,6,13,0.55)";
  ctx.fill();

  const borderGrad = ctx.createLinearGradient(cx, 0, cx + cw, 0);
  borderGrad.addColorStop(0, "#7DD3FC");
  borderGrad.addColorStop(0.5, "#A5F3FC");
  borderGrad.addColorStop(1, "#C4B5FD");
  ctx.lineWidth = 3;
  ctx.strokeStyle = borderGrad;
  ctx.shadowColor = "rgba(34,211,238,0.45)";
  ctx.shadowBlur = 26;
  roundRect(ctx, cx, cy, cw, ch, r);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // --- Solana logo ---
  drawSolanaLogo(ctx, W / 2, cy + 60, 90);

  // --- Handle text with horizontal gradient ---
  const label = `@${handle}`;
  const size = label.length <= 6 ? 120 : label.length <= 10 ? 96 : label.length <= 14 ? 78 : 60;
  ctx.font = `700 ${size}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const tw = ctx.measureText(label).width;
  const tx = W / 2;
  const ty = cy + ch * 0.58;
  const textGrad = ctx.createLinearGradient(tx - tw / 2, 0, tx + tw / 2, 0);
  textGrad.addColorStop(0, "#67E8F9");
  textGrad.addColorStop(0.5, "#7DD3FC");
  textGrad.addColorStop(1, "#A78BFA");
  ctx.fillStyle = textGrad;
  ctx.fillText(label, tx, ty);

  // --- Divider ---
  const dy = ty + size * 0.75;
  const divGrad = ctx.createLinearGradient(cx + 60, 0, cx + cw - 60, 0);
  divGrad.addColorStop(0, "rgba(103,232,249,0)");
  divGrad.addColorStop(0.5, "rgba(165,243,252,0.5)");
  divGrad.addColorStop(1, "rgba(168,85,247,0)");
  ctx.fillStyle = divGrad;
  ctx.fillRect(cx + 60, dy, cw - 120, 2);

  // --- "SOLHANDLE" with letter spacing ---
  const brand = "SOLHANDLE";
  ctx.font = `600 30px Arial, Helvetica, sans-serif`;
  const step = ctx.measureText(brand).width;
  const spacing = 12;
  const totalW = step + spacing * (brand.length - 1);
  let bx = W / 2 - totalW / 2;
  ctx.fillStyle = "#A5F3FC";
  ctx.textAlign = "left";
  for (const ch2 of brand) {
    ctx.fillText(ch2, bx, dy + 36);
    bx += ctx.measureText(ch2).width + spacing;
  }

  // --- Footer tag ---
  ctx.font = `500 26px Arial, Helvetica, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText("✦ Official SolHandle", W / 2, dy + 74);

  return await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(new File([blob], `${handle}.png`, { type: "image/png" })) : reject(new Error("PNG export failed."))),
      "image/png"
    );
  });
}