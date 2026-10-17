import { useState } from 'react';
import { Download, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/LanguageProvider';
export default function AndroidReleaseCard({ release, loading, error, retry }) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const valid = release && /^https:\/\//.test(release.apk_url) && /^[a-f0-9]{64}$/i.test(release.sha256);
  return <section className="rounded-2xl border border-names-accent/30 bg-card p-6 sm:p-8">
    {loading ? <p role="status" className="flex gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin"/>{t('Loading release…')}</p> : error ? <div role="alert"><p>{t('The release could not be loaded.')}</p><Button variant="outline" onClick={retry} className="mt-4">{t('Try again')}</Button></div> : valid ? <>
      <span className="rounded-full bg-names-success/10 px-3 py-1 text-xs font-semibold text-names-success">Android APK</span>
      <h2 className="mt-5 text-2xl font-bold">SolHandle {release.version}</h2>
      <p className="mt-2 text-sm text-muted-foreground">Android {release.minimum_android}+ · {new Date(release.created_date).toLocaleDateString(language)}</p>
      <Button asChild className="mt-6 min-h-12 w-full bg-names-accent font-semibold text-hero-canvas hover:bg-names-accent/90"><a href={release.apk_url} target="_blank" rel="noopener noreferrer"><Download className="h-5 w-5"/>{t('Download APK')}</a></Button>
      <details className="mt-5 border-t border-border pt-4"><summary className="cursor-pointer text-sm text-muted-foreground">{t('Verify this download')}</summary><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t('Compare the SHA-256 of the downloaded file. Do not install it if the checksum differs or Android reports an invalid signature.')}</p><div className="mt-4 flex items-center justify-between gap-2"><span className="text-xs">SHA-256</span><Button variant="ghost" size="sm" aria-label={t('Copy checksum')} onClick={async () => { await navigator.clipboard.writeText(release.sha256); setCopied(true); }}>{copied ? <Check/> : <Copy/>}{t(copied ? 'Copied' : 'Copy')}</Button></div><code className="block break-all text-xs leading-relaxed text-names-accent">{release.sha256}</code><p className="mt-4 text-xs text-muted-foreground">{t('Signing certificate SHA-256')}</p><code className="mt-2 block break-all text-xs leading-relaxed">{release.certificate_sha256}</code></details>
    </> : <><span className="rounded-full bg-names-warning/10 px-3 py-1 text-xs font-semibold text-names-warning">{t('Not released yet')}</span><h2 className="mt-5 text-2xl font-bold">{t('The first APK is being prepared')}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('There is no installable APK available yet. A signed release will appear here after it has been built and checked on an Android device.')}</p></>}
  </section>;
}