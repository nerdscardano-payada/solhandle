import { useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { base44 } from "@/api/base44Client";

const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes));
const mergeChannel = (all, channelId, next) => [...all.filter((item) => item.channel_id !== channelId), ...next];

export default function useHolderLounge() {
  const { publicKey, signMessage } = useWallet(); const address = publicKey?.toBase58() || "";
  const [session, setSession] = useState(null); const [channels, setChannels] = useState([]); const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const roomRef = useRef(null);
  const enter = useCallback(async () => {
    if (!address || !signMessage) return; setLoading(true); setError("");
    try { const timestamp = Date.now(); const nonce = crypto.randomUUID(); const text = `SolHandle Holder Lounge\nWallet: ${address}\nTimestamp: ${timestamp}\nNonce: ${nonce}\n\nThis request will not trigger a transaction.`; const signature = toBase64(await signMessage(new TextEncoder().encode(text)));
      const { data } = await base44.functions.invoke("openLoungeSession", { wallet: address, timestamp, nonce, signature }); setSession({ token: data.token, member: data.member }); setChannels(data.channels); setMessages(data.messages);
    } catch (cause) { setError(cause.response?.data?.error || cause.message || "Lounge access failed."); } finally { setLoading(false); }
  }, [address, signMessage]);
  useEffect(() => { setSession(null); setSelectedId(""); setMessages([]); }, [address]);
  useEffect(() => {
    if (!session?.token || !selectedId) return; let id = sessionStorage.getItem("lounge_connection_id"); if (!id) { id = crypto.randomUUID(); sessionStorage.setItem("lounge_connection_id", id); }
    const room = base44.actors.LoungeChannelRoom(selectedId).connect({ id }); roomRef.current = room;
    const sub = room.subscribe((event) => { if (event.type === "ready") room.send({ type: "auth", token: session.token, channelId: selectedId });
      if (event.type === "state") setMessages((all) => mergeChannel(all, selectedId, event.messages));
      if (event.type === "message") setMessages((all) => [...all.filter((item) => item.client_id !== event.clientId), event.message]);
      if (event.type === "moderated" && event.action === "delete") setMessages((all) => all.filter((item) => item.id !== event.messageId));
      if (event.type === "error") { setError(event.error); if (event.clientId) setMessages((all) => all.filter((item) => item.client_id !== event.clientId)); }
    });
    localStorage.setItem(`lounge_read_${selectedId}`, new Date().toISOString()); return () => { sub.unsubscribe(); room.close(); roomRef.current = null; };
  }, [session?.token, selectedId]);
  const send = (payload) => { const clientId = crypto.randomUUID(); setError(""); setMessages((all) => [...all, { id: clientId, client_id: clientId, channel_id: selectedId, wallet_address: address, display_handle: session.member.display_handle, rarity: "STANDARD", body: payload.body, title: payload.title || "", image_url: payload.imageUrl || "", is_announcement: Boolean(payload.isAnnouncement), created_date: new Date().toISOString() }]); roomRef.current?.send({ type: "post", clientId, ...payload }); };
  const moderate = (message, action) => { const reason = window.prompt(`Reason to ${action} ${message.display_handle}:`); if (reason?.trim()) roomRef.current?.send({ type: "moderate", action, reason: reason.trim(), messageId: message.id, targetWallet: message.wallet_address }); };
  return { address, session, channels, messages, selectedId, setSelectedId, loading, error, enter, send, moderate };
}