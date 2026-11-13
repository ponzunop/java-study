#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${1:-8081}"
LOCAL_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"

echo "=========================================================="
echo "🎮 Java Quest: MyKakeibo RPG を起動します"
echo "🌐 PCブラウザ:     http://localhost:${PORT}/game/"
if [ -n "$LOCAL_IP" ]; then
  echo "📱 スマホ(同じWi-Fi): http://${LOCAL_IP}:${PORT}/game/"
fi
echo "📚 講義資料(README/lesson01〜14)もそのまま閲覧・参照できます"
echo "   停止するには Ctrl+C を押してください"
echo "=========================================================="

cd "$SCRIPT_DIR"
python3 -m http.server "$PORT" --bind 0.0.0.0
