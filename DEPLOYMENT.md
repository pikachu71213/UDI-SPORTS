# UDIISA Production Deployment (No-Issue Checklist)

This guide deploys:
- Website: `webfrontend` (SEO-ready Vite build)
- Admin panel: `admin`
- API: `backend` (Node + MongoDB)

## 1) Domains and target architecture

Recommended:
- `https://udisports.in` -> website static files (`webfrontend/dist`)
- `https://admin.udisports.in` -> admin static files (`admin/dist`)
- `https://api.udisports.in` -> backend Node API

Alternative (current app supports this too):
- Keep API at `https://udisports.in/api` via reverse proxy.

## 2) Environment variables (mandatory)

### Backend (`backend/.env`)
Create `backend/.env` on the server with at least:

Required:
- `NODE_ENV=production`
- `PORT=5000` (or your server port)
- `MONGODB_URI=<your mongo uri>`
- `JWT_SECRET=<min 32 chars>`
- `CORS_ORIGINS=https://udisports.in,https://admin.udisports.in`
- `FRONTEND_URL=https://udisports.in`
- `ADMIN_URL=https://admin.udisports.in`

Email/Cloudinary variables are required for OTP and media.

### Web frontend (`webfrontend/.env.production`)
Create `webfrontend/.env.production` before `npm run build`, for example:
- if API on subdomain: `VITE_API_URL=https://api.udisports.in/api`
- if API behind same domain: `VITE_API_URL=https://udisports.in/api`

### Admin (`admin/.env.production`)
Create `admin/.env.production` before build, for example:
- `VITE_API_URL=https://api.udisports.in/api` (or same-domain `/api` endpoint)

## 3) Build commands

Run in each folder:

### Website
```bash
cd webfrontend
npm ci
npm run build
```

`npm run build` automatically does:
- sitemap generation
- static SEO route pages generation
- SEO build verification

### Admin
```bash
cd admin
npm ci
npm run build
```

### Backend
```bash
cd backend
npm ci
npm run start
```

Use process manager for production:
```bash
pm2 start server.js --name udiisa-api
pm2 save
```

## 4) Web server routing rules

### Website static hosting
Deploy complete `webfrontend/dist` as site root.

Included files already handle SPA routing:
- `.htaccess` (Apache)
- `_redirects` (Netlify)

Also includes canonical redirect:
- `/Contribute-now` -> `/donate-now` (301)

### Nginx reverse proxy example
```nginx
server {
  server_name udisports.in;
  root /var/www/udisports/webfrontend/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Admin domain:
```nginx
server {
  server_name admin.udisports.in;
  root /var/www/udisports/admin/dist;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 5) Final smoke tests

- Website navigation and hard refresh on inner routes works
- Admin login works
- API health endpoint works: `/api/health`
- Contact and OTP flows work

If all above pass, deployment is production-ready.
