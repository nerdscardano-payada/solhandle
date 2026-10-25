import { useState } from 'react';
import ProjectFormFields from '@/components/solhandle/network/projects/ProjectFormFields';
import { projectError, projectInput } from '@/components/solhandle/network/projects/projectDirectory';

export default function ProjectForm({ project, onSave, onCancel }) {
  const [values, setValues] = useState(() => ({ name: project?.name || '', summary: project?.summary || '', description: project?.description || '', category: project?.category || 'OTHER', website: project?.website || '', status: project?.status || 'DRAFT' }));
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const submit = async event => {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    try { await onSave(projectInput(values)); }
    catch (failure) { setError(projectError(failure)); }
    finally { setBusy(false); }
  };
  return <form onSubmit={submit} className="space-y-5 rounded-xl border border-border bg-card p-5 text-foreground">
    <h2 className="text-xl font-semibold">{project ? 'Edit project' : 'New project'}</h2>
    <fieldset disabled={busy}><ProjectFormFields values={values} onChange={(name, value) => setValues(current => ({ ...current, [name]: value }))}/></fieldset>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex flex-wrap gap-3"><button type="submit" disabled={busy} className="min-h-11 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-50">{busy ? 'Saving…' : values.status === 'PUBLISHED' ? project?.status === 'PUBLISHED' ? 'Save published project' : 'Publish project' : project?.status === 'PUBLISHED' ? 'Unpublish and save draft' : 'Save draft'}</button><button type="button" disabled={busy} onClick={onCancel} className="min-h-11 rounded-lg border border-border px-4 py-2 disabled:opacity-50">Cancel</button></div>
  </form>;
}