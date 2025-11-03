# FolioMate CMS

A powerful Template Provider Platform built with Payload CMS, designed for managing and selling design templates (like Prismic or Themeforest).

## Features

- 🎨 **Template Management** - Create, edit, and manage design templates with versioning and draft support
- 📁 **Category System** - Organize templates with a flexible category structure
- 🖼️ **Media Library** - Upload and manage images and assets
- 👥 **User Authentication** - Secure email/password authentication
- 🔍 **GraphQL API** - Powerful GraphQL API for frontend integration
- 📱 **Live Preview** - Preview templates before publishing
- 💾 **MongoDB** - Reliable MongoDB database backend

## Tech Stack

- **Payload CMS 3.x** - Headless CMS framework
- **Next.js 15** - React framework for server and admin UI
- **TypeScript** - Type-safe development
- **MongoDB** - Database
- **GraphQL** - API query language
- **pnpm** - Fast, efficient package manager

## Collections

### Templates
Manage design templates with:
- Name and unique slug
- Description and pricing
- Live demo URLs
- Thumbnail images
- Multi-section content areas
- Category relationships
- **Draft/Version Support** - Work on drafts before publishing
- **Preview Button** - Preview at `http://localhost:3001/template/[slug]?preview=true`

### Categories
Organize templates with:
- Title and slug
- Many-to-many relationships with templates

### Media
Standard upload collection for:
- Images
- Assets
- Alt text for accessibility

### Users
Authenticated users with:
- Email/password login
- JWT-based authentication
- Admin access control

## Getting Started

### Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- pnpm 9+ or 10+
- MongoDB (local or Docker)

### Installation

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment variables:**
   
   The `.env` file should contain:
   ```env
   # MongoDB Configuration
   DATABASE_URI=mongodb://mongo:27017/payload
   
   # Payload CMS Configuration
   PAYLOAD_SECRET=your-secret-key-here
   PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
   
   # Next.js Frontend URL (for preview)
   NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
   ```

3. **Start MongoDB (if using Docker):**
   ```bash
   docker-compose up -d
   ```

4. **Generate TypeScript types:**
   ```bash
   pnpm generate:types
   ```

5. **Start the development server:**
   ```bash
   pnpm dev
   ```

6. **Access the admin panel:**
   Open [http://localhost:3000/admin](http://localhost:3000/admin)

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm generate:types` - Generate TypeScript types from collections
- `pnpm generate:importmap` - Generate import map
- `pnpm lint` - Run ESLint
- `pnpm test` - Run all tests
- `pnpm test:int` - Run integration tests
- `pnpm test:e2e` - Run end-to-end tests

### Project Structure

```
cms/
├── src/
│   ├── collections/          # Collection definitions
│   │   ├── Users.ts          # User authentication
│   │   ├── Media.ts          # Media uploads
│   │   ├── Templates.ts      # Template management
│   │   └── Categories.ts     # Category organization
│   ├── app/                  # Next.js app directory
│   │   ├── (frontend)/       # Frontend routes
│   │   └── (payload)/        # Payload admin routes
│   ├── payload.config.ts     # Main Payload configuration
│   └── payload-types.ts      # Generated TypeScript types
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## API Endpoints

### REST API
- Base URL: `http://localhost:3000/api`
- Collections:
  - `/api/templates` - Templates CRUD
  - `/api/categories` - Categories CRUD
  - `/api/media` - Media uploads
  - `/api/users` - User management

### GraphQL API
- Endpoint: `http://localhost:3000/api/graphql`
- Playground: `http://localhost:3000/api/graphql-playground`

Example GraphQL query:
```graphql
query {
  Templates {
    docs {
      id
      name
      slug
      description
      price
      liveDemo
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

## Preview Integration

Templates support draft previews. The admin panel includes a preview button that links to:
```
http://localhost:3001/template/[slug]?preview=true
```

Your Next.js frontend should:
1. Check for `?preview=true` query parameter
2. Fetch draft version from Payload API
3. Render the preview with appropriate indicators

Example Next.js preview implementation:
```typescript
// app/template/[slug]/page.tsx
export default async function TemplatePage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }
  searchParams: { preview?: string }
}) {
  const isPreview = searchParams.preview === 'true'
  
  const res = await fetch(
    `http://localhost:3000/api/templates?where[slug][equals]=${params.slug}${
      isPreview ? '&draft=true' : ''
    }`
  )
  
  // Render template...
}
```

## Database

### MongoDB Connection

The CMS connects to MongoDB using the `DATABASE_URI` environment variable. 

Default: `mongodb://mongo:27017/payload`

For production, use a secure MongoDB connection string:
```env
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/foliomate?retryWrites=true&w=majority
```

## Security

- **PAYLOAD_SECRET**: Change this to a secure random string in production
- **Authentication**: JWT-based with configurable expiration (default: 2 hours)
- **Access Control**: Collections have read-only public access by default; write operations require authentication

## Production Deployment

1. **Build the application:**
   ```bash
   pnpm build
   ```

2. **Set production environment variables:**
   - Update `PAYLOAD_SECRET` to a secure value
   - Update `DATABASE_URI` to production MongoDB
   - Update `PAYLOAD_PUBLIC_SERVER_URL` to production domain

3. **Start the server:**
   ```bash
   pnpm start
   ```

## Customization

### Adding Custom Fields

Edit collection files in `src/collections/` to add new fields:

```typescript
// src/collections/Templates.ts
fields: [
  // ... existing fields
  {
    name: 'featured',
    type: 'checkbox',
    label: 'Featured Template',
    defaultValue: false,
  },
]
```

### Modifying Preview URL

Edit the preview function in `Templates.ts`:

```typescript
preview: (doc) => {
  return `https://your-frontend.com/template/${doc.slug}?preview=true`
},
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

## License

MIT License - feel free to use this for your own projects!

## Support

For issues and questions:
- Check the [Payload CMS Documentation](https://payloadcms.com/docs)
- Review the collection configurations in `src/collections/`
- Ensure MongoDB is running and accessible

---

**FolioMate CMS** - Built with ❤️ using Payload CMS
