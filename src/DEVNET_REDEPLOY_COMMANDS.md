# SolHandle V1 Devnet-heruitrol

Open WSL, ga naar de hoofdmap van dit project (de map die `Anchor.toml` bevat) en plak exact deze opdracht:

```bash
chmod +x scripts/redeploy-devnet.sh && bash scripts/redeploy-devnet.sh
```

Het script maakt automatisch een nieuw Devnet-programma-ID, bouwt en publiceert V1, initialiseert de Config en controleert de protocolversie. De wallet op `~/.config/solana/solhandle-devnet.json` moet bestaan en minstens 1 Devnet SOL bevatten.

Na een geslaagde uitvoer: commit de gewijzigde publieke programma-ID-bestanden, publiceer de app opnieuw en voer daarna de acceptatietests uit met `@demo1` en `@travel`.