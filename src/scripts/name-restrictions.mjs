export const CRITICAL_PROTECTED_GROUPS = {
  bigTech: ["apple", "google", "microsoft", "amazon", "samsung", "sony", "nvidia", "intel", "amd", "ibm", "oracle", "adobe", "salesforce", "cloudflare", "github", "gitlab"],
  socialMessaging: ["meta", "facebook", "instagram", "whatsapp", "threads", "twitter", "x", "tiktok", "youtube", "snapchat", "linkedin", "discord", "telegram", "reddit", "twitch"],
  ai: ["openai", "chatgpt", "anthropic", "claude", "gemini", "deepmind", "perplexity", "midjourney"],
  payments: ["visa", "mastercard", "paypal", "stripe", "revolut", "klarna", "adyen", "worldpay", "americanexpress", "amex", "westernunion", "moneygram", "venmo", "cashapp", "applepay", "googlepay"],
  majorBanks: ["jpmorgan", "goldmansachs", "morganstanley", "citibank", "citi", "bankofamerica", "wellsfargo", "hsbc", "barclays", "deutschebank", "ubs", "santander"],
  beneluxFinance: ["kbc", "belfius", "ing", "bnpparibas", "bnpparibasfortis", "argenta", "crelan", "beobank", "rabobank"],
  cryptoExchanges: ["coinbase", "binance", "kraken", "cryptocom", "okx", "bybit", "bitstamp", "bitfinex", "kucoin", "gateio", "robinhood"],
  cryptoWallets: ["metamask", "ledger", "trezor", "trustwallet", "coinbasewallet"],
  commerce: ["ebay", "alibaba", "aliexpress", "shopify", "temu", "shein", "walmart"],
  travelMobility: ["booking", "airbnb", "uber", "expedia"],
  consumer: ["nike", "adidas", "cocacola", "pepsi", "mcdonalds", "starbucks", "ikea"],
  luxury: ["louisvuitton", "gucci", "chanel", "hermes", "rolex", "cartier", "prada", "dior", "burberry"],
  automotive: ["tesla", "mercedes", "mercedesbenz", "bmw", "audi", "porsche", "ferrari", "lamborghini", "volkswagen", "toyota"],
  gaming: ["playstation", "xbox", "nintendo", "steam", "epicgames", "ea", "roblox", "minecraft"],
  media: ["netflix", "spotify", "disney", "hbo", "cnn", "bbc"]
};

export const CRITICAL_PROTECTED_NAMES = Object.entries(CRITICAL_PROTECTED_GROUPS).flatMap(([group, handles]) =>
  handles.map((handle) => ({ handle, group, reservedFor: "Trademark / Brand" }))
);

export const SOLANA_RESERVED_NAMES = [
  ["solana", "Solana"], ["sol", "Solana"], ["solanafoundation", "Solana Foundation"], ["solanalabs", "Solana Labs"],
  ["anza", "Anza"], ["firedancer", "Firedancer"], ["phantom", "Phantom"], ["phantomwallet", "Phantom"],
  ["solflare", "Solflare"], ["solflarewallet", "Solflare"], ["backpack", "Backpack"], ["backpackwallet", "Backpack"],
  ["jupiter", "Jupiter"], ["jup", "Jupiter"], ["raydium", "Raydium"], ["orca", "Orca"], ["kamino", "Kamino"],
  ["drift", "Drift"], ["meteora", "Meteora"], ["jito", "Jito"], ["sanctum", "Sanctum"], ["marinade", "Marinade"],
  ["pyth", "Pyth Network"], ["pythnetwork", "Pyth Network"], ["metaplex", "Metaplex"], ["magiceden", "Magic Eden"],
  ["tensor", "Tensor"], ["helius", "Helius"], ["squads", "Squads"], ["wormhole", "Wormhole"],
  ["pumpfun", "pump.fun"], ["dexscreener", "DEX Screener"]
].map(([handle, reservedFor]) => ({ handle, reservedFor }));

export const DEFAULT_PROTECTED_NAMES = CRITICAL_PROTECTED_NAMES.map(({ handle, reservedFor }) => `${handle}|${reservedFor}`).join(",");
export const DEFAULT_RESERVED_NAMES = SOLANA_RESERVED_NAMES.map(({ handle, reservedFor }) => `${handle}|${reservedFor}`).join(",");