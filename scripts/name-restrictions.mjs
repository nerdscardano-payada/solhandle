export const CRITICAL_PROTECTED_GROUPS = {
  protocol: ["solhandle"],
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

export const LEGACY_NAMES_TO_RELEASE = "3m,accenture,airbus,airfrance,aldi,allianz,aramco,armani,astrazeneca,audemarspiguet,axa,balenciaga,bayer,bentley,bestbuy,blackrock,bloomberg,boeing,bookingcom,bp,britishairways,budweiser,burgerking,byd,calvinklein,carrefour,caterpillar,chevrolet,chevron,cisco,colgate,corona,costco,danone,dell,dhl,dominos,elililly,emirates,espn,etsy,exxonmobil,fedex,ford,geaerospace,gillette,handm,harleydavidson,heineken,herms,hilton,homedepot,honda,hp,huawei,hyatt,hyundai,johndeere,kfc,kia,klm,lego,lexus,lidl,loral,lufthansa,lululemon,marriott,maserati,mclaren,monster,nasdaq,nescaf,nespresso,nestl,newbalance,nissan,novartis,novonordisk,omega,pampers,pandora,patekphilippe,pfizer,philips,pinterest,puma,qatarairways,qualcomm,ralphlauren,rangerover,redbull,reuters,roche,ryanair,sap,schneiderelectric,sephora,shell,siemens,subway,tencent,tesco,thenewyorktimes,tiffanyandco,tommyhilfiger,totalenergies,tripadvisor,underarmour,uniqlo,ups,versace,volvo,wechat,wise,xiaomi,zara,zoom".split(",");
export const DEFAULT_PROTECTED_NAMES = CRITICAL_PROTECTED_NAMES.map(({ handle, reservedFor }) => `${handle}|${reservedFor}`).join(",");
export const DEFAULT_RESERVED_NAMES = SOLANA_RESERVED_NAMES.map(({ handle, reservedFor }) => `${handle}|${reservedFor}`).join(",");