export async function validateDiscoverImages(data) {
  for (const [key, width, height] of [['pfp_url',512,512],['banner_url',1500,500]]) {
    const fail = () => Object.assign(new Error(key === 'banner_url' ? 'Upload a banner image sized 1500 × 500 px using the listing form.' : 'Upload a profile picture sized 512 × 512 px using the listing form.'), {status:400});
    let url;
    try { url = new URL(data[key]); } catch { throw fail(); }
    if (data[key].length > 2048 || url.protocol !== 'https:' || url.username || url.password || url.port || !['media.base44.com','static.wixstatic.com','base44.app'].includes(url.hostname)) throw fail();
    const response = await fetch(url.href, { headers: { Range: 'bytes=0-23' }, redirect: 'error', signal: AbortSignal.timeout(10000) });
    if (!response.ok || !response.body) throw fail();
    const reader = response.body.getReader(), header = new Uint8Array(24);
    let offset = 0;
    try { while (offset < 24) { const {value,done} = await reader.read(); if (done) break; const size = Math.min(value.length,24-offset); header.set(value.subarray(0,size),offset); offset += size; } }
    finally { await reader.cancel(); }
    const view = new DataView(header.buffer);
    if (offset !== 24 || view.getUint32(0) !== 0x89504e47 || view.getUint32(4) !== 0x0d0a1a0a || view.getUint32(12) !== 0x49484452 || view.getUint32(16) !== width || view.getUint32(20) !== height) throw fail();
  }
}