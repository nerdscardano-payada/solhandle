import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function TokenDemoApplication({ state, dispatch }) {
  const [project, setProject] = useState(state.token.name);
  const [channel, setChannel] = useState('Demo official project channel');
  const [description, setDescription] = useState('Sample evidence: project authorization, domain control and entitlement to the token symbol.');
  const [accepted, setAccepted] = useState(false);
  const [payment, setPayment] = useState(false);
  function submit(event) { event.preventDefault(); if (accepted && payment) dispatch({ type: 'deposit', evidence: { project: project.trim(), channel: channel.trim(), description: description.trim() } }); }
  return <form onSubmit={submit} className="space-y-4">
    <h3 className="text-xl font-semibold">3. Evidence & application deposit</h3>
    <p className="text-sm text-muted-foreground">Use fictional evidence only. No documents are uploaded, no identity checks run, and no application is sent to real reviewers.</p>
    <label className="block space-y-2 text-sm">Project name<Input required maxLength={120} value={project} onChange={event => setProject(event.target.value)}/></label>
    <label className="block space-y-2 text-sm">Established project channel<Input required maxLength={200} value={channel} onChange={event => setChannel(event.target.value)}/></label>
    <label className="block space-y-2 text-sm">Project authorization & ticker entitlement<Textarea required maxLength={1500} value={description} onChange={event => setDescription(event.target.value)}/></label>
    <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} className="mt-1"/><span>I understand the planned 0.25 SOL deposit is non-refundable, credited toward the {state.token.price} SOL total, and does not guarantee approval or reserve ticker priority.</span></label>
    <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={payment} onChange={event => setPayment(event.target.checked)} className="mt-1"/><span>I confirm the simulated 0.25 SOL deposit. No real funds will move.</span></label>
    <Button type="submit" disabled={!accepted || !payment || !project.trim() || !channel.trim() || !description.trim()}>Simulate deposit & submit application</Button>
    <p className="text-xs text-muted-foreground">After both reviews approve: {state.token.price - 0.25} SOL remaining. Real network fees and account costs would be disclosed separately.</p>
  </form>;
}