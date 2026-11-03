import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Code2, Globe } from 'lucide-react';

export default function HomeHeroIntegration() {
  const navigate = useNavigate();
  function explore(event) {
    event.preventDefault();
    const website = new FormData(event.currentTarget).get('website').trim();
    navigate(`/integrate/ai?${new URLSearchParams({ website })}`);
  }
  return <section className="el-hero-entry el-hero-entry-project" aria-labelledby="hero-integration-heading">
    <div className="el-hero-entry-audience flex-wrap"><Code2 size={18}/><span>FOR PROJECTS & DEVELOPERS</span></div>
    <h2 id="hero-integration-heading">Bring @handles to your project</h2>
    <p>Your website. A tailored integration plan.</p>
    <div className="el-hero-entry-context"><code>@ansem → wallet address</code><span className="flex flex-wrap items-center gap-2"><span>Handle lookup · Identity labels · SOL recipients</span><span className="inline-flex items-center gap-2 rounded-full border border-ecosystem-cyan bg-ecosystem-raised px-3 py-1 font-bold text-ecosystem-cyan"><span aria-hidden="true">✦</span> AI POWERED</span></span></div>
    <form className="ep-claim-search el-hero-project-form" onSubmit={explore}>
      <span aria-hidden="true"><Globe size={22}/></span>
      <label htmlFor="hero-project-website" className="sr-only">Public HTTPS project website</label>
      <input id="hero-project-website" name="website" type="url" placeholder="https://your-project.com" required pattern="https://.*" maxLength={500} autoCapitalize="none" autoComplete="url" spellCheck={false} title="Enter a public project website starting with https://"/>
      <button type="submit" className="ep-button ep-primary">Explore my integration <ArrowUpRight size={17}/></button>
    </form>
    <small>AI Advisor · Based on public sources. Technical review required.</small>
  </section>;
}