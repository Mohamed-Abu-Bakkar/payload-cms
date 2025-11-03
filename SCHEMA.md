# FolioMate CMS - Collection Schema

## Database Schema & Relationships

### Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      FolioMate CMS                          │
│                   Collection Architecture                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│     Templates    │◄───────►│   Categories     │
│                  │  Many    │                  │
│  - id            │   to     │  - id            │
│  - name          │  Many    │  - title         │
│  - slug (unique) │         │  - slug (unique) │
│  - description   │         │  - templates[]   │
│  - price         │         └──────────────────┘
│  - liveDemo      │
│  - thumbnail     │──┐
│  - sections[]    │  │
│  - categories[]  │  │      ┌──────────────────┐
│  - _status       │  └─────►│      Media       │
│  - _version      │         │                  │
└──────────────────┘         │  - id            │
                              │  - filename      │
┌──────────────────┐         │  - url           │
│      Users       │         │  - alt           │
│                  │         │  - mimeType      │
│  - id            │         │  - filesize      │
│  - name          │         └──────────────────┘
│  - email         │                ▲
│  - password      │                │
│  - roles         │         Used by Templates:
└──────────────────┘         - thumbnail
                              - section images
```

---

## Collection Details

### 1. Templates Collection

**Purpose**: Store and manage design templates for sale

**Fields**:
```typescript
{
  id: string
  name: string (required)
  slug: string (required, unique, auto-generated)
  description: string (textarea)
  price: number (default: 0)
  liveDemo: string (URL)
  thumbnail: Media (relationship)
  sections: Array<{
    title: string (required)
    content: string (textarea)
    image: Media (relationship)
  }>
  categories: Category[] (many-to-many)
  _status: 'draft' | 'published' (version control)
  _version: object (draft tracking)
  createdAt: Date
  updatedAt: Date
}
```

**Features**:
- ✅ Version control with drafts
- ✅ Admin preview button
- ✅ Auto-slug generation from name
- ✅ Public read access
- ✅ Many-to-many category relationships

**API Endpoints**:
- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get specific template
- `POST /api/templates` - Create template (auth required)
- `PATCH /api/templates/:id` - Update template (auth required)
- `DELETE /api/templates/:id` - Delete template (auth required)

---

### 2. Categories Collection

**Purpose**: Organize templates into categories (e.g., Landing Pages, E-commerce)

**Fields**:
```typescript
{
  id: string
  title: string (required)
  slug: string (required, unique, auto-generated)
  templates: Template[] (many-to-many)
  createdAt: Date
  updatedAt: Date
}
```

**Features**:
- ✅ Auto-slug generation from title
- ✅ Bidirectional relationship with Templates
- ✅ Public read access

**API Endpoints**:
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get specific category
- `POST /api/categories` - Create category (auth required)
- `PATCH /api/categories/:id` - Update category (auth required)
- `DELETE /api/categories/:id` - Delete category (auth required)

---

### 3. Media Collection

**Purpose**: Store and manage uploaded images and assets

**Fields**:
```typescript
{
  id: string
  filename: string
  alt: string (required)
  url: string
  mimeType: string
  filesize: number
  width: number
  height: number
  focalX: number
  focalY: number
  createdAt: Date
  updatedAt: Date
}
```

**Features**:
- ✅ File upload support
- ✅ Alt text for accessibility
- ✅ Automatic dimension extraction
- ✅ Public read access

**API Endpoints**:
- `GET /api/media` - List all media
- `GET /api/media/:id` - Get specific media
- `POST /api/media` - Upload media (auth required)
- `DELETE /api/media/:id` - Delete media (auth required)

---

### 4. Users Collection

**Purpose**: Authentication and admin access management

**Fields**:
```typescript
{
  id: string
  name: string
  email: string (required, unique)
  password: string (hashed, required)
  roles: string[]
  loginAttempts: number
  lockUntil: Date
  createdAt: Date
  updatedAt: Date
}
```

**Features**:
- ✅ Email/password authentication
- ✅ JWT token generation (2-hour expiry)
- ✅ Password hashing
- ✅ Admin panel access
- ✅ Rate limiting on login

**API Endpoints**:
- `POST /api/users/login` - Login
- `POST /api/users/logout` - Logout
- `GET /api/users/me` - Get current user
- `POST /api/users` - Create user (first user, then auth required)
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password

---

## Relationships Explained

### Templates ↔ Categories (Many-to-Many)

```typescript
// A template can belong to multiple categories
Template {
  categories: ['landing-pages', 'portfolio']
}

// A category can contain multiple templates
Category {
  templates: ['modern-landing', 'minimal-portfolio', 'business-template']
}
```

**How it works**:
1. When creating a template, select one or more categories
2. The relationship is stored bidirectionally
3. Both collections can query the other
4. Deleting a category doesn't delete templates (relationship is removed)

### Templates → Media (One-to-Many)

```typescript
Template {
  thumbnail: 'media-id-123',
  sections: [
    {
      title: 'Hero Section',
      image: 'media-id-456'
    },
    {
      title: 'Features',
      image: 'media-id-789'
    }
  ]
}
```

**How it works**:
1. Upload images to Media collection
2. Reference media by ID in template fields
3. API automatically populates media details
4. Deleting media doesn't break templates (becomes null reference)

---

## Access Control

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| Templates  | ✅ Public | 🔒 Auth | 🔒 Auth | 🔒 Auth |
| Categories | ✅ Public | 🔒 Auth | 🔒 Auth | 🔒 Auth |
| Media      | ✅ Public | 🔒 Auth | 🔒 Auth | 🔒 Auth |
| Users      | 🔒 Auth | 🔒 Auth* | 🔒 Auth | 🔒 Auth |

*First user can be created without authentication

---

## GraphQL Schema

### Query Templates with Categories and Media

```graphql
query GetTemplates {
  Templates(
    where: { _status: { equals: published } }
    limit: 10
    sort: "-createdAt"
  ) {
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
        width
        height
      }
      categories {
        id
        title
        slug
      }
      sections {
        title
        content
        image {
          url
          alt
        }
      }
      createdAt
      updatedAt
    }
    totalDocs
    limit
    page
    hasNextPage
    hasPrevPage
  }
}
```

### Query Categories with Templates

```graphql
query GetCategories {
  Categories {
    docs {
      id
      title
      slug
      templates {
        id
        name
        slug
        price
        thumbnail {
          url
          alt
        }
      }
    }
  }
}
```

### Create Template Mutation

```graphql
mutation CreateTemplate {
  createTemplate(
    data: {
      name: "Modern Landing Page"
      slug: "modern-landing-page"
      description: "A beautiful modern landing page template"
      price: 49.99
      liveDemo: "https://demo.example.com"
      categories: ["category-id-1", "category-id-2"]
      _status: draft
    }
  ) {
    id
    name
    slug
  }
}
```

---

## Database Indexes

Payload automatically creates indexes for:

- ✅ `users.email` (unique)
- ✅ `templates.slug` (unique)
- ✅ `categories.slug` (unique)
- ✅ `templates._status` (for filtering published/draft)
- ✅ All relationship fields (for efficient joins)

---

## Version Control & Drafts

Templates support version control:

```typescript
// Save as draft
POST /api/templates
{
  _status: "draft",
  name: "My Template"
}

// Publish template
PATCH /api/templates/:id
{
  _status: "published"
}

// Get draft version (for preview)
GET /api/templates?where[slug][equals]=my-template&draft=true

// Get published version only
GET /api/templates?where[slug][equals]=my-template
```

---

## Best Practices

### 1. Always Use Slugs for URLs
```typescript
// ✅ Good - SEO-friendly
/template/modern-landing-page

// ❌ Avoid - Not user-friendly
/template/65f8a1b2c3d4e5f6a7b8c9d0
```

### 2. Validate Media Before Deleting
```typescript
// Check if media is in use before deleting
const templatesUsingMedia = await payload.find({
  collection: 'templates',
  where: {
    or: [
      { thumbnail: { equals: mediaId } },
      { 'sections.image': { equals: mediaId } }
    ]
  }
})
```

### 3. Use Draft Mode for Reviews
```typescript
// Create as draft first
template._status = 'draft'

// Review in preview mode
// http://localhost:3001/template/slug?preview=true

// Publish when ready
template._status = 'published'
```

---

## Data Flow Example

### Creating a Complete Template

```typescript
// 1. Upload thumbnail
POST /api/media
FormData: { file: thumbnail.jpg, alt: "Template thumbnail" }
Response: { id: "media-123", url: "..." }

// 2. Create/select categories
POST /api/categories
{ title: "Landing Pages" }
Response: { id: "cat-456", slug: "landing-pages" }

// 3. Create template with relationships
POST /api/templates
{
  name: "Modern Landing",
  description: "A modern landing page",
  price: 49.99,
  thumbnail: "media-123",
  categories: ["cat-456"],
  sections: [
    {
      title: "Hero",
      content: "Beautiful hero section",
      image: "media-789"
    }
  ],
  _status: "draft"
}

// 4. Preview draft
GET http://localhost:3001/template/modern-landing?preview=true

// 5. Publish
PATCH /api/templates/template-id
{ _status: "published" }
```

---

## Summary

✅ **4 Collections** working together seamlessly
✅ **Flexible relationships** for complex data structures  
✅ **Version control** for content workflow
✅ **Type-safe** with auto-generated TypeScript types
✅ **GraphQL + REST** APIs for frontend integration
✅ **Public read access** for frontend display
✅ **Secure auth** for admin operations

**Ready to build your template marketplace!** 🚀
