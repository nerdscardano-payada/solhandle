// Runs only the SolHandle correction and the 22 incremental Solana brand reservations on Devnet.
process.env.RESERVED_NAMES = [
  "solhandle|SolHandle",
  "solscan|Solscan",
  "birdeye|Birdeye",
  "switchboard|Switchboard",
  "marginfi|marginfi",
  "save|Save",
  "solend|Solend",
  "phoenix|Phoenix",
  "tiplink|TipLink",
  "dialect|Dialect",
  "lightprotocol|Light Protocol",
  "triton|Triton One",
  "tritonone|Triton One",
  "solanamobile|Solana Mobile",
  "orb|Orb",
  "quicknode|QuickNode",
  "syndica|Syndica",
  "ironforge|Ironforge",
  "perena|Perena",
  "lifinity|Lifinity",
  "drip|DRiP",
  "exchangeart|Exchange Art",
  "solanapay|Solana Pay"
].join(",");
process.env.PROTECTED_NAMES = "";
process.env.FORCE_UPDATE_NAMES = "solhandle";

await import("./reserve-names-devnet.mjs");