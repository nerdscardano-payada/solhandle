import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { base44 } from "@/api/base44Client";

async function signWithSelectedWallet(walletName, address, message, fallbackSignMessage) {
  if (walletName !== "Phantom") return fallbackSignMessage(message);
  const phantom = window.phantom?.solana;
  if (!phantom?.isPhantom) throw new Error("Phantom is not available in this browser.");
  if (phantom.publicKey?.toBase58() !== address) throw new Error("The active Phantom account does not match the selected wallet address.");
  const signed = await phantom.signMessage(message, "utf8");
  return signed.signature;
}

export default function useDiscordVerification(token) {
  const { connected, publicKey, signMessage, wallet } = useWallet();
  const walletName = wallet?.adapter.name || "";
  const [state, setState] = useState({ loading: false, error: "", handle: "" });
  const verify = async () => {
    if (!publicKey || !signMessage) return;
    setState({ loading: true, error: "", handle: "" });
    try {
      const wallet = publicKey.toBase58();
      const challenge = await base44.functions.invoke("discordWalletVerify", { action: "challenge", token, wallet });
      const message = new TextEncoder().encode(challenge.data.message);
      const signatureBytes = await signWithSelectedWallet(walletName, wallet, message, signMessage);
      const signature = btoa(Array.from(signatureBytes, (byte) => String.fromCharCode(byte)).join(""));
      const result = await base44.functions.invoke("discordWalletVerify", { action: "verify", token, wallet, signature });
      setState({ loading: false, error: "", handle: result.data.handle });
    } catch (error) {
      setState({ loading: false, error: error.response?.data?.error || error.message || "Verification failed. Please try again.", handle: "" });
    }
  };
  return { connected, address: publicKey?.toBase58() || "", walletName: wallet?.adapter.name || "", verify, ...state };
}