# FolioMate CMS - Deployment Checklist

## Pre-Production Checklist

Before deploying FolioMate CMS to production, ensure you've completed all items below.

---

## 🔒 Security

- [ ] **Change PAYLOAD_SECRET**
  ```bash
  # Generate a secure secret
  openssl rand -base64 32
  # Update .env with the new value
  ```

- [ ] **Update Database URI**
  - [ ] Use MongoDB Atlas or secure MongoDB instance
  - [ ] Enable authentication on MongoDB
  - [ ] Use connection string with SSL/TLS
  - [ ] Add IP whitelist if using MongoDB Atlas

- [ ] **Environment Variables**
  - [ ] Never commit `.env` to version control
  - [ ] Use environment variable management (Vercel, Railway, etc.)
  - [ ] Set all required env vars in production

- [ ] **Admin Access**
  - [ ] Create production admin user(s)
  - [ ] Use strong passwords (min 12 characters)
  - [ ] Consider enabling 2FA if available
  - [ ] Remove test/development users

---

## 🌐 Configuration

- [ ] **Update Server URLs**
  ```env
  PAYLOAD_PUBLIC_SERVER_URL=https://cms.yourdomain.com
  NEXT_PUBLIC_FRONTEND_URL=https://yourdomain.com
  ```

- [ ] **Update Preview URLs**
  - [ ] Edit `src/collections/Templates.ts`
  - [ ] Change preview URL from `localhost:3001` to production URL
  ```typescript
  preview: (doc) => {
    return `https://yourdomain.com/template/${doc.slug}?preview=true`
  }
  ```

- [ ] **CORS Configuration** (if needed)
  - [ ] Add allowed origins for API access
  - [ ] Configure in `payload.config.ts`

- [ ] **Rate Limiting**
  - [ ] Consider adding rate limiting for API
  - [ ] Protect against brute force attacks

---

## 💾 Database

- [ ] **MongoDB Production Setup**
  - [ ] Use MongoDB Atlas (recommended) or managed MongoDB
  - [ ] Choose appropriate cluster tier for your needs
  - [ ] Enable automated backups
  - [ ] Set up monitoring and alerts
  - [ ] Configure retention policies

- [ ] **Test Database Connection**
  ```bash
  # Test connection string locally first
  DATABASE_URI=your-production-uri pnpm dev
  ```

- [ ] **Migration Strategy**
  - [ ] Plan data migration from dev to production
  - [ ] Test with sample data first
  - [ ] Have rollback plan ready

---

## 📦 Build & Deploy

- [ ] **Build Application**
  ```bash
  pnpm build
  ```

- [ ] **Test Production Build Locally**
  ```bash
  pnpm start
  # Access http://localhost:3000
  ```

- [ ] **Fix Any Build Errors**
  - [ ] TypeScript errors
  - [ ] ESLint warnings (run `pnpm lint`)
  - [ ] Missing dependencies

- [ ] **Choose Hosting Platform**
  - [ ] Vercel (recommended for Next.js)
  - [ ] Railway
  - [ ] AWS/Digital Ocean/Custom VPS
  - [ ] Docker deployment

---

## 🖼️ Media Storage

- [ ] **Configure Production Media Storage**
  
  **Option 1: Cloud Storage (Recommended)**
  - [ ] Set up AWS S3, Cloudflare R2, or similar
  - [ ] Install storage adapter:
    ```bash
    pnpm add @payloadcms/plugin-cloud-storage
    ```
  - [ ] Configure in `payload.config.ts`

  **Option 2: Server Storage**
  - [ ] Ensure adequate disk space
  - [ ] Set up backup strategy for uploads
  - [ ] Consider CDN for media delivery

- [ ] **Test File Uploads**
  - [ ] Upload test images
  - [ ] Verify URLs are accessible
  - [ ] Check image optimization

---

## 🔍 SEO & Performance

- [ ] **Enable Caching**
  - [ ] Configure CDN for static assets
  - [ ] Set appropriate cache headers
  - [ ] Use ISR (Incremental Static Regeneration) on frontend

- [ ] **Image Optimization**
  - [ ] Verify Sharp is working (already included)
  - [ ] Test image transformations
  - [ ] Consider lazy loading on frontend

- [ ] **API Performance**
  - [ ] Add database indexes (already configured)
  - [ ] Monitor query performance
  - [ ] Consider API caching layer

---

## 📧 Email Configuration

- [ ] **Set Up Email Service** (for password reset, etc.)
  - [ ] Choose provider (SendGrid, Postmark, AWS SES)
  - [ ] Configure SMTP settings
  - [ ] Add to `payload.config.ts`:
  ```typescript
  email: {
    fromName: 'FolioMate CMS',
    fromAddress: 'noreply@yourdomain.com',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
  }
  ```

- [ ] **Test Email Functionality**
  - [ ] Password reset flow
  - [ ] Welcome emails (if configured)

---

## 🧪 Testing

- [ ] **Run All Tests**
  ```bash
  pnpm test
  ```

- [ ] **Manual Testing Checklist**
  - [ ] User registration/login
  - [ ] Create template
  - [ ] Edit template
  - [ ] Save as draft
  - [ ] Publish template
  - [ ] Preview functionality
  - [ ] Upload media
  - [ ] Create categories
  - [ ] Assign categories to templates
  - [ ] Delete operations
  - [ ] API endpoints (REST & GraphQL)

- [ ] **Load Testing** (if expecting high traffic)
  - [ ] Test concurrent users
  - [ ] Test API response times
  - [ ] Monitor database performance

---

## 📊 Monitoring & Logging

- [ ] **Set Up Error Tracking**
  - [ ] Sentry, LogRocket, or similar
  - [ ] Configure error reporting
  - [ ] Test error notifications

- [ ] **Application Monitoring**
  - [ ] Set up uptime monitoring
  - [ ] Configure performance monitoring
  - [ ] Track API usage

- [ ] **Database Monitoring**
  - [ ] MongoDB Atlas monitoring
  - [ ] Set up alerts for:
    - High memory usage
    - Slow queries
    - Connection issues
    - Disk space

---

## 🚀 Deployment Steps

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   pnpm add -g vercel
   ```

2. **Connect to Vercel**
   ```bash
   vercel login
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env`

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Railway Deployment

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   railway init
   ```

3. **Add Environment Variables**
   ```bash
   railway variables set DATABASE_URI=your-mongo-uri
   railway variables set PAYLOAD_SECRET=your-secret
   railway variables set PAYLOAD_PUBLIC_SERVER_URL=https://your-app.railway.app
   ```

4. **Deploy**
   ```bash
   railway up
   ```

### Docker Deployment

1. **Build Image**
   ```bash
   docker build -t foliomate-cms .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e DATABASE_URI=your-mongo-uri \
     -e PAYLOAD_SECRET=your-secret \
     -e PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.com \
     foliomate-cms
   ```

---

## ✅ Post-Deployment

- [ ] **Verify Deployment**
  - [ ] Visit admin panel: `https://cms.yourdomain.com/admin`
  - [ ] Test login
  - [ ] Create test content
  - [ ] Check API endpoints

- [ ] **DNS Configuration**
  - [ ] Point domain to deployment
  - [ ] Configure SSL certificate (auto with Vercel/Railway)
  - [ ] Verify HTTPS is working

- [ ] **Create Initial Content**
  - [ ] Set up initial categories
  - [ ] Upload sample media
  - [ ] Create sample templates

- [ ] **Documentation**
  - [ ] Update README with production URLs
  - [ ] Document API endpoints for frontend team
  - [ ] Create admin user guide if needed

- [ ] **Backup Strategy**
  - [ ] Set up automated database backups
  - [ ] Test restore procedure
  - [ ] Document backup/restore process

---

## 🔄 Ongoing Maintenance

- [ ] **Regular Updates**
  - [ ] Keep Payload CMS updated
  - [ ] Update Node.js/pnpm
  - [ ] Security patches

- [ ] **Performance Monitoring**
  - [ ] Weekly check of error logs
  - [ ] Monitor database size
  - [ ] Check API response times

- [ ] **Content Moderation**
  - [ ] Review uploaded content
  - [ ] Manage user accounts
  - [ ] Clean up unused media

---

## 🆘 Rollback Plan

In case of issues:

1. **Keep Previous Version Deployed**
   - Tag releases in Git
   - Keep previous build available

2. **Database Backup Before Changes**
   - Always backup before major updates
   - Test restore procedure

3. **Rollback Steps**
   ```bash
   # Revert to previous Git commit
   git revert HEAD
   
   # Redeploy
   vercel --prod
   
   # Restore database if needed
   mongorestore --uri="your-mongo-uri" backup-folder/
   ```

---

## 📋 Environment Variables Checklist

Production `.env` should contain:

```env
# Required
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/foliomate
PAYLOAD_SECRET=<secure-random-string>
PAYLOAD_PUBLIC_SERVER_URL=https://cms.yourdomain.com

# Optional but Recommended
NEXT_PUBLIC_FRONTEND_URL=https://yourdomain.com
NODE_ENV=production

# Email (if configured)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-api-key

# Storage (if using cloud storage)
S3_BUCKET=your-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret

# Monitoring (if configured)
SENTRY_DSN=your-sentry-dsn
```

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Admin panel is accessible at production URL
✅ Users can login and manage content
✅ Templates can be created, edited, and published
✅ Draft/preview functionality works
✅ Media uploads work correctly
✅ API endpoints return correct data
✅ GraphQL playground is accessible (or disabled if desired)
✅ No console errors in production
✅ SSL/HTTPS is working
✅ Monitoring is active
✅ Backups are configured

---

## 📞 Support Resources

- **Payload CMS Docs**: https://payloadcms.com/docs
- **Payload Discord**: https://discord.com/invite/payload
- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Atlas**: https://cloud.mongodb.com

---

**Ready to deploy? Follow this checklist step by step! 🚀**

**Last Updated**: November 2025
