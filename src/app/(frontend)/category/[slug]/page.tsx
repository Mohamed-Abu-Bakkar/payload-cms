import { notFound } from 'next/navigation'
import TemplateCard from '../../components/TemplateCard'
import type { Category, Template } from '@/payload-types'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/categories?where[slug][equals]=${slug}&depth=2`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return null

    const data = await res.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function getTemplatesByCategory(categoryId: string): Promise<Template[]> {
  try {
    const res = await fetch(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/templates?where[categories][in]=${categoryId}&depth=2`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return []

    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching templates:', error)
    return []
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const templates = await getTemplatesByCategory(category.id)

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{category.title}</h1>
        <p className="template-count">
          {templates.length} {templates.length === 1 ? 'template' : 'templates'}
        </p>
      </div>

      {templates.length > 0 ? (
        <div className="templates-grid">
          {templates.map((template, index) => (
            <TemplateCard key={template.id} template={template} index={index} />
          ))}
        </div>
      ) : (
        <div className="no-templates">
          <p>No templates found in this category yet.</p>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.title} Templates - FolioMate`,
    description: `Browse ${category.title} templates on FolioMate`,
  }
}
