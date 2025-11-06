'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Template } from '@/payload-types'

interface TemplateCardProps {
  template: Template
  index: number
}

export default function TemplateCard({ template, index }: TemplateCardProps) {
  let thumbnail: string | null = null

  if (typeof template.thumbnail === 'object' && template.thumbnail?.url) {
    const url = template.thumbnail.url
    // Payload typically provides full URLs, but handle relative paths too
    if (url.startsWith('http')) {
      thumbnail = url
    } else if (url.startsWith('/')) {
      // In production, Payload should provide full URLs, but handle relative paths
      // Use window.location.origin in client component, or rely on Payload's serverURL
      thumbnail = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url
    } else {
      thumbnail = url
    }
  }

  // Ensure liveDemo URL has protocol
  const liveDemoUrl = template.liveDemo
    ? template.liveDemo.startsWith('http://') || template.liveDemo.startsWith('https://')
      ? template.liveDemo
      : `https://${template.liveDemo}`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="template-card"
    >
      <Link href={`/template/${template.slug}`} className="template-link">
        <div className="template-image-wrapper">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={template.name || 'Template'}
              fill
              className="template-image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="template-placeholder">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6v6H9z" />
              </svg>
            </div>
          )}
          <div className="template-overlay">
            <motion.div
              initial={{ opacity: 0.9 }}
              whileHover={{ opacity: 1 }}
              className="template-actions"
            >
              {liveDemoUrl && (
                <a
                  href={liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="demo-button"
                  title="View live demo"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="demo-icon"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Live Demo
                </a>
              )}
            </motion.div>
          </div>
        </div>
        <div className="template-info">
          <h3 className="template-name">{template.name}</h3>
          {template.description && <p className="template-description">{template.description}</p>}
          <div className="template-footer">
            <div className="template-price">
              {template.price && template.price > 0 ? (
                <>
                  <span className="price-amount">${template.price}</span>
                  <span className="price-label">USD</span>
                </>
              ) : (
                <span className="price-free">Free</span>
              )}
            </div>
            {template.categories &&
              Array.isArray(template.categories) &&
              template.categories.length > 0 && (
                <div className="template-categories">
                  {template.categories
                    .slice(0, 2)
                    .map((cat, idx) => {
                      const category = typeof cat === 'object' ? cat : null
                      return category ? (
                        <span key={idx} className="category-tag">
                          {category.title}
                        </span>
                      ) : null
                    })
                    .filter(Boolean)}
                </div>
              )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
