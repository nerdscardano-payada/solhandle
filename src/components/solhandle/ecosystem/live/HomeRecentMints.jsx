import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import HandleCard from '@/components/solhandle/HandleCard';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function HomeRecentMints() {
  const { t } = useLanguage();
  const recent = useQuery({ queryKey: ['home-recent-mints', 3], queryFn: async () => {
    const { data } = await base44.functions.invoke('getRecentHandles', { limit: 3 });
    if (data.error) throw new Error(data.error);
    return data.handles || [];
  }, staleTime: 60000, retry: false });
  return <div className="home-stats-recent">
    <h3>{t('Recently minted')}</h3>
    {recent.isPending ? <p role="status">{t('Loading recent handles…')}</p> : recent.isError ? <p role="alert">{t('Recent handles are temporarily unavailable.')} <button className="ep-link" onClick={() => recent.refetch()}>{t('Try again')}</button></p> : recent.data.length ? <div className="home-stats-recent-grid">{recent.data.map(item => <Link key={item.asset || item.handle} to={`/${item.handle}`} aria-label={`${t('View handle')} @${item.handle}`}><HandleCard handle={item.handle} display={item.display}/><span>@{item.handle}</span></Link>)}</div> : <p>{t('No handles minted yet.')}</p>}
  </div>;
}