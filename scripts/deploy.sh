#!/bin/bash
set -e

echo "=== Samanaffa Deployment Script ==="

# Configuration
APP_DIR="/var/www/samanaffa"
REPO_URL="https://github.com/aliouuuw/samanaffa_landing.git"
BRANCH="preview"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[1/6] Pulling latest code...${NC}"
cd "$APP_DIR"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo -e "${YELLOW}[2/6] Installing dependencies...${NC}"
bun install --frozen-lockfile

echo -e "${YELLOW}[3/6] Building shared package...${NC}"
bun run build:shared

echo -e "${YELLOW}[4/6] Building web app...${NC}"
bun run build:web

echo -e "${YELLOW}[5/6] Restarting PM2 processes...${NC}"
pm2 restart ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs

echo -e "${YELLOW}[6/6] Saving PM2 process list...${NC}"
pm2 save

echo -e "${GREEN}=== Deployment complete! ===${NC}"
pm2 status
