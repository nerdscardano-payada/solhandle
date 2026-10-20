import SolHandleMintFlow from '@/components/solhandle/partner-mint/react/SolHandleMintFlow';

/** Source component; use an approved authenticated transport, never browser API secrets. */
export default function SolHandleMint({ partnerId, cluster = 'devnet', wallet, invoke, theme = 'dark', className = '', buttonText = 'Kosten akkoord: ondertekenen en minten op Devnet', onConnect, onDisconnect, onSuccess, onError }) {
  if (cluster !== 'devnet' || !/^[a-z0-9-]{1,32}$/.test(partnerId || '') || typeof invoke !== 'function' || !wallet) {
    return <p role="alert" className="text-destructive">Gebruik een geldige partner-ID, Devnet, een walletadapter en een geauthenticeerde verbinding.</p>;
  }
  return <SolHandleMintFlow key={`${cluster}:${partnerId}`} {...{ partnerId, wallet, invoke, theme, className, buttonText, onConnect, onDisconnect, onSuccess, onError }}/>;
}