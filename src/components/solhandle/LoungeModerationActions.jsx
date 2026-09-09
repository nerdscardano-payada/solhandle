import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function LoungeModerationActions({ message, onAction }) {
  return <DropdownMenu><DropdownMenuTrigger className="rounded p-1 text-slate-500 hover:bg-white/10 hover:text-white"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger><DropdownMenuContent align="end" className="border-white/10 bg-slate-950 text-slate-200">
    {[["delete","Delete message"],["mute","Mute 24 hours"],["unmute","Unmute member"],["ban","Ban member"],["unban","Unban member"]].map(([action,label]) => <DropdownMenuItem key={action} onClick={() => onAction(message, action)} className="focus:bg-white/10 focus:text-white">{label}</DropdownMenuItem>)}
  </DropdownMenuContent></DropdownMenu>;
}