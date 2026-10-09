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
  return value => {
    if (typeof value !== 'string') return value;
    const normalized = value.replace(/\s+/g, ' ').trim();
    let output = dictionary[normalized];
    if (!output) {
      for (const template of templates) {
        const match = normalized.match(template.pattern);
        if (!match) continue;
        output = template.translated.replace(/\{(\d+)\}/g, (_, slot) => match[1 + template.slots.indexOf(Number(slot))]);
        break;
      }
    }
    return output ? value.match(/^\s*/)[0] + output + value.match(/\s*$/)[0] : value;
  };
}