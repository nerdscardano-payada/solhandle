import Header from "@/components/solhandle/Header";
import AboutHero from "@/components/solhandle/AboutHero";
import AboutPrinciples from "@/components/solhandle/AboutPrinciples";
import AboutHowItWorks from "@/components/solhandle/AboutHowItWorks";
import AboutProtocol from "@/components/solhandle/AboutProtocol";
import AboutCta from "@/components/solhandle/AboutCta";
import AboutProtocolData from "@/components/solhandle/AboutProtocolData";

export default function About() {
  return <main className="min-h-screen bg-platform text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><AboutHero/><AboutPrinciples/><AboutHowItWorks/><AboutProtocol/><AboutProtocolData/><AboutCta/></div></main>;
}