#!/usr/bin/env bash
set -euo pipefail
umask 077

# Run locally in WSL. This does not deploy or send any transaction.
command -v solana-keygen >/dev/null 2>&1 || {
  echo 'Solana CLI ontbreekt: installeer deze eerst in WSL.' >&2
  exit 1
}
KEY_DIR="$HOME/.config/solana"
KEY_FILE="$KEY_DIR/partner-mint-devnet-quote-signer.json"
mkdir -p "$KEY_DIR"

if [[ -e "$KEY_FILE" ]]; then
  echo 'Bestaande aparte quote-signing key wordt behouden; niets overschreven.'
else
  solana-keygen new --no-bip39-passphrase --silent --outfile "$KEY_FILE"
fi
chmod 600 "$KEY_FILE"
PUBLIC_KEY="$(solana-keygen pubkey "$KEY_FILE")"
printf '\nPublieke quote-signing key (mag je delen):\n%s\n' "$PUBLIC_KEY"
printf '\nPrivé JSON-keypair staat lokaal in:\n%s\n' "$KEY_FILE"

if command -v clip.exe >/dev/null 2>&1; then
  if clip.exe < "$KEY_FILE"; then
    echo 'De volledige privé JSON-array is naar je Windows-klembord gekopieerd.'
    echo 'Plak deze uitsluitend in PARTNER_MINT_DEVNET_QUOTE_SIGNER_KEYPAIR op de pagina Geheimen.'
    echo 'Wis daarna je klembord en eventuele klembordgeschiedenis.'
  else
    echo 'Kopiëren mislukt: open het lokale JSON-bestand en kopieer de volledige array handmatig.'
  fi
else
  echo 'Open het lokale JSON-bestand en kopieer de volledige array naar het beveiligde secret-invoerveld.'
fi

echo 'Deel nooit dit JSON-bestand, de inhoud of een screenshot ervan in de chat.'
echo 'Deze key ondertekent alleen quotes: geen SOL of tokens hiernaartoe sturen.'
echo 'Volgende stap: de publieke key instellen in de on-chain Partner Mint-instellingen op devnet.'