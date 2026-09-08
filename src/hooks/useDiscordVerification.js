import { useEffect, useState } from "react";
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
  const { connected, connecting, publicKey, signMessage, wallet, select, connect, disconnect } = useWallet();
  const walletName = wallet?.adapter.name || "";
  const [walletChoice, setWalletChoice] = useState("");
  const [state, setState] = useState({ loading: false, error: "", handle: "" });

  useEffect(() => {
    if (!walletChoice || connected || connecting || walletName !== walletChoice) return;
    connect().catch((error) => setState({ loading: false, error: error.message || `Could not connect ${walletChoice}.`, handle: "" }));
  }, [walletChoice, connected, connecting, walletName, connect]);

  const chooseWallet = async (name) => {
    setState({ loading: false, error: "", handle: "" });
    if (connected) await disconnect();
    setWalletChoice(name);
    select(name);
  };

  const changeWallet = async () => {
    if (connected) await disconnect();
    setWalletChoice("");
  };

  const verify = async () => {
    if (!walletChoice || walletName !== walletChoice || !publicKey || !signMessage) return;
    setState({ loading: true, error: "", handle: "" });
    try {
      const walletAddress = publicKey.toBase58();
      const challenge = await base44.functions.invoke("discordWalletVerify", { action: "challenge", token, wallet: walletAddress });
      const message = new TextEncoder().encode(challenge.data.message);
      const signatureBytes = await signWithSelectedWallet(walletChoice, walletAddress, message, signMessage);
      const signature = btoa(Array.from(signatureBytes, (byte) => String.fromCharCode(byte)).join(""));
      const result = await base44.functions.invoke("discordWalletVerify", { action: "verify", token, wallet: walletAddress, signature });
      setState({ loading: false, error: "", handle: result.data.handle });
    } catch (error) {
      setState({ loading: false, error: error.response?.data?.error || error.message || "Verification failed. Please try again.", handle: "" });
    }
  };

  return { connected, connecting, address: publicKey?.toBase58() || "", walletName, walletChoice, chooseWallet, changeWallet, verify, ...state };
}