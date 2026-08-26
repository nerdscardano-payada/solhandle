import {
  createDefaultAuthorizationCache,
  createDefaultChainSelector,
  createDefaultWalletNotFoundHandler,
  registerMwa,
} from "@solana-mobile/wallet-standard-mobile";

if (typeof window !== "undefined") {
  registerMwa({
    appIdentity: {
      name: "SolHandle",
      uri: window.location.origin,
    },
    authorizationCache: createDefaultAuthorizationCache(),
    chains: ["solana:mainnet"],
    chainSelector: createDefaultChainSelector(),
    onWalletNotFound: createDefaultWalletNotFoundHandler(),
  });
}