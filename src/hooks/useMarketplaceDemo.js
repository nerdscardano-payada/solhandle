import { useMemo, useState } from "react";

const seed = [
  { handle: "@ansem", rarity: "RARE", price: 4.2, seller: "7mKq...9Pz2" },
  { handle: "@solana", rarity: "PREMIUM", price: 6.5, seller: "3nAx...4Lv8" },
  { handle: "@defi", rarity: "ULTRA RARE", price: 1.8, seller: "8vRt...2Qm1" },
  { handle: "@builder", rarity: "STANDARD", price: 0.65, seller: "5pLs...7Jw4" }
];

export default function useMarketplaceDemo() {
  const [listings, setListings] = useState(seed);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [dialog, setDialog] = useState(null);
  const [message, setMessage] = useState("");
  const visible = useMemo(() => {
    const found = listings.filter((item) => item.handle.includes(query.toLowerCase().replace(/\s/g, "")));
    if (sort === "low") return [...found].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...found].sort((a, b) => b.price - a.price);
    return found;
  }, [listings, query, sort]);
  const complete = ({ mode, handle, price }) => {
    if (mode === "list") setListings((items) => [{ handle: `@${handle.replace(/^@/, "")}`, rarity: "STANDARD", price: Number(price), seller: "Your wallet" }, ...items]);
    if (mode === "buy") setListings((items) => items.filter((item) => item.handle !== handle));
    setMessage(mode === "buy" ? `${handle} purchased in demo mode.` : mode === "offer" ? `Demo offer submitted for ${handle}.` : `@${handle.replace(/^@/, "")} listed in demo mode.`);
    setDialog(null);
  };
  return { visible, query, setQuery, sort, setSort, dialog, setDialog, message, complete };
}