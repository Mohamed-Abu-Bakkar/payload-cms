# Quick Deploy Guide - Vercel + MongoDB Atlas

## 🚀 Quick Start (5 minutes)

### 1. MongoDB Atlas Setup (2 minutes)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up → Create free cluster (M0)
3. **Database Access**: Create user → Save username/password
4. **Network Access**: Allow from anywhere (0.0.0.0/0)
5. **Connect**: Click "Connect" → "Connect your application"
6. Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/foliomate?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with your credentials

### 2. Generate Secret (30 seconds)

```bash
openssl rand -base64 32
```

Save this value!

### 3. Deploy to Vercel (2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub/GitLab repository
4. **Root Directory**: Set to `cms` (if your project is in a subdirectory)
5. **Build Command**: `pnpm build`
6. **Install Command**: `pnpm install`

### 4. Set Environment Variables in Vercel

Go to **Settings** → **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `PAYLOAD_SECRET` | Your generated secret (from step 2) |
| `DATABASE_URI` | Your MongoDB connection string (from step 1) |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://your-project.vercel.app` (set after first deploy) |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://your-project.vercel.app` (or your custom domain) |

**Important**: Set these for **Production**, **Preview**, and **Development** environments.

### 5. Deploy!

1. Click **"Deploy"**
2. Wait for build to complete (~2-5 minutes)
3. Once deployed, note your Vercel URL
4. Update `PAYLOAD_PUBLIC_SERVER_URL` with your actual Vercel URL
5. Redeploy (or wait for auto-redeploy)

### 6. Create Admin User

After deployment:

```bash
# Install Payload CLI
pnpm add -g payload

# Create user
payload create:user
```

Enter your MongoDB connection string when prompted.

---

## ✅ Verify Deployment

1. **Admin Panel**: `https://your-project.vercel.app/admin`
2. **API**: `https://your-project.vercel.app/api/templates`
3. **Frontend**: `https://your-project.vercel.app`

---

## 🔧 Troubleshooting

### Build Fails?
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Check `pnpm-lock.yaml` is committed

### Can't Connect to Database?
- Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
- Check connection string format
- Verify username/password are correct

### Images Not Loading?
- Update `PAYLOAD_PUBLIC_SERVER_URL` to your Vercel URL
- Redeploy after updating environment variables

---

## 📋 Environment Variables Checklist

- [ ] `PAYLOAD_SECRET` - 32+ character random string
- [ ] `DATABASE_URI` - MongoDB Atlas connection string
- [ ] `PAYLOAD_PUBLIC_SERVER_URL` - Your Vercel URL
- [ ] `NEXT_PUBLIC_FRONTEND_URL` - Your frontend URL

---

## 🎉 Done!

Your Payload CMS is now live on Vercel! 🚀

For detailed instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)


