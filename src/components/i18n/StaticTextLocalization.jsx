import { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

const ignored = 'script,style,pre,code,textarea,input,[data-no-translate]';
const attributes = ['aria-label', 'title', 'placeholder', 'alt'];
export default function StaticTextLocalization() {
  const { staticTranslations } = useLanguage();
  const originals = useRef(new WeakMap());
  useLayoutEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    let frame = null;
    const localize = (target, value, attribute) => {
      const stored = originals.current.get(target) || {};
      const key = attribute || 'text';
      const previous = stored[key];
      const source = previous?.output === value ? previous.source : value;
      const normalized = source.replace(/\s+/g, ' ').trim();
      const translation = staticTranslations[normalized];
      const output = translation ? source.match(/^\s*/)[0] + translation + source.match(/\s*$/)[0] : source;
      stored[key] = { source, output };
      originals.current.set(target, stored);
      if (value !== output) {
        if (attribute) target.setAttribute(attribute, output);
        else target.nodeValue = output;
      }
    };
    const scan = () => {
      frame = null;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.parentElement?.closest(ignored)) localize(node, node.nodeValue);
      }
      root.querySelectorAll(attributes.map(name => `[${name}]`).join(',')).forEach(element => {
        if (element.closest('script,style,pre,code,[data-no-translate]')) return;
        attributes.forEach(name => { if (element.hasAttribute(name)) localize(element, element.getAttribute(name), name); });
      });
    };
    const observer = new MutationObserver(() => { if (frame === null) frame = requestAnimationFrame(scan); });
    observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
    scan();
    return () => { observer.disconnect(); if (frame !== null) cancelAnimationFrame(frame); };
  }, [staticTranslations]);
  return null;
}