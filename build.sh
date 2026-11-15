#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

ZIP_NAME="acode-discord-rpc.zip"

# Hapus zip lama jika ada
rm -f "$ZIP_NAME"

# Zip file plugin yang dibutuhkan Acode
zip -r "$ZIP_NAME" plugin.json main.js icon.png readme.md

echo "=========================================="
echo "✅ Plugin berhasil dibuild: $DIR/$ZIP_NAME"
echo "=========================================="
echo "Ukuran file: $(du -h "$ZIP_NAME" | cut -f1)"
echo ""
echo "Cara install di Acode:"
echo "1. Buka Acode -> Settings -> Plugins"
echo "2. Klik menu titik tiga (⋮) -> 'Install from storage'"
echo "3. Pilih file $ZIP_NAME"
