import { readProfileAvatar } from '@/components/solhandle/profile/profileAvatarStorage';
export async function cardImage(source) {
 const blob = source instanceof Blob ? source : await fetch(source, { mode: 'cors' }).then(response => {
  if (!response.ok) throw new Error('Artwork could not be downloaded. Please retry.');
  return response.blob();
 });
 const url = URL.createObjectURL(blob);
 try {
  return await new Promise((resolve, reject) => {
   const image = new window.Image();
   image.onload = () => resolve(image);
   image.onerror = () => reject(new Error('An image could not be loaded for your card. Please retry.'));
   image.src = url;
  });
 } finally { URL.revokeObjectURL(url); }
}
export async function identityCardImages(profile, artwork, qr) {
 return Promise.all([cardImage(artwork), profile.avatar ? readProfileAvatar(profile.avatar).then(cardImage) : null, cardImage(qr)]);
}
export function coverImage(ctx, image, x, y, width, height) {
 const scale = Math.max(width / image.width, height / image.height);
 const w = width / scale, h = height / scale;
 ctx.drawImage(image, (image.width - w) / 2, (image.height - h) / 2, w, h, x, y, width, height);
}