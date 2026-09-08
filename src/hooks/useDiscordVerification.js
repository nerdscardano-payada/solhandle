import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { base44 } from "@/api/base44Client";

export default function useDiscordVerification(token) {
  const { connected, publicKey, signMessage } = useWallet();
  const [state, setState] = useState({ loading: false, error: "", handle: "" });
  const verify = async () => {
    if (!publicKey || !signMessage) return;
    setState({ loading: true, error: "", handle: "" });
    try {
      const wallet = publicKey.toBase58();
      const challenge = await base44.functions.invoke("discordWalletVerify", { action: "challenge", token, wallet });
      const signatureBytes = await signMessage(new TextEncoder().encode(challenge.data.message));
      const signature = btoa(Array.from(signatureBytes, (byte) => String.fromCharCode(byte)).join(""));
      const result = await base44.functions.invoke("discordWalletVerify", { action: "verify", token, wallet, signature });
      setState({ loading: false, error: "", handle: result.data.handle });
    } catch (error) {
      setState({ loading: false, error: error.response?.data?.error || "Verification failed. Please try again.", handle: "" });
    }
  };
  return { connected, verify, ...state };
}