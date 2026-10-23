#!/bin/bash
set -e
BASE_DIR="/home/miyakawaharuki/java学習"
APP_DIR="$BASE_DIR/tomcat_base/webapps/mykakeibo"

if [ ! -d "/usr/share/tomcat10" ]; then
    echo "📦 Tomcat 10 がまだインストールされていません。以下のコマンドを実行してください："
    echo "   sudo apt update && sudo apt install -y default-jdk tomcat10"
    exit 1
fi

mkdir -p "$BASE_DIR/tomcat_base"/{conf,logs,temp,work,webapps}
if [ ! -f "$BASE_DIR/tomcat_base/conf/server.xml" ]; then
    cp -r /etc/tomcat10/* "$BASE_DIR/tomcat_base/conf/" 2>/dev/null || cp -r /usr/share/tomcat10/conf/* "$BASE_DIR/tomcat_base/conf/"
fi
mkdir -p "$APP_DIR/WEB-INF"/{classes,src}
ln -sfn "$APP_DIR" "$BASE_DIR/mykakeibo"

echo "🔨 [1/2] Servlet・Javaクラスをコンパイルしています..."
find "$APP_DIR/WEB-INF/src" -name "*.java" > /tmp/java_sources.txt
if [ -s /tmp/java_sources.txt ]; then
    javac -cp "/usr/share/tomcat10/lib/*:$APP_DIR/WEB-INF/classes" \
          -d "$APP_DIR/WEB-INF/classes" \
          @/tmp/java_sources.txt
    echo "✅ コンパイル成功！"
else
    echo "ℹ️ コンパイル対象の .java ファイルがまだありません（JSPのみの場合はそのままでOK）。"
fi

echo "🚀 [2/2] Tomcatサーバーを起動（再起動）しています..."
export CATALINA_HOME="/usr/share/tomcat10"
export CATALINA_BASE="$BASE_DIR/tomcat_base"
$CATALINA_HOME/bin/shutdown.sh 2>/dev/null || true
sleep 1
$CATALINA_HOME/bin/startup.sh

echo "=========================================================="
echo "🌐 起動完了！Ubuntuのブラウザで以下のURLを開いてください："
echo "   👉 http://localhost:8080/mykakeibo/"
echo "=========================================================="

