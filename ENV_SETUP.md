# Environment Variables Setup for Vercel

## MongoDB Atlas Connection String

Your MongoDB Atlas connection string:
```
mongodb+srv://mohamedabu:uchiha_itachi@project.4tix1vg.mongodb.net/?retryWrites=true&w=majority&appName=project
```

### ⚠️ Important: Add Database Name

You need to add a database name before the `?`. Update it to:

```
mongodb+srv://mohamedabu:uchiha_itachi@project.4tix1vg.mongodb.net/foliomate?retryWrites=true&w=majority&appName=project
```

Or use:
```
mongodb+srv://mohamedabu:uchiha_itachi@project.4tix1vg.mongodb.net/payload?retryWrites=true&w=majority&appName=project
```

**Note**: The database name (`foliomate` or `payload`) will be created automatically if it doesn't exist.

---

## Vercel Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

### 1. DATABASE_URI
```
mongodb+srv://mohamedabu:uchiha_itachi@project.4tix1vg.mongodb.net/foliomate?retryWrites=true&w=majority&appName=project
```

### 2. PAYLOAD_SECRET
Generate a secure secret:
```bash
openssl rand -base64 32
```

Example output:
```
aBc123XyZ789Def456Ghi012Jkl345Mno678Pqr901Stu234Vwx567
```

### 3. PAYLOAD_PUBLIC_SERVER_URL
After your first deployment, Vercel will give you a URL like:
```
https://your-project-name.vercel.app
```

Set this to:
```
https://your-project-name.vercel.app
```

### 4. NEXT_PUBLIC_FRONTEND_URL
Set this to the same as above (or your custom domain):
```
https://your-project-name.vercel.app
```

---

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit your connection string or secrets to Git
- The connection string above contains your username and password
- Keep these credentials secure
- Consider rotating passwords regularly

---

## Quick Setup Checklist

1. ✅ MongoDB Atlas cluster created
2. ✅ Database user created (`mohamedabu`)
3. ✅ Network access configured (allow 0.0.0.0/0)
4. ⏳ Add database name to connection string
5. ⏳ Generate `PAYLOAD_SECRET`
6. ⏳ Deploy to Vercel
7. ⏳ Set environment variables in Vercel
8. ⏳ Update `PAYLOAD_PUBLIC_SERVER_URL` after first deploy

---

## After Deployment

1. Your site will be available at: `https://your-project.vercel.app`
2. Admin panel: `https://your-project.vercel.app/admin`
3. API: `https://your-project.vercel.app/api/templates`
4. GraphQL: `https://your-project.vercel.app/api/graphql-playground`

---

## Create Admin User

After deployment, create your first admin user:

```bash
# Install Payload CLI
pnpm add -g payload

# Create user
payload create:user
```

When prompted, enter your MongoDB connection string:
```
mongodb+srv://mohamedabu:uchiha_itachi@project.4tix1vg.mongodb.net/foliomate?retryWrites=true&w=majority&appName=project
```

Then enter:
- Email: your-email@example.com
- Password: (choose a strong password)
- Name: Your Name

---

## Troubleshooting

### Connection Issues
- Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
- Check username and password are correct
- Ensure database name is in the connection string

### Build Errors
- Check all environment variables are set
- Verify `PAYLOAD_SECRET` is set (32+ characters)
- Ensure `DATABASE_URI` includes database name

---

Good luck with your deployment! 🚀


