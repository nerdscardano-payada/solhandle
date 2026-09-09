import { Megaphone } from "lucide-react";
import { Image } from "@/components/ui/image";
import LoungeModerationActions from "@/components/solhandle/LoungeModerationActions";

export default function LoungeMessage({ message, canModerate, onModerate }) {
  const initials = message.display_handle?.replace("@", "").slice(0, 2).toUpperCase() || "SH";
  return <article className={`group flex gap-3 rounded-xl p-3 ${message.is_announcement ? "border border-violet-300/25 bg-violet-300/[.07]" : "hover:bg-white/[.03]"}`}>
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300/20 to-violet-400/20 text-xs font-bold text-cyan-100">{initials}</div>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-white">{message.display_handle}</span><span className="rounded-full border border-cyan-300/20 px-2 py-0.5 text-[10px] text-cyan-200">{message.rarity || "STANDARD"}</span><time className="text-[11px] text-slate-600">{new Date(message.created_date).toLocaleString()}</time>{canModerate && !message.client_id && <span className="ml-auto"><LoungeModerationActions message={message} onAction={onModerate}/></span>}</div>
      {message.is_announcement && <div className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300"><Megaphone className="h-3.5 w-3.5" />Pinned announcement</div>}{message.title && <h3 className="mt-2 text-lg font-semibold">{message.title}</h3>}<p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300">{message.body}</p>{message.image_url && <Image src={message.image_url} alt={message.title || "Lounge announcement"} className="mt-3 max-h-80 w-full rounded-xl" fittingType="fit" />}
    </div></article>;
}