import { identityCardImages, coverImage } from '@/components/solhandle/profile/identityCardImages';
export default async function downloadIdentityCard({ profile, identity, url, qr, surface }) {
 const [art, avatar, code] = await identityCardImages(profile, identity.image, qr);
 const styles = window.getComputedStyle(surface), token = name => styles.getPropertyValue(name).trim();
 const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 800;
 const ctx = canvas.getContext('2d');
 ctx.fillStyle = token('--eco-canvas'); ctx.fillRect(0, 0, 1200, 800);
 const gradient = ctx.createLinearGradient(0, 0, 1200, 0);
 gradient.addColorStop(0, token('--eco-purple')); gradient.addColorStop(1, token('--eco-cyan'));
 ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1200, 8);
 const text = (value, x, y, size, color, bold = false) => {
  ctx.fillStyle = token(color); ctx.font = `${bold ? '700' : '400'} ${size}px ${token('--eco-font')}`; ctx.fillText(value, x, y);
 };
 text('SOLHANDLE / DIGITAL IDENTITY', 48, 64, 20, '--eco-cyan', true);
 // Contain the actual minted artwork without replacing it with generated art.
 const scale = Math.min(420 / art.width, 420 / art.height);
 ctx.drawImage(art, 48 + (420 - art.width * scale) / 2, 112 + (420 - art.height * scale) / 2, art.width * scale, art.height * scale);
 if (avatar) { ctx.save(); ctx.beginPath(); ctx.arc(570, 156, 44, 0, Math.PI * 2); ctx.clip(); coverImage(ctx, avatar, 526, 112, 88, 88); ctx.restore(); }
 else text('@', 534, 174, 54, '--eco-cyan', true);
 text(`@${profile.handle}`, 526, 260, profile.handle.length > 14 ? 35 : 48, '--eco-text', true);
 const characters = Array.from(profile.bio || ''); let line = '', y = 308;
 ctx.font = `400 23px ${token('--eco-font')}`;
 for (const character of characters) {
  if (ctx.measureText(line + character).width > 580 && line) { text(line, 526, y, 23, '--eco-muted'); y += 32; line = character; }
  else line += character;
 }
 if (line) text(line, 526, y, 23, '--eco-muted');
 ctx.drawImage(code, 526, 400, 180, 180);
 text('Scan to view profile', 730, 452, 25, '--eco-text', true);
 text('Add contact or pay on Solana', 730, 488, 20, '--eco-muted');
 text('Connect with me on Solana.', 48, 636, 32, '--eco-text', true);
 text(url, 48, 686, 21, '--eco-cyan');
 text(`Ownership checked ${new Date(identity.checkedAt).toISOString().replace('T', ' ').slice(0, 19)} UTC`, 48, 732, 18, '--eco-muted');
 text('Snapshot only. Scan for current ownership. Not personal identity verification.', 48, 764, 16, '--eco-muted');
 const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
 if (!blob) throw new Error('Card download failed. Please retry.');
 const objectUrl = URL.createObjectURL(blob), link = document.createElement('a');
 link.href = objectUrl; link.download = `solhandle-${profile.handle}-identity.png`; document.body.appendChild(link); link.click(); link.remove();
 setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
}