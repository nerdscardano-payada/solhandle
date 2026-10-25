import { base44 } from '@/api/base44Client';
import prepareProfileAvatar from '@/components/solhandle/profile/prepareProfileAvatar';
const encode = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const decode = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));
export async function uploadProfileAvatar(file) {
  const image = await prepareProfileAvatar(file);
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, await image.arrayBuffer());
  const upload = new File([encrypted], `profile-${crypto.randomUUID()}.bin`, { type: 'application/octet-stream' });
  const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file: upload });
  return { file_uri, key: encode(await crypto.subtle.exportKey('raw', key)), iv: encode(iv) };
}
export async function readProfileAvatar(avatar, signal) {
  const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: avatar.file_uri, expires_in: 60 });
  const response = await fetch(signed_url, { signal, cache: 'no-store' });
  if (!response.ok || Number(response.headers.get('content-length')) > 2 * 1024 * 1024) throw new Error('Profile photo unavailable.');
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > 2 * 1024 * 1024) throw new Error('Profile photo is too large.');
  const key = await crypto.subtle.importKey('raw', decode(avatar.key), 'AES-GCM', false, ['decrypt']);
  const image = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(avatar.iv) }, key, bytes);
  return new Blob([image], { type: 'image/jpeg' });
}