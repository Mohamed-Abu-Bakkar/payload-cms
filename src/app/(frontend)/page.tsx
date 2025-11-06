import { getPayload } from 'payload'
import config from '@/payload.config'
import Hero from './components/Hero'
import TemplateGrid from './components/TemplateGrid'
import type { Template, Category } from '@/payload-types'

export const metadata = {
  title: 'Folio Mate',
  description: 'Discover beautifully crafted templates designed to help you build stunning websites faster.',
}

async function getTemplates() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'templates',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 100,
    depth: 2,
  })
  return result.docs as Template[]
}

async function getCategories() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'categories',
    limit: 100,
    depth: 1,
  })
  return result.docs as Category[]
}

export default async function HomePage() {
  const [templates, categories] = await Promise.all([
    getTemplates(),
    getCategories(),
  ])

  return (
    <div className="homepage">
      <Hero />
      <TemplateGrid templates={templates} categories={categories} />
    </div>
  )
}
