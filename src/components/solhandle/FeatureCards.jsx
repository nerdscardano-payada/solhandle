import { useEffect, useState } from "react";
import invokeWithRetry from "@/lib/invokeWithRetry";
import HowItWorksCard from "@/components/solhandle/HowItWorksCard";
import MyHandlesCard from "@/components/solhandle/MyHandlesCard";
import ProtocolStatsCard from "@/components/solhandle/ProtocolStatsCard";

export default function FeatureCards({ wallet }) {
  const [handles, setHandles] = useState([]);
  const [handlesState, setHandlesState] = useState("idle");
  const [stats, setStats] = useState(null);
  const [statsState, setStatsState] = useState("loading");

  useEffect(() => { let active = true; const load = () => invokeWithRetry("getProtocolStats", {}).then(({ data }) => { if (active) { setStats(data); setStatsState("ready"); } }).catch(() => active && setStatsState("error")); load(); const timer = setInterval(load, 60000); return () => { active = false; clearInterval(timer); }; }, []);
  useEffect(() => { let active = true; if (!wallet) { setHandles([]); setHandlesState("idle"); return () => { active = false; }; } setHandlesState("loading"); invokeWithRetry("getOwnerHandles", { wallet }).then(({ data }) => { if (active) { setHandles(data.handles || []); setHandlesState("ready"); } }).catch(() => active && setHandlesState("error")); return () => { active = false; }; }, [wallet]);

  return <div className="grid gap-4 md:grid-cols-12">
    <HowItWorksCard />
    <MyHandlesCard wallet={wallet} state={handlesState} handles={handles} />
    <ProtocolStatsCard stats={stats} state={statsState} />
  </div>;
}