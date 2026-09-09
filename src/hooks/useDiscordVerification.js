import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { base44 } from "@/api/base44Client";

async function signSelected(name, address, message, fallback) {
  if (name !== "Phantom") return fallback(message);
  const provider = window.phantom?.solana;
  if (!provider?.isPhantom) throw new Error("Phantom is not available in this browser.");
  if (provider.publicKey?.toBase58() !== address) throw new Error("The active Phantom account does not match the selected wallet.");
  return (await provider.signMessage(message, "utf8")).signature;
}

export default function useDiscordVerification(token) {
  const { connected, connecting, publicKey, signMessage, wallet, select, connect, disconnect } = useWallet();
  const [walletChoice, setWalletChoice] = useState("");
  const [state, setState] = useState({ loading: false, error: "", handle: "" });
  const walletName = wallet?.adapter.name || "";
  useEffect(() => { if (walletChoice && !connected && !connecting && walletName === walletChoice) connect().catch((e) => setState({ loading: false, error: e.message, handle: "" })); }, [walletChoice, connected, connecting, walletName, connect]);
  const chooseWallet = async (name) => { setState({ loading: false, error: "", handle: "" }); if (connected) await disconnect(); setWalletChoice(name); select(name); };
  const changeWallet = async () => { if (connected) await disconnect(); setWalletChoice(""); };
  const verify = async () => {
    if (!publicKey || !signMessage || walletName !== walletChoice) return;
    setState({ loading: true, error: "", handle: "" });
    try {
      const address = publicKey.toBase58();
      const challenge = await base44.functions.invoke("discordWalletVerify", { action: "challenge", token, wallet: address });
      const bytes = await signSelected(walletName, address, new TextEncoder().encode(challenge.data.message), signMessage);
      const signature = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
      const result = await base44.functions.invoke("discordWalletVerify", { action: "verify", token, wallet: address, signature });
      setState({ loading: false, error: "", handle: result.data.handle });
    } catch (error) { setState({ loading: false, error: error.response?.data?.error || error.message || "Verification failed.", handle: "" }); }
  };
  return { connected, connecting, address: publicKey?.toBase58() || "", walletName, walletChoice, chooseWallet, changeWallet, verify, ...state };
}