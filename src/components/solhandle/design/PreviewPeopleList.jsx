import { ArrowUpRight, Send } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';

export default function PreviewPeopleList({ people, privateContacts = false, emptyTitle, emptyText }) {
  const d = useDesign();
  if (!people.length) return <div className="sd-empty"><h3>{emptyTitle}</h3><p>{emptyText}</p><button className="sd-button sd-secondary" onClick={() => d.go('explore')}>Ontdek mensen en projecten <ArrowUpRight size={15}/></button></div>;
  return <div className="sd-people-grid">{people.map(person => <article className="sd-person-card" key={person.handle}>
    <span className="sd-avatar">{person.initials}</span>
    <small>{privateContacts ? 'PRIVÉCONTACT' : person.kind === 'PROJECT' ? 'PROJECT' : 'CREATOR'} · VOORBEELD</small>
    <h3>{person.name}</h3><span>{person.handle}</span><p>{person.bio}</p>
    <div>{!privateContacts && <button className={`sd-button ${d.isFollowing(person.handle) ? 'sd-secondary' : 'sd-gradient'}`} aria-pressed={d.isFollowing(person.handle)} onClick={() => d.toggleFollow(person.handle)}>{d.isFollowing(person.handle) ? 'Volgend' : 'Volgen'}</button>}
      {privateContacts ? <button className="sd-button sd-secondary" onClick={() => d.openPay(person.handle)}><Send size={15}/> Betalen</button> : person.handle === '@ansem' && <button className="sd-text-button" onClick={() => d.go('profile')}>Profiel <ArrowUpRight size={14}/></button>}
    </div>
  </article>)}</div>;
}