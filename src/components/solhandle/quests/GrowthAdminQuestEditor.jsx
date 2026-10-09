import { useState } from 'react';
import { Button } from '@/components/ui/button';
export default function GrowthAdminQuestEditor({ quest, onAction, busy }) {
  const [title, setTitle] = useState(quest.title), [description, setDescription] = useState(quest.description), [xp, setXP] = useState(quest.xp);
  const editable = quest.status !== 'PUBLISHED';
  return <article className="rounded-2xl border border-border bg-card p-5">
    <div className="flex flex-wrap justify-between gap-3"><h3 className="font-semibold">{quest.title}</h3><span className="text-xs text-names-secondary">{quest.status} · v{quest.version}</span></div><p className="mt-2 font-mono text-xs text-muted-foreground">{quest.handler} · 1× lifetime</p>
    <form onSubmit={e => { e.preventDefault(); onAction({ action: 'save_quest', id: quest.id, title, description, xp }); }} className="mt-4 space-y-4">
      <label className="block text-sm">Titel<input value={title} onChange={e => setTitle(e.target.value)} disabled={!editable || busy} required minLength={3} maxLength={100} className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 disabled:opacity-50"/></label>
      <label className="block text-sm">Uitleg<textarea value={description} onChange={e => setDescription(e.target.value)} disabled={!editable || busy} required minLength={10} maxLength={2000} rows={4} className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 disabled:opacity-50"/></label>
      <label className="block text-sm">XP<input type="number" min={1} max={1000} step={1} value={xp} onChange={e => setXP(e.target.value)} disabled={!editable || busy} required className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 disabled:opacity-50"/></label>
      <div className="flex flex-wrap gap-3">{editable && <Button disabled={busy}>Nieuwe versie opslaan</Button>}<Button type="button" variant="outline" disabled={busy} onClick={() => onAction({ action: 'quest_status', id: quest.id, status: quest.status === 'PUBLISHED' ? 'PAUSED' : 'PUBLISHED' })}>{quest.status === 'PUBLISHED' ? 'Quest pauzeren' : 'Publiceren'}</Button></div>
    </form><p className="mt-4 text-xs leading-6 text-muted-foreground">Publicatie maakt deze versie beschikbaar. Pauzeer vóór wijzigingen. Bestaande XP wordt niet gewijzigd en de lifetime-limiet blijft gelijk.</p>
  </article>;
}