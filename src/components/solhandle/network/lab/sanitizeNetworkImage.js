export default async function sanitizeNetworkImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error('Choose a JPEG, PNG or WebP image up to 10 MB.');
  const bitmap = await window.createImageBitmap(file);
  if (bitmap.width * bitmap.height > 40000000) { bitmap.close(); throw new Error('Image exceeds 40 megapixels.'); }
  const scale = Math.min(1, 2048 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.85));
  if (!blob) throw new Error('Could not process this image.');
  return { file: new File([blob], blob.type === 'image/webp' ? 'network-image.webp' : 'network-image.png', { type: blob.type }), width: canvas.width, height: canvas.height };
}