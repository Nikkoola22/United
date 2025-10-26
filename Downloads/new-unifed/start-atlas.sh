#!/bin/bash

# 🚀 SCRIPT DE LANCEMENT - ATLAS UNIFIED SEARCH SYSTEM
# Usage: ./start-atlas.sh

echo "════════════════════════════════════════════════════════"
echo "🎯 ATLAS - SYSTÈME DE RECHERCHE UNIFIÉ"
echo "════════════════════════════════════════════════════════"
echo ""

# Vérifier si le .env existe
if [ ! -f .env.local ]; then
    echo "⚠️  Fichier .env.local non trouvé!"
    echo "Créez-le avec: VITE_PERPLEXITY_API_KEY=xxx"
    exit 1
fi

echo "✅ Configuration trouvée"
echo ""

# Tuer les anciens processus
echo "🛑 Arrêt des anciens processus..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2
echo "✅ Anciens processus arrêtés"
echo ""

# Démarrer le serveur proxy
echo "🚀 Démarrage du serveur proxy (port 3001)..."
node server.js > logs/proxy.log 2>&1 &
PROXY_PID=$!
sleep 2

# Vérifier le proxy
if curl -s http://localhost:3001/api/completions &>/dev/null; then
    echo "✅ Proxy API fonctionnel"
else
    echo "❌ Proxy API non réactif"
    kill $PROXY_PID
    exit 1
fi
echo ""

# Démarrer le serveur dev
echo "🚀 Démarrage du serveur dev (port auto)..."
npm run dev > logs/dev.log 2>&1 &
DEV_PID=$!
sleep 5

# Obtenir le port actuel
PORT=$(grep -o "Local:.*:5[0-9]\{3\}" logs/dev.log | grep -o "5[0-9]\{3\}" | head -1)
if [ -z "$PORT" ]; then
    PORT=5174
fi

echo "✅ Serveur dev fonctionnel sur port $PORT"
echo ""

echo "════════════════════════════════════════════════════════"
echo "✅ ATLAS EST PRÊT!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📱 URL: http://localhost:$PORT"
echo "🔌 Proxy: http://localhost:3001"
echo "📊 Logs:"
echo "   - Proxy: logs/proxy.log"
echo "   - Dev: logs/dev.log"
echo ""
echo "💡 Commandes:"
echo "   - Ouvrir: open http://localhost:$PORT"
echo "   - Debug: tail -f logs/dev.log"
echo "   - Tests: npm run test"
echo ""
echo "❌ Pour arrêter: Ctrl+C"
echo "════════════════════════════════════════════════════════"
echo ""

# Garder les processus vivants
wait $PROXY_PID $DEV_PID
