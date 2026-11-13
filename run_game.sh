#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${1:-8081}"

echo "=========================================================="
echo "🎮 Java Quest: MyKakeibo RPG を起動します"
echo "🌐 ブラウザで以下のURLを開いてください:"
echo "   👉 http://localhost:${PORT}/game/"
echo "📚 講義資料(README/lesson01〜10)もそのまま閲覧・参照できます"
echo "   停止するには Ctrl+C を押してください"
echo "=========================================================="

cd "$SCRIPT_DIR"
python3 -m http.server "$PORT"
