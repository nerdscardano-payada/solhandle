import { buildHandleCardSvg } from "@/lib/handleCardSvg";

// Renders the deterministic SolHandle card to a 1280x720 PNG Blob in the browser,
// so wallets/marketplaces get a real raster image (SVG support is unreliable).
export async function buildHandlePngBlob(handle) {
  const svg = buildHandleCardSvg(handle);
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const image = new Image();
  image.decoding = "async";
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error("Failed to render SolHandle card image."));
    image.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, 1280, 720);
  URL.revokeObjectURL(url);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(new File([blob], `${handle}.png`, { type: "image/png" })) : reject(new Error("PNG export failed."))), "image/png");
  });
}