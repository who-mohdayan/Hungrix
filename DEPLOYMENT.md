# Hungrix Deployment Guide

This guide deploys:
- Backend API to Render Web Service
- Frontend to Render Static Site
- Database on MongoDB Atlas

## 1) Prepare MongoDB Atlas

1. Create a free Atlas cluster.
2. Create a DB user and password.
3. In Network Access, allow your host (for quick setup, you can temporarily allow `0.0.0.0/0`).
4. Copy the connection string.

Example:

`mongodb+srv://<username>:<password>@<cluster-url>/campus-food-db?retryWrites=true&w=majority`

## 2) Deploy With Render Blueprint

1. Push this repository to GitHub (already done).
2. Open Render Dashboard.
3. Click **New +** -> **Blueprint**.
4. Connect repository: `who-mohdayan/Hungrix`.
5. Render detects `render.yaml` and creates two services:
   - `hungrix-api` (backend)
   - `hungrix-web` (frontend)

## 3) Set Environment Variables in Render

Set these on `hungrix-api`:
- `MONGODB_URI` = your Atlas URI
- `JWT_SECRET` = long random secret (recommended 64+ chars)
- `CLIENT_URL` = URL of `hungrix-web` service (for CORS)
- `ADMIN_REGISTRATION_KEY` = secret key for admin registration

Set this on `hungrix-web`:
- `VITE_API_URL` = `https://<your-hungrix-api-domain>/api`

## 4) Redeploy Order

1. Deploy backend first (`hungrix-api`) and copy its URL.
2. Add backend URL to frontend `VITE_API_URL`.
3. Set backend `CLIENT_URL` to frontend URL.
4. Trigger redeploy on both services.

## 5) Verify Production

Backend health check:

`https://<your-hungrix-api-domain>/api/health`

Expected response:

`{"status":"OK","message":"Campus Food Intelligence System API is running"}`

Frontend:
- Open `https://<your-hungrix-web-domain>`
- Test login and protected routes
- Verify booking and analytics pages can call API successfully

## 6) Optional: Seed Production Data

If you want demo users and menus in production, run seed once in backend environment:

`npm run seed`

You can run this from a temporary shell in Render, or locally against Atlas by setting backend `.env` to production Atlas URI and running the command from `backend`.

## 7) Recommended Security

- Replace default secrets and admin key.
- Restrict MongoDB Atlas Network Access after initial deploy.
- Keep `CLIENT_URL` exact (no wildcard) for CORS safety.
- Do not commit real `.env` files.
