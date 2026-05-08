#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 ISS + AI News Dashboard - Setup Verification"
echo "================================================"
echo ""

# Check Node.js
echo "📋 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION installed"
else
    echo -e "${RED}✗${NC} Node.js not found"
    exit 1
fi

# Check npm
echo "📋 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm $NPM_VERSION installed"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check dependencies
echo "📋 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exist"
else
    echo -e "${YELLOW}⚠${NC} node_modules not found, installing..."
    npm install --legacy-peer-deps
fi

# Check .env file
echo "📋 Checking environment variables..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file found"
    
    # Check if keys are set
    if grep -q "your_newsapi_key_here" .env; then
        echo -e "${YELLOW}⚠${NC} VITE_NEWS_API_KEY not configured"
    else
        echo -e "${GREEN}✓${NC} VITE_NEWS_API_KEY configured"
    fi
    
    if grep -q "your_huggingface_token_here" .env; then
        echo -e "${YELLOW}⚠${NC} VITE_AI_TOKEN not configured"
    else
        echo -e "${GREEN}✓${NC} VITE_AI_TOKEN configured"
    fi
else
    echo -e "${YELLOW}⚠${NC} .env file not found"
    echo -e "   Please copy .env.example to .env and add your API keys"
fi

# Check build
echo "📋 Building project..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed - check for errors above"
    exit 1
fi

# Check dist folder
echo "📋 Checking build output..."
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} dist folder created"
    SIZE=$(du -sh dist | cut -f1)
    echo -e "   Size: $SIZE"
else
    echo -e "${RED}✗${NC} dist folder not found"
    exit 1
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "1. Start dev server: npm run dev"
echo "2. Open http://localhost:5173"
echo "3. Configure API keys if not done"
echo ""
