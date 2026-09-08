import Header from "@/components/solhandle/Header";
import DiscordVerifyCard from "@/components/solhandle/DiscordVerifyCard";

export default function DiscordVerify() {
  return <div className="min-h-screen bg-slate-950 text-white"><Header/><main className="relative mx-auto flex max-w-6xl justify-center px-5 py-20"><div className="absolute inset-x-1/4 top-8 h-64 rounded-full bg-cyan-500/10 blur-3xl"/><div className="relative"><DiscordVerifyCard/></div></main></div>;
}