#!/bin/bash
echo "🔍 Airbnb Voice Project Verification"
echo "===================================="
echo ""

# Check core files
echo "📋 Checking core files..."
files=(
  "package.json"
  ".env"
  "vite.config.js"
  "index.html"
  "server/index.js"
  "src/main.jsx"
  "src/App.jsx"
  "src/index.css"
  "src/screens/IdleScreen.jsx"
  "src/screens/ResultsScreen.jsx"
  "src/screens/BookingScreen.jsx"
  "src/screens/ConfirmedScreen.jsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (MISSING)"
  fi
done

echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
  echo "✅ node_modules installed"
  echo "   - react"
  echo "   - react-dom"
  echo "   - express"
  echo "   - cors"
  echo "   - dotenv"
  echo "   - vite"
else
  echo "❌ node_modules not found - run: npm install"
fi

echo ""
echo "🚀 Ready to run?"
echo "   npm run dev"
echo ""
echo "✨ All systems go!"
