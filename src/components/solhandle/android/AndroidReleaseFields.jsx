import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/i18n/LanguageProvider';
const fields = [['version', 'Version', 'text', '1.0.0'], ['version_code', 'Version code', 'number', '1'], ['minimum_android', 'Minimum Android version', 'text', '8.0'], ['apk_url', 'Public HTTPS APK URL', 'url', ''], ['sha256', 'APK SHA-256', 'text', ''], ['certificate_sha256', 'Signing certificate SHA-256', 'text', '']];
export default function AndroidReleaseFields({ values, setValues, disabled }) {
  const { t } = useLanguage();
  return <div className="space-y-4">{fields.map(([name, label, type, placeholder]) => <label key={name} className="block text-sm font-medium">{t(label)}<Input required disabled={disabled} type={type} min={type === 'number' ? 1 : undefined} step={type === 'number' ? 1 : undefined} pattern={name.includes('sha256') ? '[a-fA-F0-9]{64}' : undefined} maxLength={name.includes('sha256') ? 64 : 2000} value={values[name]} onChange={event => setValues(current => ({ ...current, [name]: event.target.value }))} placeholder={placeholder} className="mt-2 bg-background"/></label>)}</div>;
}