import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

export default function ProjectDeleteDialog({ project, onClose, onDeleted }) {
 const deletion=useMutation({
  mutationFn:()=>base44.entities.NetworkProject.delete(project.id),
  onSuccess:async()=>{await onDeleted(project);onClose();}
 });
 return <AlertDialog open={Boolean(project)} onOpenChange={open=>{if(!open&&!deletion.isPending)onClose();}}>
  <AlertDialogContent className="bg-card text-card-foreground border-border" onEscapeKeyDown={event=>{if(deletion.isPending)event.preventDefault();}}>
   <AlertDialogHeader>
    <AlertDialogTitle>Delete project?</AlertDialogTitle>
    <AlertDialogDescription>This removes “{project.name}” from project management and the public directory. Its original submission is kept. This is not the same as hiding a listing.</AlertDialogDescription>
   </AlertDialogHeader>
   {deletion.isError&&<p role="alert" className="text-sm text-destructive">The project could not be deleted. Please try again.</p>}
   <AlertDialogFooter>
    <AlertDialogCancel disabled={deletion.isPending}>Cancel</AlertDialogCancel>
    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deletion.isPending} onClick={event=>{event.preventDefault();deletion.mutate();}}>{deletion.isPending?'Deleting…':'Delete project'}</AlertDialogAction>
   </AlertDialogFooter>
  </AlertDialogContent>
 </AlertDialog>;
}