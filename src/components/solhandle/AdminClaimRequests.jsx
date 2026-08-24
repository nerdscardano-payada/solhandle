import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { base44 } from "@/api/base44Client";
import { buildHandlePngBlob } from "@/lib/buildHandlePng";
import { claimRestrictedSolHandle } from "@/lib/mintSolHandle";
import AdminClaimRequestCard from "@/components/solhandle/AdminClaimRequestCard";

export default function AdminClaimRequests() {
  const { publicKey, sendTransaction } = useWallet(); const [requests, setRequests] = useState([]); const [busy, setBusy] = useState(""); const [error, setError] = useState("");
  const load = async () => setRequests(await base44.entities.OfficialClaimRequest.list("-created_date", 50));
  useEffect(() => { load(); }, []);
  const updateRequest = async (request, data) => { setBusy(request.id); setError(""); try { await base44.entities.OfficialClaimRequest.update(request.id, data); await load(); } catch (caught) { setError(caught.message); } finally { setBusy(""); } };
  const deleteRequest = async (request) => { if (!window.confirm(`Permanently delete the official claim for @${request.handle}?`)) return; setBusy(request.id); setError(""); try { await base44.entities.OfficialClaimRequest.delete(request.id); await load(); } catch (caught) { setError(caught.message); } finally { setBusy(""); } };
  const mint = async (request) => {
    setBusy(request.id); setError("");
    try {
      if (!request.domain_verified_at || !request.wallet_verified_at || (request.high_risk && !request.manual_channel_verified_at)) throw new Error("All required verification checks must pass before minting.");
      if (!publicKey) { window.dispatchEvent(new Event("solhandle:connect-wallet")); throw new Error("Connect the protocol authority wallet, then try again."); }
      const png = await buildHandlePngBlob(request.handle); const { file_url } = await base44.integrations.Core.UploadFile({ file: png });
      const upload = await base44.functions.invoke("uploadProtocolMetadata", { handle: request.handle, image_url: file_url });
      const result = await claimRestrictedSolHandle({ handle: request.handle, uri: upload.data.uri, recipientWallet: request.recipient_wallet, wallet: publicKey, sendTransaction });
      await base44.entities.OfficialClaimRequest.update(request.id, { status: "minted", mint_signature: result.signature, asset_address: result.asset, reviewed_at: new Date().toISOString() }); await load();
    } catch (caught) { setError(caught.message || "Official claim failed."); } finally { setBusy(""); }
  };
  return <section className="card-glow mt-8"><h2 className="font-semibold text-white">Official claim requests</h2><p className="mt-1 text-sm text-slate-500">Minting unlocks only after server-verified domain, wallet and required known-channel checks.</p>{error && <p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-200">{error}</p>}<div className="mt-5 grid gap-4">{requests.length ? requests.map((request) => <AdminClaimRequestCard key={request.id} request={request} busy={busy === request.id} onMint={mint} onReject={(item) => updateRequest(item, { status: "rejected", reviewed_at: new Date().toISOString() })} onDelete={deleteRequest} onManualVerify={(item) => updateRequest(item, { manual_channel_verified_at: new Date().toISOString() })}/>) : <p className="text-sm text-slate-400">No official claim requests yet.</p>}</div></section>;
}