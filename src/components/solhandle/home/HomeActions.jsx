import { Link } from 'react-router-dom';
import { Search, Tag, Send, ArrowLeftRight, ArrowUpRight } from 'lucide-react';

const actions = [
  { title: 'Search & buy @handles', description: 'Find your name and make it yours.', to: '/search', icon: Search },
  { title: 'Sell @handles', description: 'List your handles on the marketplace.', to: '/market', icon: Tag },
  { title: 'Pay @handles', description: 'Send and receive SOL using a handle.', to: '/pay', icon: Send },
  { title: 'Trade $HANDLE', description: 'Buy and sell the community token.', to: '/upcoming/token-launch', icon: ArrowLeftRight },
];

export default function HomeActions() {
  return <section className="home-content-section" aria-label="Explore SolHandle">
    <div className="home-four-grid">
      {actions.map(({ title, description, to, icon: Icon }) => <Link key={to} to={to} className="home-name-tile">
        <div className="mb-5 flex items-center justify-between gap-3 text-names-accent">
          <Icon className="h-7 w-7" aria-hidden="true"/>
          <ArrowUpRight className="h-5 w-5" aria-hidden="true"/>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/70">{description}</p>
      </Link>)}
    </div>
  </section>;
}