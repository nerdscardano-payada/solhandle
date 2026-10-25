export const listingImageSizes = { pfp_url: [512, 512], banner_url: [1500, 500] };
export default async function prepareListingImage(file, kind) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG or WebP image.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Choose an image smaller than 8 MB.');
  let bitmap;
  try { bitmap = await window.createImageBitmap(file); } catch { throw new Error('This image could not be opened. Choose a different file.'); }
  try {
    if (bitmap.width * bitmap.height > 24000000) throw new Error('Choose an image with no more than 24 megapixels.');
    const [width, height] = listingImageSizes[kind];
    const scale = Math.max(width / bitmap.width, height / bitmap.height);
    const cropWidth = width / scale, cropHeight = height / scale;
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    canvas.getContext('2d').drawImage(bitmap, (bitmap.width-cropWidth)/2, (bitmap.height-cropHeight)/2, cropWidth, cropHeight, 0, 0, width, height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob || blob.size > 4 * 1024 * 1024) throw new Error('This image could not be prepared. Try a smaller image.');
    return new File([blob], `listing-${kind === 'pfp_url' ? 'pfp' : 'banner'}.png`, { type: 'image/png' });
  } finally { bitmap.close(); }
}