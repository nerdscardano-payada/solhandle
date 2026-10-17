// ZIP with stored (uncompressed) UTF-8 entries, requiring no additional package.
const sources = import.meta.glob(['./project/*.kts', './project/gradle.properties', './project/*.sh', './project/README.md', './project/app/*.kts', './project/app/src/main/**/*.kt', './project/app/src/main/**/*.xml'], { eager: true, query: '?raw', import: 'default' });
const hidden = import.meta.glob('./project/.gitignore', { eager: true, query: '?raw', import: 'default' });
const crc32 = bytes => {
  let crc = -1;
  for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); }
  return (crc ^ -1) >>> 0;
};
const header = (size, values) => {
  const bytes = new Uint8Array(size), view = new DataView(bytes.buffer);
  values.forEach(([offset, value, length]) => length === 2 ? view.setUint16(offset, value, true) : view.setUint32(offset, value, true));
  return bytes;
};
export default function downloadProject() {
  const encoder = new TextEncoder(), local = [], central = [];
  let offset = 0, count = 0, centralSize = 0;
  for (const [path, text] of Object.entries({ ...sources, ...hidden })) {
    const name = encoder.encode('SolHandleAndroid/' + path.replace('./project/', ''));
    const bytes = encoder.encode(text), crc = crc32(bytes);
    const entry = header(30, [[0, 0x04034b50, 4], [4, 20, 2], [6, 0x800, 2], [12, 0x21, 2], [14, crc, 4], [18, bytes.length, 4], [22, bytes.length, 4], [26, name.length, 2]]);
    const directory = header(46, [[0, 0x02014b50, 4], [4, 20, 2], [6, 20, 2], [8, 0x800, 2], [14, 0x21, 2], [16, crc, 4], [20, bytes.length, 4], [24, bytes.length, 4], [28, name.length, 2], [42, offset, 4]]);
    local.push(entry, name, bytes); central.push(directory, name);
    offset += entry.length + name.length + bytes.length; centralSize += directory.length + name.length; count++;
  }
  const end = header(22, [[0, 0x06054b50, 4], [8, count, 2], [10, count, 2], [12, centralSize, 4], [16, offset, 4]]);
  const url = URL.createObjectURL(new Blob([...local, ...central, end], { type: 'application/zip' }));
  const link = document.createElement('a'); link.href = url; link.download = 'SolHandleAndroid-project.zip'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}