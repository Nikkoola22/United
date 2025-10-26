#!/bin/bash

echo "🚀 Démarrage de l'application Atlas CFDT..."

# Démarrer le serveur Express en arrière-plan
echo "📡 Démarrage du serveur API (port 3001)..."
node server.js &
EXPRESS_PID=$!

# Attendre que le serveur soit prêt
sleep 3

# Démarrer Vite
echo "🌐 Démarrage de l'interface web (port 5173)..."
npm run dev

# Nettoyer les processus à l'arrêt
trap "kill $EXPRESS_PID" EXIT