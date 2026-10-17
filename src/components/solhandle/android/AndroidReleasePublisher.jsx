import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import AndroidReleaseFields from '@/components/solhandle/android/AndroidReleaseFields';
export default function AndroidReleasePublisher({ current, onPublished }) {
  const { user } = useAuth(), { t } = useLanguage();
  const [values, setValues] = useState({ version: '', version_code: '', minimum_android: '8.0', apk_url: '', sha256: '', certificate_sha256: '' });
  const [checked, setChecked] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(''), [saved, setSaved] = useState(false);
  if (user?.role !== 'admin') return null;
  const submit = async event => {
    event.preventDefault(); setError(''); setSaved(false); setBusy(true);
    try {
      const url = new URL(values.apk_url.trim());
      if (url.protocol !== 'https:' || url.username || url.password || !url.pathname.toLowerCase().endsWith('.apk')) throw new Error(t('Use a public HTTPS URL pointing directly to an APK file.'));
      const code = Number(values.version_code);
      if (!Number.isSafeInteger(code) || code <= (current?.version_code || 0)) throw new Error(t('Use a version code higher than the current release.'));
      if (current && current.certificate_sha256.toLowerCase() !== values.certificate_sha256.toLowerCase()) throw new Error(t('Updates must use the same signing certificate as the previous release.'));
      if (!checked) throw new Error(t('Complete the device checklist before publishing.'));
      await base44.entities.AndroidRelease.create({ ...values, apk_url: url.href, version_code: code, sha256: values.sha256.toLowerCase(), certificate_sha256: values.certificate_sha256.toLowerCase(), device_checked: true, status: 'published' });
      await onPublished(); setSaved(true); setChecked(false);
    } catch (err) { setError(err.message || t('Publishing failed.')); }
    finally { setBusy(false); }
  };
  return <details className="rounded-2xl border border-names-accent/30 bg-card p-5 sm:p-7"><summary className="cursor-pointer font-semibold">{t('Publish release')} · Admin</summary><form onSubmit={submit} className="mt-5 space-y-5"><p className="text-sm leading-relaxed text-muted-foreground">{t('Only administrators can publish. Upload the signed APK to public HTTPS hosting first; do not upload your keystore. Copy the fingerprints printed by the build script.')}</p><AndroidReleaseFields values={values} setValues={setValues} disabled={busy}/><label className="flex items-start gap-3 text-sm leading-relaxed"><input required type="checkbox" checked={checked} disabled={busy} onChange={event => setChecked(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-current"/>{t('I verified the APK signature, public download, wallet flow, back navigation and update installation on a real Android device.')}</label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}{saved && <p role="status" className="text-sm text-names-success">{t('Release published. The public download is now updated.')}</p>}<Button type="submit" disabled={busy || !checked} className="min-h-11 w-full bg-names-accent text-hero-canvas">{busy && <Loader2 className="animate-spin"/>}{t('Publish APK download')}</Button></form></details>;
}