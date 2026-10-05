import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';

import WidgetGallery from '@/components/solhandle/widgets/WidgetGallery';


export default function SolHandleResolve() {
  return <main className="dark min-h-screen bg-background font-body text-foreground"><div className="mx-auto max-w-7xl border-x border-border"><Header/>
    <div className="mx-auto min-w-0 max-w-5xl px-3 py-6 lg:px-9 lg:py-12">
      <Link to="/developers" className="text-sm text-names-accent">← Developer Center</Link>
      <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-names-secondary">SolHandle embed</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight lg:text-5xl">Find your SolHandle.</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground lg:text-lg">Add Search & Claim to your website with one embed. No API key. No custom lookup code.</p>
      <WidgetGallery/>

    </div>
  </div></main>;
}