const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export default function createStaticTranslator(dictionary) {
  const templates = Object.entries(dictionary).filter(([source]) => /\{\d+\}/.test(source)).map(([source, translated]) => {
    const slots = [];
    const pattern = source.split(/(\{\d+\})/).map(part => {
      if (!/^\{\d+\}$/.test(part)) return escape(part);
      slots.push(Number(part.slice(1, -1)));
      return '(.*?)';
    }).join('');
    return { pattern: new RegExp(`^${pattern}$`), slots, translated };
  });
  const caseInsensitive = new Map(Object.entries(dictionary).map(([key, value]) => [key.toLowerCase(), value]));
  const translate = (value, recursive = false, depth = 0) => {
    if (typeof value !== 'string' || depth > 5) return value;
    const normalized = value.replace(/\s+/g, ' ').trim();
    let output = dictionary[normalized] || (recursive ? caseInsensitive.get(normalized.toLowerCase()) : undefined);
    if (!output) {
      for (const template of templates) {
        const match = normalized.match(template.pattern);
        if (!match) continue;
        output = template.translated.replace(/\{(\d+)\}/g, (_, slot) => {
          const part = match[1 + template.slots.indexOf(Number(slot))];
          return recursive ? translate(part, true, depth + 1) : part;
        });
        break;
      }
    }
    if (!output && recursive) {
      const parts = normalized.split(/( · |, )/);
      if (parts.length > 1) {
        const translated = parts.map((part, index) => index % 2 ? part : translate(part, true, depth + 1));
        if (translated.some((part, index) => part !== parts[index])) output = translated.join('');
      }
    }
    return output ? value.match(/^\s*/)[0] + output + value.match(/\s*$/)[0] : value;
  };
  return translate;
}