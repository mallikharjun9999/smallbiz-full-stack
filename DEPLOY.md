# Deploy guide — Small Business Manager (MERN)

You already run it locally. Pick **one** path below.

## Path A — Managed hosting (recommended, no Docker)

### 1. Database: MongoDB Atlas (free M0)
1. Create cluster → Database Access: add user/password → Network Access: allow `0.0.0.0/0` (or your hosts).
2. Copy connection string, e.g. `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/smallbiz`.

### 2. Backend: Render (free)
1. Push this repo to GitHub.
2. Render → New → Web Service → select repo → Root Directory: `backend`.
   - Build: `npm install`, Start: `node server.js`.
   - Or use this repo's `render.yaml` blueprint (Render → New → Blueprint).
3. Environment:
   - `MONGO_URI` = Atlas string
   - `JWT_SECRET` = long random string (Generate)
   - `FRONTEND_URL` = your frontend URL (set after step 3, then redeploy)
4. Verify: `https://<api>.onrender.com/healthz` → `{"ok":true}`, and `/` lists endpoints.
5. Create admin on production: `POST https://<api>.onrender.com/api/auth/register`
   with `{"name":"...","email":"...","password":"..."}` (first user becomes admin).
   Note: free Render instances sleep when idle — first request can take ~1 min.

### 3. Frontend: Vercel (free)
1. Vercel → New Project → same repo → Root Directory: `frontend`.
   - Build: `npm run build`, Output: `dist` (auto-detected for Vite).
2. Environment variable: `VITE_API_URL=https://<api>.onrender.com/api`, then redeploy.
3. Add the Vercel URL to backend `FRONTEND_URL` and redeploy backend.
4. SPA routing (`/products`, `/sales`, …) works on Vercel with no extra config.

## Path B — Single VPS with Docker (one URL, no CORS)

Needs: a VM with Docker + Compose plugin, ports 80 (and 443 via your reverse proxy) open.

```bash
# on the server, in the repo root:
export JWT_SECRET='<long-random-string>'   # required — do NOT use the default
docker compose up -d --build
docker compose exec backend npm run seed   # optional: admin@shop.com / admin123 + samples
curl http://localhost:5000/healthz
```

- App: `http://<server-ip>/` (nginx serves React, proxies `/api` → backend).
- Data persists in the `mongo-data` volume.
- For HTTPS, put Caddy/Nginx with TLS in front, or add a TLS profile to the compose file.

## Production checklist
- [ ] Real `JWT_SECRET`, Atlas (or volume-backed) DB, admin password changed.
- [ ] `FRONTEND_URL` set on backend when frontend is on a different origin.
- [ ] First user registered = admin; extra users get `staff` and can be promoted at `/users`.
