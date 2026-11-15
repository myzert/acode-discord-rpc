#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

# Hapus zip lama
rm -f plugin.zip acode-discord-rpc.zip

# Buat plugin.zip (Format standar resmi Acode Registry)
zip -r plugin.zip plugin.json main.js icon.png readme.md

# Salin juga sebagai acode-discord-rpc.zip untuk instalasi manual
cp plugin.zip acode-discord-rpc.zip

echo "=========================================="
echo "✅ Plugin berhasil dibuild:"
echo "   - $DIR/plugin.zip (Acode Store Format)"
echo "   - $DIR/acode-discord-rpc.zip (Manual Install)"
echo "=========================================="
echo "Ukuran: $(du -h plugin.zip | cut -f1)"
