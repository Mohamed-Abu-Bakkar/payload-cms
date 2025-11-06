import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Template } from '@/payload-types'

interface TemplatePageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    preview?: string
  }>
}

async function getTemplate(slug: string, isDraft = false): Promise<Template | null> {
  try {
    const draftParam = isDraft ? '&draft=true' : ''
    const res = await fetch(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/templates?where[slug][equals]=${slug}&depth=2${draftParam}`,
      {
        next: { revalidate: isDraft ? 0 : 60 },
      }
    )

    if (!res.ok) return null

    const data = await res.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching template:', error)
    return null
  }
}

export default async function TemplatePage({ params, searchParams }: TemplatePageProps) {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === 'true'
  
  const template = await getTemplate(slug, isPreview)

  if (!template) {
    notFound()
  }

  // Get thumbnail URL
  let thumbnailUrl: string | null = null
  if (typeof template.thumbnail === 'object' && template.thumbnail?.url) {
    thumbnailUrl = template.thumbnail.url
  }

  // Ensure live demo URL has protocol
  const liveDemoUrl = template.liveDemo
    ? template.liveDemo.startsWith('http://') || template.liveDemo.startsWith('https://')
      ? template.liveDemo
      : `https://${template.liveDemo}`
    : null

  return (
    <div className="template-detail-page">
      {isPreview && (
        <div className="preview-banner">
          🔍 Preview Mode - You are viewing a draft version
        </div>
      )}

      <div className="template-hero">
        <div className="template-header">
          <h1>{template.name}</h1>
          {template.description && <p className="lead">{template.description}</p>}
          
          <div className="template-meta">
            <div className="template-price-large">
              {template.price && template.price > 0 ? (
                <>
                  <span className="currency">$</span>
                  <span className="amount">{template.price}</span>
                  <span className="period">USD</span>
                </>
              ) : (
                <span className="free-badge">Free</span>
              )}
            </div>

            <div className="template-actions-bar">
              {liveDemoUrl && (
                <a
                  href={liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View Live Demo
                </a>
              )}
              <button className="btn btn-secondary">Purchase Template</button>
            </div>
          </div>

          {template.categories && Array.isArray(template.categories) && template.categories.length > 0 && (
            <div className="template-categories-list">
              {template.categories.map((cat, idx) => {
                const category = typeof cat === 'object' ? cat : null
                return category ? (
                  <span key={idx} className="category-badge">
                    {category.title}
                  </span>
                ) : null
              })}
            </div>
          )}
        </div>

        {thumbnailUrl && (
          <div className="template-thumbnail">
            <Image
              src={thumbnailUrl}
              alt={template.name || 'Template'}
              width={800}
              height={600}
              className="main-image"
              priority
            />
          </div>
        )}
      </div>

      {template.sections && Array.isArray(template.sections) && template.sections.length > 0 && (
        <div className="template-sections">
          <h2>Template Features</h2>
          <div className="sections-grid">
            {template.sections.map((section, idx) => {
              const sectionImageUrl =
                typeof section.image === 'object' && section.image?.url ? section.image.url : null

              return (
                <div key={idx} className="section-card">
                  {sectionImageUrl && (
                    <div className="section-image">
                      <Image
                        src={sectionImageUrl}
                        alt={section.title || `Section ${idx + 1}`}
                        width={400}
                        height={300}
                        className="section-img"
                      />
                    </div>
                  )}
                  <div className="section-content">
                    <h3>{section.title}</h3>
                    {section.content && <p>{section.content}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="template-footer-cta">
        <h2>Ready to get started?</h2>
        <p>Get this template now and start building your project today.</p>
        <div className="cta-buttons">
          {liveDemoUrl && (
            <a
              href={liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Try Demo First
            </a>
          )}
          <button className="btn btn-primary">Purchase for ${template.price || 0}</button>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: TemplatePageProps) {
  const { slug } = await params
  const template = await getTemplate(slug)

  if (!template) {
    return {
      title: 'Template Not Found',
    }
  }

  return {
    title: `${template.name} - FolioMate`,
    description: template.description || `Get ${template.name} template`,
  }
}
