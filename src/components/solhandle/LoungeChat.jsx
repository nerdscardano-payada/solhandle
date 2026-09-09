import { ArrowLeft, Hash } from "lucide-react";
import LoungeMessage from "@/components/solhandle/LoungeMessage";
import LoungeComposer from "@/components/solhandle/LoungeComposer";
import LoungeAnnouncementComposer from "@/components/solhandle/LoungeAnnouncementComposer";

export default function LoungeChat({ channel, messages, role, onBack, onSend, onModerate }) {
  if (!channel) return <section className="hidden items-center justify-center text-slate-500 md:flex">Choose a channel to join the conversation.</section>;
  const channelMessages = messages.filter((item) => item.channel_id === channel.id); const pinned = channelMessages.filter((item) => item.is_announcement); const regular = channelMessages.filter((item) => !item.is_announcement); const canModerate = ["admin", "mod"].includes(role);
  return <section className="flex min-h-[72vh] flex-col"><header className="flex items-center gap-3 border-b border-white/10 p-4"><button onClick={onBack} className="rounded-lg p-2 hover:bg-white/10 md:hidden"><ArrowLeft className="h-4 w-4" /></button><Hash className="h-5 w-5 text-cyan-300"/><div><h2 className="font-semibold">{channel.name}</h2><p className="text-xs text-slate-500">{channel.description}</p></div></header>
    <div className="flex-1 space-y-1 overflow-y-auto p-3">{[...pinned, ...regular].map((message) => <LoungeMessage key={message.id} message={message} canModerate={canModerate} onModerate={onModerate}/>)}{!channelMessages.length && <p className="py-16 text-center text-sm text-slate-500">Be the first holder to post here.</p>}</div>
    {channel.slug === "news" && role === "admin" ? <LoungeAnnouncementComposer onSend={onSend}/> : <LoungeComposer disabled={!channel.write_roles.includes(role)} onSend={onSend}/>}</section>;
}