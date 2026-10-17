import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
export default function AndroidInstallSteps() {
  const { t } = useLanguage();
  const steps = [
    ['Download the APK', 'Use the download on this page. No Google Play account is needed.'],
    ['Allow this installation', 'Android may ask you to allow “Install unknown apps” for your browser. Turn this off again after installing.'],
    ['Install and open SolHandle', 'Open the downloaded APK. Keep Android System WebView up to date.'],
    ['Connect your wallet', 'Use an MWA-compatible Android wallet, such as Solflare. Approve each signing request in your wallet.'],
  ];
  return <section className="rounded-2xl border border-border bg-card p-5 sm:p-7"><h2 className="text-xl font-bold">{t('Install without Google Play')}</h2><ol className="mt-6 space-y-6">{steps.map(([title, description], index) => <li key={title} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-names-accent/10 text-sm font-bold text-names-accent">{index + 1}</span><div><h3 className="font-semibold">{t(title)}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(description)}</p></div></li>)}</ol><p className="mt-6 flex gap-2 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground"><ShieldCheck className="h-5 w-5 shrink-0 text-names-accent"/>{t('Your wallet keeps your keys. Connecting or signing a message never grants automatic permission to send funds.')}</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t('Wallet compatibility depends on the wallet version. Phantom and Backpack support is not guaranteed. Updates are installed manually from this page.')}</p></section>;
}