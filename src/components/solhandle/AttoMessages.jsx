import { useEffect, useRef } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import ReactMarkdown from 'react-markdown';

export default function AttoMessages({ messages, loading, replying }) {
  const bottom = useRef(null);
  const { t } = useLanguage();
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, replying]);
  return <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite" aria-label="Atto conversation">
    {!messages.length && !loading && <div className="flex gap-3"><p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-slate-200">{t("Hi, I'm Atto! Ask me about minting an @handle, trading, SolHandle Pay, the SDK, or the Growth Curve.")}</p></div>}
    {loading && <p className="text-sm text-cyan-200">{t('Loading conversation…')}</p>}
    {messages.map((message, i) => <div key={i} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] min-w-0 break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-tr-sm bg-cyan-300 text-slate-950' : 'rounded-tl-sm border border-white/10 bg-white/5 text-slate-100'}`}>
        {message.role === 'user' ? message.content : <ReactMarkdown components={{ a: ({ href, children }) => <a href={href} className="font-medium text-cyan-300 underline" target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{children}</a>, p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p> }}>{message.content || ''}</ReactMarkdown>}
      </div>
    </div>)}
    {replying && <p className="pl-10 text-xs text-cyan-200">{t('Atto is thinking…')}</p>}
    <div ref={bottom}/>
  </div>;
}