import Header from "@/components/solhandle/Header";
import AboutHero from "@/components/solhandle/AboutHero";
import AboutPrinciples from "@/components/solhandle/AboutPrinciples";
import AboutHowItWorks from "@/components/solhandle/AboutHowItWorks";
import AboutProtocol from "@/components/solhandle/AboutProtocol";
import AboutCta from "@/components/solhandle/AboutCta";

export default function About() {
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><AboutHero/><AboutPrinciples/><AboutHowItWorks/><AboutProtocol/><AboutCta/></div></main>;
}