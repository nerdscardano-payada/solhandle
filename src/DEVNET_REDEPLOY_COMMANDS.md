# SolHandle V1 Devnet-heruitrol

Open WSL en plak exact deze ene opdracht. Die zoekt eerst automatisch de juiste `src`-projectmap en start daarna het script:

```bash
PROJECT_DIR="$(find "$HOME" /mnt/c/Users -type f -path "*/src/Anchor.toml" -print -quit 2>/dev/null | xargs -r dirname)" && test -n "$PROJECT_DIR" && cd "$PROJECT_DIR" && echo "Projectmap: $(pwd)" && bash scripts/redeploy-devnet.sh
```

Als de opdracht werkt, zie je meteen eerst `Projectmap:` en daarna je Devnet-walletadres. De wallet op `~/.config/solana/solhandle-devnet.json` moet bestaan en minstens 1 Devnet SOL bevatten.

Na een geslaagde uitvoer: commit de gewijzigde publieke programma-ID-bestanden, publiceer de app opnieuw en voer daarna de acceptatietests uit met `@demo1` en `@travel`.