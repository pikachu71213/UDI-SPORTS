#!/usr/bin/env bash
# Production deploy for UDIISA (backend + webfrontend + admin)
# Prereqs: Node, PM2, nginx, backend .env and NODE_ENV=production set (e.g. in PM2 env)
set -euo pipefail

APP_ROOT="/var/www/udiisa-website"
BACKEND_NAME="udiisa-backend"

echo "==> Starting deployment..."
cd "$APP_ROOT"

echo "==> Pulling latest code..."
git pull

echo "==> Backend..."
cd "$APP_ROOT/backend"
npm ci --omit=dev
pm2 restart "$BACKEND_NAME"
pm2 save

echo "==> Building webfrontend (production)..."
cd "$APP_ROOT/webfrontend"
npm ci
# Uses webfrontend/.env.production if present (set VITE_API_URL there)
npm run build

echo "==> Building admin (production)..."
cd "$APP_ROOT/admin"
npm ci
# Uses .env.production if present
npm run build

echo "==> Nginx..."
nginx -t
systemctl reload nginx

echo "==> Health checks..."
curl -sf http://localhost:5000/api/health && echo " OK" || { echo "Backend health check failed"; exit 1; }
curl -sI -o /dev/null -w "%{http_code}" --max-time 10 https://udisports.in/ | grep -q 200 && echo "Website OK" || echo "Warning: website returned non-200"
curl -sI -o /dev/null -w "%{http_code}" --max-time 10 https://udisports.in/admin/ | grep -qE '200|301' && echo "Admin OK" || echo "Warning: admin returned non-200"

echo "==> Deployment completed successfully."
