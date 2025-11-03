# FolioMate CMS - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Ensure MongoDB is Running

If using Docker (recommended):
```bash
docker-compose up -d
```

Check that MongoDB is running:
```bash
docker ps
```

### 2. Install Dependencies (if not already done)

```bash
pnpm install
```

### 3. Generate TypeScript Types

```bash
pnpm generate:types
```

### 4. Start the Development Server

```bash
pnpm dev
```

### 5. Create Your First Admin User

1. Open [http://localhost:3000/admin](http://localhost:3000/admin)
2. You'll see a "Create First User" screen
3. Fill in:
   - **Email**: your-email@example.com
   - **Password**: Choose a secure password (min 8 characters)
   - **Name**: Your Name
4. Click "Create"

### 6. Start Creating Content

#### Create Categories First:
1. Go to **Collections** → **Categories**
2. Click **Create New**
3. Add a category (e.g., "Landing Pages", "E-commerce", "Portfolio")
4. The slug will auto-generate from the title

#### Upload Media:
1. Go to **Collections** → **Media**
2. Click **Create New**
3. Upload an image for a template thumbnail
4. Add alt text for accessibility

#### Create Your First Template:
1. Go to **Collections** → **Templates**
2. Click **Create New**
3. Fill in:
   - **Name**: "Modern Landing Page"
   - **Slug**: auto-generates (or customize)
   - **Description**: "A clean, modern landing page template"
   - **Price**: 49.99
   - **Live Demo**: "https://demo.example.com"
   - **Thumbnail**: Select uploaded image
   - **Categories**: Select one or more categories
4. Add sections to showcase features
5. Click **Save as Draft** or **Publish**

### 7. Test the Preview Feature

1. While editing a template, click the **Preview** button (eye icon)
2. It will open: `http://localhost:3001/template/[slug]?preview=true`
3. Note: Your Next.js frontend at port 3001 needs to handle this URL

### 8. Explore the APIs

#### REST API:
- Templates: [http://localhost:3000/api/templates](http://localhost:3000/api/templates)
- Categories: [http://localhost:3000/api/categories](http://localhost:3000/api/categories)
- Media: [http://localhost:3000/api/media](http://localhost:3000/api/media)

#### GraphQL:
- Playground: [http://localhost:3000/api/graphql-playground](http://localhost:3000/api/graphql-playground)

Try this query:
```graphql
query {
  Templates {
    docs {
      id
      name
      slug
      price
      description
      thumbnail {
        url
        alt
      }
      categories {
        title
        slug
      }
    }
  }
}
```

## 🎯 Next Steps

### Connect to Your Frontend

Example fetch in Next.js:
```typescript
// Fetch all published templates
const response = await fetch('http://localhost:3000/api/templates')
const data = await response.json()

// Fetch a specific template by slug
const template = await fetch(
  'http://localhost:3000/api/templates?where[slug][equals]=modern-landing-page'
)

// Fetch draft version (for preview)
const draft = await fetch(
  'http://localhost:3000/api/templates?where[slug][equals]=modern-landing-page&draft=true'
)
```

### Environment Variables for Production

Before deploying, update `.env`:
```env
# Use a strong secret (generate with: openssl rand -base64 32)
PAYLOAD_SECRET=your-production-secret-here

# Production MongoDB connection
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/foliomate?retryWrites=true&w=majority

# Production URLs
PAYLOAD_PUBLIC_SERVER_URL=https://cms.yourdomain.com
NEXT_PUBLIC_FRONTEND_URL=https://yourdomain.com
```

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm generate:types` | Regenerate TypeScript types |
| `pnpm lint` | Check code quality |

## 🐛 Troubleshooting

### Can't connect to MongoDB?
- Check Docker: `docker ps`
- Restart: `docker-compose restart`
- Check `.env` has correct `DATABASE_URI`

### TypeScript errors?
- Regenerate types: `pnpm generate:types`
- Restart dev server: Stop and run `pnpm dev` again

### Admin panel not loading?
- Check console for errors
- Ensure port 3000 is not in use: `lsof -i :3000`
- Try: `pnpm devsafe` (clears Next.js cache)

## 📚 Learn More

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GraphQL Documentation](https://graphql.org/learn/)

---

**Need Help?** Check the main [README.md](./README.md) for detailed documentation.
