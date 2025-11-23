# 📅 Google Calendar Sync App

Bidirectional Google Calendar ↔ Local PostgreSQL App  
React + Node.js + Prisma + Passport OAuth2 + TypeScript

## 📚 Table of Contents

- [🚀 Features](#-features)
- [📦 Tech Stack](#-tech-stack)
- [🗂 Project Structure](#-project-structure)
- [🛠️ First-Time Setup](#️-first-time-setup)
- [🛢️ Database Setup](#️-database-setup-postgresql)
- [🎨 Prettier Setup](#-prettier-setup)
- [🏗️ Project Build Setup](#️-project-build-setup-production)
- [▶️ Running the App](#️-running-the-app)
- [⚙️ Environment Variables](#️-environment-variables-summary)
- [🧪 Testing OAuth Login](#-testing-oauth-login)
- [🔧 Troubleshooting](#-troubleshooting)

---

# 🚀 Features

- Google OAuth2 login (Passport)
- Prisma ORM with PostgreSQL
- Bidirectional calendar sync (Google ↔ Local)
- Auto-refreshing Google tokens
- Weekly or daily event grouping
- API + React frontend (Vite)
- Concurrent development server option

---

# 📦 Tech Stack

### **Backend**

- Node.js
- Express
- TypeScript
- Passport.js (Google OAuth 2.0)
- Prisma ORM
- PostgreSQL
- Google Calendar API v3
- JWT (cookie-based authentication)

### **Frontend**

- React
- TypeScript
- Vite

### **Tooling**

- Prettier (code formatting)
- concurrently (run client + server together)
- dotenv
- googleapis package

---

# 🗂 Project Structure

```
root/
 ├── server/
 │    ├── prisma/
 │    │     └── schema.prisma
 │    ├── src/
 │    │     ├── index.ts
 │    │     ├── google/
 │    │     ├── routes/
 │    │     ├── config/
 │    │     ├── middleware/
 │    │     └── prisma.ts
 │    ├── package.json
 │    └── .env
 │
 ├── client/
 │    ├── src/
 │    ├── package.json
 │    └── vite.config.ts
 │
 ├── prettier.config.cjs
 ├── package.json        (root, used for concurrent dev)
 └── README.md
```

---

# 🛠️ First-Time Setup

## 1️⃣ Install dependencies

### **Backend**

```
cd server
npm install
```

### **Frontend**

```
cd ../client
npm install
```

### **Shared**

```
cd ../
npm i concurrently
```

---

# 🛢️ Database Setup (PostgreSQL)

Your system must have **PostgreSQL** installed and running.

---

## 1. Create the database

```sql
CREATE DATABASE google_calendar_sync;
```

Or with terminal:

```bash
psql -U postgres -c "CREATE DATABASE google_calendar_sync;"
```

---

## 2. Configure the backend `.env`

Create `server/.env`:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/google_calendar_sync"

GOOGLE_CLIENT_ID=xxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
PORT=4000
```

---

## 3. Initialize tables with Prisma (VERY IMPORTANT)

### ✔ Step 1: Generate Prisma Client

```
cd server
npx prisma generate
```

### ✔ Step 2: Run migrations

```
npx prisma migrate dev --name init
```

### ✔ Step 3 (Optional): Seed the database

```
npx prisma db seed
```

---

## 4. Inspect data visually

```
npx prisma studio
```

---

# 📦 Build Setup

This document contains only the **build-related setup** for the project.

---

## 🚀 Backend Build (server)

### Commands

```bash
cd server
npm run build
npm start
```

### Required `server/package.json` scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Output directory

```
server/dist/
```

---

## 🖥️ Frontend Build (client)

### Commands

```bash
cd client
npm run build
npm run preview
```

### Required `client/package.json` scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Output directory

```
client/dist/
```

---

## 🔧 Root Build (build both client + server)

### Command

```bash
npm run build
```

### Required root `package.json` scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm --prefix server run dev\" \"npm --prefix client run dev\"",
    "build": "npm --prefix server run build && npm --prefix client run build"
  }
}
```

---

## 📁 Build Output Summary

- Backend compiled to: `server/dist/`
- Frontend compiled to: `client/dist/`

---

# 🎨 Prettier Setup (Code Formatting)

This project includes full **Prettier** support for consistent formatting across **client and server**.

---

## 1. Install Prettier (already included if you cloned the repo)

If needed, install manually at the root:

```
npm install --save-dev prettier
```

Optional plugins:

```
npm install --save-dev @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss
```

---

## 2. Prettier Config (`prettier.config.cjs`)

```cjs
module.exports = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 100,
  arrowParens: "always",
  bracketSpacing: true,
  endOfLine: "lf",

  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],

  importOrder: [
    "^(react|react-dom)$",
    "<THIRD_PARTY_MODULES>",
    "^@server/(.*)$",
    "^@client/(.*)$",
    "^[./]",
  ],

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
```

---

## 3. Prettier Ignore Rules (`.prettierignore`)

```
node_modules
dist
build
.env
*.log
prisma/migrations
```

---

## 4. Format Commands

Add to **root** `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

Run formatting:

```
npm run format
```

---

## 5. VSCode Setup (recommended)

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.configPath": "./prettier.config.cjs"
}
```

# ▶️ Running the App

You can run backend & frontend together or separately.

---

## 🟩 Run Concurrently (recommended)

From the **root directory**:

```
npm run dev
```

This uses `concurrently` to run:

- Server: http://localhost:4000
- Client: http://localhost:5173

Ensure your root `package.json` has:

```json
{
  "scripts": {
    "dev": "concurrently \"npm --prefix server run dev\" \"npm --prefix client run dev\""
  }
}
```

---

## 🟦 Run Backend Only

```
cd server
npm run dev
```

---

## 🟨 Run Frontend Only

```
cd client
npm run dev
```

---

# ⚙️ Environment Variables Summary

| Variable               | Description                  |
| ---------------------- | ---------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret          |
| `GOOGLE_CALLBACK_URL`  | OAuth callback URL           |
| `JWT_SECRET`           | JWT signing secret           |
| `CLIENT_URL`           | React frontend URL           |
| `PORT`                 | Server port                  |

---

# 🧪 Testing OAuth Login

1. Start backend
2. Visit:  
   `http://localhost:4000/auth/google`
3. Complete Google login
4. You will be redirected to the frontend authenticated via HTTP-only JWT cookie

---

# 🔧 Troubleshooting Guide

### ❗ Prisma error: model or field does not exist

```
npx prisma generate
```

---

### ❗ OAuth redirect_uri mismatch

Ensure:

```
http://localhost:4000/auth/google/callback
```

---

### ❗ No refresh token returned

```
accessType: "offline",
prompt: "consent"
```

---

### ❗ CORS issues

Backend:

```ts
cors({ origin: CLIENT_URL, credentials: true });
```

Frontend:

```ts
fetch(..., { credentials: "include" })
```

---

### ❗ JWT issues

- `JWT_SECRET` must exist
- Using httpOnly cookies
- Same domain/localhost

---

### ❗ Sync not working

Check:

```
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/calendar.events
```

Token refresh, sync window, and timestamps must also be valid.

---
