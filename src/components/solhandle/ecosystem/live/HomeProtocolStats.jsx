import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import '@/components/solhandle/ecosystem/live/home-protocol-stats.css';

export default function HomeProtocolStats() {
  const { t } = useLanguage();
  const stats = useQuery({ queryKey: ['public-stats-protocol'], queryFn: async () => {
    const { data } = await base44.functions.invoke('getProtocolStats', {});
    if (data.error) throw new Error(data.error);
    return data;
  }, staleTime: 60000, retry: false });
  const metrics = [['Total minted', stats.data?.totalMinted], ['Handle holders', stats.data?.uniqueHolders], ['Premium handles minted', stats.data?.premiumMinted]];
  return <section className="home-protocol-stats" aria-label={t('SolHandle statistics')}>
    <header><h2>{t('SolHandle in numbers')}</h2><Link to="/statistics" className="ep-link">{t('All statistics')} <ArrowUpRight size={15} aria-hidden="true"/></Link></header>
    {stats.isError ? <p role="alert">{t('Statistics are temporarily unavailable.')} <button className="ep-link" onClick={() => stats.refetch()}>{t('Try again')}</button></p> : <dl aria-busy={stats.isPending}>{metrics.map(([label, value]) => <div key={label}><dt>{t(label)}</dt><dd>{stats.isPending ? <span role="status" aria-label={t('Loading statistics')}>…</span> : Number.isFinite(value) ? value.toLocaleString() : '—'}</dd></div>)}</dl>}
    <p className="home-protocol-stats-source">{t('Based on the latest protocol index sync.')}{stats.data?.lastSync && <> {new Date(stats.data.lastSync).toLocaleString()}</>}</p>
  </section>;
}