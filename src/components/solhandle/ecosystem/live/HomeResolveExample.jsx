import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Code2 } from 'lucide-react';
import '@/components/solhandle/ecosystem/live/home-resolve-example.css';

const example = `import { resolveHandle } from "solhandle-sdk";

const identity = await resolveHandle("@ansem");
console.log(identity?.addressString);`;

export default function HomeResolveExample() {
  return <aside className="home-resolve-example" aria-labelledby="home-resolve-title">
    <header><h3 id="home-resolve-title"><Code2 size={17} aria-hidden="true"/>@handle → wallet</h3><span>SDK example</span></header>
    <div className="home-resolve-flow"><strong>@ansem</strong><ArrowRight size={18} aria-hidden="true"/><code>7xKp…9mQ2</code></div>
    <p className="home-resolve-demo-note">Demo only. Illustrative address, not a live lookup.</p>
    <pre aria-label="JavaScript resolve example"><code>{example}</code></pre>
    <footer><p>Resolve the current NFT owner. No wallet connection needed.</p><Link to="/developers" className="ep-link">View integration guide <ArrowUpRight size={15} aria-hidden="true"/></Link></footer>
  </aside>;
}