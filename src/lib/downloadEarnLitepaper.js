import { jsPDF } from "jspdf";
import { earnLitepaper as paper } from "@/lib/earnLitepaperContent";

export function downloadEarnLitepaper() {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const left = 18, width = 174, bottom = 278; let y = 20;
  const pageBreak = (needed = 18) => { if (y + needed > bottom) { doc.addPage(); y = 20; } };
  const title = (text, size = 17) => { pageBreak(16); doc.setFont("helvetica", "bold"); doc.setFontSize(size); doc.setTextColor(10, 30, 48); doc.text(text, left, y); y += size * 0.48; };
  const paragraph = (text, bold = false) => { doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(10); doc.setTextColor(45, 55, 72); const lines = doc.splitTextToSize(text, width); pageBreak(lines.length * 5 + 3); doc.text(lines, left, y); y += lines.length * 5 + 3; };
  const bullets = (items) => items.forEach((item) => paragraph(`- ${item}`));

  doc.setFillColor(3, 8, 21); doc.rect(0, 0, 210, 297, "F"); doc.setTextColor(103, 232, 249); doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("SOLHANDLE EARN NETWORK", left, 35); doc.setTextColor(255, 255, 255); doc.setFontSize(30); doc.text("Earn Litepaper", left, 55); doc.setFontSize(13); doc.setFont("helvetica", "normal"); doc.text(`Version ${paper.version} | ${paper.updated}`, left, 67); const intro = doc.splitTextToSize(paper.summary, 155); doc.setFontSize(12); doc.setTextColor(195, 210, 225); doc.text(intro, left, 88); doc.setTextColor(167, 139, 250); doc.text("Own your identity. Build your network.", left, 132);
  doc.addPage(); y = 20; title("1. The model in one minute"); paragraph(paper.summary); paper.streams.forEach((stream) => { title(`${stream.rate} — ${stream.title}`, 13); paragraph(stream.text); });
  title("2. $HANDLE earning tiers"); paper.tiers.forEach((tier) => paragraph(`${tier.name}: hold ${tier.balance} $HANDLE for a ${tier.rate} mint commission.`, true)); paragraph("Tier upgrades activate after 24 continuous hours. Downgrades apply immediately when a wallet no longer qualifies.");
  title("3. Simple earning examples"); paper.examples.forEach((example) => { title(example.title, 13); bullets(example.facts); paragraph(example.result, true); });
  title("4. Rules that protect the network"); paper.rules.forEach((rule) => { title(rule.title, 13); bullets(rule.items); });
  title("5. Pre-launch status"); paragraph(paper.prelaunch);
  title("6. Frequently asked questions"); paper.faqs.forEach(([question, answer]) => { title(question, 12); paragraph(answer); });
  title("Important notice"); paragraph(paper.disclaimer);
  const pages = doc.getNumberOfPages(); for (let page = 2; page <= pages; page += 1) { doc.setPage(page); doc.setFontSize(8); doc.setTextColor(120, 130, 145); doc.text(`SolHandle Earn Litepaper v${paper.version}`, left, 289); doc.text(`${page} / ${pages}`, 192, 289, { align: "right" }); }
  doc.save(`SolHandle-Earn-Litepaper-v${paper.version}.pdf`);
}