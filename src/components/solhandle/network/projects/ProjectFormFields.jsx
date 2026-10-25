import { projectCategories } from '@/components/solhandle/network/projects/projectDirectory';
const inputClass = 'mt-2 min-h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground';

export default function ProjectFormFields({ values, onChange }) {
  const field = name => ({ value: values[name], onChange: event => onChange(name, event.target.value), className: inputClass });
  return <div className="space-y-4">
    <label className="block text-sm">Name<input {...field('name')} required maxLength={80}/></label>
    <label className="block text-sm">Short summary<textarea {...field('summary')} required maxLength={240} rows={3}/></label>
    <label className="block text-sm">Description <span className="text-muted-foreground">(optional)</span><textarea {...field('description')} maxLength={3000} rows={6}/></label>
    <label className="block text-sm">Category<select {...field('category')}>{Object.entries(projectCategories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label className="block text-sm">Website<input {...field('website')} required type="url" maxLength={500} placeholder="https://"/><span className="mt-1 block text-xs text-muted-foreground">HTTPS only. Visitors see an external-site warning before continuing.</span></label>
    <label className="block text-sm">Visibility<select {...field('status')}><option value="DRAFT">Draft — hidden from visitors</option><option value="PUBLISHED">Published — visible in Discover</option><option value="HIDDEN">Hidden — withdrawn from Discover</option></select></label>
    <p className="text-xs text-muted-foreground">Only save content intended for public viewing. Publishing does not grant an Official Project badge. Change a published project to Draft and save to withdraw it.</p>
  </div>;
}