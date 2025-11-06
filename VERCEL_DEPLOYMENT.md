# Deploying to Vercel with MongoDB Atlas

This guide will walk you through deploying your Payload CMS application to Vercel with MongoDB Atlas.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A MongoDB Atlas account (sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
3. Your project repository on GitHub, GitLab, or Bitbucket

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create a MongoDB Atlas Cluster

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Create"** or **"New Project"**
3. Choose **"Build a Database"** → Select **"Free"** (M0) tier for development
4. Select a cloud provider and region (choose one close to your Vercel deployment region)
5. Click **"Create"**

### 1.2 Configure Database Access

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create a username and strong password (save these!)
5. Set user privileges to **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For Vercel deployment, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ **Note**: For production, consider restricting to Vercel IP ranges
4. Click **"Confirm"**

### 1.4 Get Your Connection String

1. Go to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **"Driver"**: Node.js, **"Version"**: 5.5 or later
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials
6. Add your database name at the end: `...mongodb.net/foliomate?retryWrites=true&w=majority`

**Your final connection string should look like:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/foliomate?retryWrites=true&w=majority
```

---

## Step 2: Generate a Secure Secret

Generate a secure random string for `PAYLOAD_SECRET`:

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Save this value - you'll need it for Vercel environment variables.

---

## Step 3: Deploy to Vercel

### 3.1 Connect Your Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Select the repository containing your Payload CMS project

### 3.2 Configure Project Settings

1. **Root Directory**: Set to `cms` (if your project is in a subdirectory)
2. **Framework Preset**: Should auto-detect as "Next.js"
3. **Build Command**: `pnpm build` (or `npm run build`)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `pnpm install` (or `npm install`)

### 3.3 Set Environment Variables

Click **"Environment Variables"** and add the following:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `PAYLOAD_SECRET` | Your generated secret | The random string from Step 2 |
| `DATABASE_URI` | Your MongoDB Atlas connection string | From Step 1.4 |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://your-project.vercel.app` | Your Vercel deployment URL |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://your-frontend-domain.com` | Your frontend URL (if different) |
| `NODE_ENV` | `production` | Set automatically by Vercel |

**Important Notes:**
- Set these for **Production**, **Preview**, and **Development** environments
- `PAYLOAD_PUBLIC_SERVER_URL` must match your Vercel deployment URL
- After first deployment, Vercel will give you a URL like `your-project.vercel.app`

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, Vercel will provide you with a URL

---

## Step 4: Update Environment Variables After First Deploy

After your first deployment, Vercel will give you a URL. Update `PAYLOAD_PUBLIC_SERVER_URL`:

1. Go to your project settings in Vercel
2. Navigate to **"Environment Variables"**
3. Update `PAYLOAD_PUBLIC_SERVER_URL` to your actual Vercel URL:
   ```
   https://your-project-name.vercel.app
   ```
4. Redeploy (or wait for automatic redeploy)

---

## Step 5: Create Your First Admin User

After deployment, you need to create an admin user:

### Option A: Using Payload CLI (Recommended)

1. Install Payload CLI locally:
   ```bash
   pnpm add -g payload
   ```

2. Create a user:
   ```bash
   payload create:user
   ```
   - Enter your MongoDB Atlas connection string when prompted
   - Enter email, password, and other details

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   cd cms
   vercel link
   ```

3. Run the create user command:
   ```bash
   vercel env pull .env.local
   payload create:user
   ```

---

## Step 6: Access Your Deployed CMS

1. **Admin Panel**: `https://your-project.vercel.app/admin`
2. **API**: `https://your-project.vercel.app/api/templates`
3. **GraphQL Playground**: `https://your-project.vercel.app/api/graphql-playground`

---

## Step 7: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to **"Domains"**
3. Add your custom domain (e.g., `cms.yourdomain.com`)
4. Update DNS records as instructed by Vercel
5. Update `PAYLOAD_PUBLIC_SERVER_URL` to your custom domain
6. Redeploy

---

## Troubleshooting

### Build Fails

- **Error: "Module not found"**
  - Ensure all dependencies are in `package.json`
  - Check that `pnpm-lock.yaml` is committed

- **Error: "Out of memory"**
  - Vercel free tier has memory limits
  - Consider upgrading to Pro plan or optimize build

### Database Connection Issues

- **"MongoNetworkError"**
  - Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
  - Check connection string has correct username/password
  - Ensure database name is in the connection string

- **"Authentication failed"**
  - Verify database user credentials in Atlas
  - Check connection string format

### Environment Variables Not Working

- Ensure variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding/changing environment variables
- Check variable names match exactly (case-sensitive)

### Images Not Loading

- Update `PAYLOAD_PUBLIC_SERVER_URL` to your Vercel URL
- Check `next.config.mjs` includes Vercel domains in `remotePatterns`

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with proper permissions
- [ ] Network access configured (0.0.0.0/0 for Vercel)
- [ ] Connection string obtained and tested
- [ ] `PAYLOAD_SECRET` generated (strong, random, 32+ characters)
- [ ] All environment variables set in Vercel
- [ ] Project deployed successfully
- [ ] Admin user created
- [ ] Test admin panel access
- [ ] Test API endpoints
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)

---

## Monitoring & Maintenance

### Vercel Analytics

- Enable Vercel Analytics in project settings
- Monitor performance and errors

### MongoDB Atlas Monitoring

- Monitor cluster performance in Atlas dashboard
- Set up alerts for high usage
- Enable backups for production data

### Regular Updates

- Keep dependencies updated
- Monitor Payload CMS releases
- Update Vercel deployment settings as needed

---

## Cost Estimation

### Vercel
- **Free Tier**: Perfect for development/small projects
  - Unlimited deployments
  - 100GB bandwidth/month
- **Pro Plan**: $20/month (recommended for production)
  - Better performance
  - More bandwidth
  - Team collaboration

### MongoDB Atlas
- **Free Tier (M0)**: 
  - 512MB storage
  - Shared RAM
  - Perfect for development
- **M10+**: $9+/month
  - Production-ready
  - Better performance
  - Automated backups

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Payload CMS Deployment Guide](https://payloadcms.com/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas connection logs
3. Review Payload CMS documentation
4. Check GitHub issues for known problems

Good luck with your deployment! 🚀


