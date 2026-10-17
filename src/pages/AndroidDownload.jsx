import { useQuery } from '@tanstack/react-query';
import { Smartphone, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import Header from '@/components/solhandle/Header';
import AndroidReleaseCard from '@/components/solhandle/android/AndroidReleaseCard';
import AndroidInstallSteps from '@/components/solhandle/android/AndroidInstallSteps';
import AndroidBuildGuide from '@/components/solhandle/android/AndroidBuildGuide';
import AndroidReleasePublisher from '@/components/solhandle/android/AndroidReleasePublisher';
export default function AndroidDownload() {
  const { t } = useLanguage(), { user } = useAuth();
  const query = useQuery({ queryKey: ['android-release'], queryFn: async () => { const page = await base44.entities.AndroidRelease.filter({ status: 'published' }, { sort: '-version_code', limit: 1 }); return page.items[0] || null; }, staleTime: 30000 });
  return <main className="min-h-screen text-foreground"><Header/><div className="mx-auto max-w-4xl space-y-7 px-5 py-9 sm:py-14"><header className="max-w-2xl"><span className="mb-5 inline-flex items-center gap-2 rounded-full border border-names-accent/25 bg-names-accent/5 px-3 py-2 text-xs font-semibold text-names-accent"><Smartphone className="h-4 w-4"/>SolHandle · Android</span><h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('SolHandle on your phone.')}</h1><p className="mt-4 text-base leading-relaxed text-muted-foreground">{t('Your handles. Your wallet. One Android app, installed directly without Google Play.')}</p></header><div className="grid items-start gap-6 sm:grid-cols-2"><AndroidReleaseCard release={query.data} loading={query.isLoading} error={query.error} retry={() => query.refetch()}/><AndroidInstallSteps/></div><AndroidBuildGuide/><AndroidReleasePublisher current={query.data} onPublished={() => query.refetch()}/>{!user && <p className="text-center text-sm text-muted-foreground"><Link to="/login?returnTo=%2Fandroid" className="inline-flex items-center gap-1 underline underline-offset-4">{t('Administrator sign in')}<ArrowUpRight className="h-3 w-3"/></Link></p>}<p className="text-center text-xs text-muted-foreground">{t('Android only. No Google Play listing. No automatic updates.')}</p></div></main>;
}