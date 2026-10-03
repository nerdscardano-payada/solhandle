import http from 'node:http';
const base = 'http://127.0.0.1:18902';
const server = http.createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Cache-Control', 'no-store');
  if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
  if (request.method !== 'GET') { response.writeHead(405); response.end(); return; }
  const path = new URL(request.url, base).pathname;
  const match = path.match(/^\/([a-z0-9]{1,20})\.(json|svg)$/);
  if (path === '/collection.json') {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ name: 'SolHandle Local Test Collection', description: 'Local validator only. These NFTs are not mainnet handles.', image: `${base}/solhandle.svg` })); return;
  }
  if (!match) { response.writeHead(404); response.end('Not found'); return; }
  const [, handle, extension] = match;
  if (extension === 'svg') {
    response.setHeader('Content-Type', 'image/svg+xml');
    response.end(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#050811"/><rect x="40" y="40" width="720" height="720" rx="40" fill="#0f172a" stroke="#67e8f9"/><text x="400" y="130" fill="#a78bfa" text-anchor="middle" font-family="Arial" font-size="24">SOLHANDLE · LOCAL VALIDATOR</text><text x="400" y="420" fill="#67e8f9" text-anchor="middle" font-family="Arial" font-size="${handle.length > 12 ? 40 : 60}">@${handle}</text><text x="400" y="690" fill="#94a3b8" text-anchor="middle" font-family="Arial" font-size="22">Test NFT · no mainnet value</text></svg>`); return;
  }
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify({ name: `@${handle}`, description: 'NFT-native identity on the isolated SolHandle local validator. Not a mainnet handle.', image: `${base}/${handle}.svg`, external_url: `${base}/${handle}.json`, attributes: [{ trait_type: 'Handle', value: handle }, { trait_type: 'Network', value: 'localnet' }] }));
});
server.listen(18902, '127.0.0.1', () => console.log(`Local test metadata available at ${base}`));