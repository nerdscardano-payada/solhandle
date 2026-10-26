import { ArrowLeftRight, Wallet, ShieldCheck } from 'lucide-react';
export default function HomeIntegrationVisual() {
  return <div className="el-integration-visual" aria-label="Illustrative example: @demo corresponds to a Solana wallet">
    <div className="el-integration-window"><span>SOLHANDLE IDENTITY</span><span>ILLUSTRATIVE EXAMPLE</span></div>
    <div className="el-integration-handle"><span>One recognizable identity</span><strong>@demo</strong></div>
    <ArrowLeftRight className="el-integration-connector" size={30} aria-hidden="true"/>
    <div className="el-integration-wallet"><Wallet size={25}/><div><strong>Solana wallet</strong><span>Long wallet address → recognizable @handle</span></div></div>
    <p><ShieldCheck size={17}/>Ownership verified against on-chain data.</p>
    <div className="el-integration-contexts"><span>Wallets</span><span>dApps</span><span>Payments</span></div>
  </div>;
}