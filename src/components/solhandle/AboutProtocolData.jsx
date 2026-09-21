import MainnetContracts from "@/components/solhandle/MainnetContracts";
import ProtocolDistribution from "@/components/solhandle/ProtocolDistribution";

export default function AboutProtocolData() {
  return <section aria-label="Protocol contracts and handle distribution" className="px-5 pb-12 md:px-9">
    <MainnetContracts />
    <ProtocolDistribution />
  </section>;
}