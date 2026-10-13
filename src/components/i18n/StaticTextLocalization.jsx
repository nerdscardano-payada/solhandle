import { useLayoutEffect, useMemo, useRef } from 'react';
import createStaticTranslator from '@/components/i18n/createStaticTranslator';
import { useLanguage } from '@/components/i18n/LanguageProvider';

const ignored = 'script,style,pre,code,textarea,input,[data-no-translate]';
const attributes = ['aria-label', 'title', 'placeholder', 'alt'];
export default function StaticTextLocalization() {
  const { staticTranslations } = useLanguage();
  const originals = useRef(new WeakMap());
  const translate = useMemo(() => createStaticTranslator(staticTranslations), [staticTranslations]);
  useLayoutEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    let frame = null;
    const localize = (target, value, attribute) => {
      const stored = originals.current.get(target) || {};
      const key = attribute || 'text';
      const previous = stored[key];
      const source = previous?.output === value ? previous.source : value;
      const element = attribute ? target : target.parentElement;
      const output = translate(source, Boolean(element?.closest('[data-localize-slots]')));
      stored[key] = { source, output };
      originals.current.set(target, stored);
      if (value !== output) {
        if (attribute) target.setAttribute(attribute, output);
        else target.nodeValue = output;
      }
    };
    const scan = () => {
      frame = null;
      const surfaces = [root, ...document.querySelectorAll('[data-demo-localization]')].filter((element, index, all) => !all.slice(0, index).some(other => other.contains(element)));
      surfaces.forEach(surface => {
        const walker = document.createTreeWalker(surface, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (!node.parentElement?.closest(ignored)) localize(node, node.nodeValue);
        }
        surface.querySelectorAll(attributes.map(name => `[${name}]`).join(',')).forEach(element => {
          if (element.closest('script,style,pre,code,[data-no-translate]')) return;
          attributes.forEach(name => { if (element.hasAttribute(name)) localize(element, element.getAttribute(name), name); });
        });
      });
    };
    const observer = new MutationObserver(() => { if (frame === null) frame = requestAnimationFrame(scan); });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
    scan();
    return () => { observer.disconnect(); if (frame !== null) cancelAnimationFrame(frame); };
  }, [translate]);
  return null;
}