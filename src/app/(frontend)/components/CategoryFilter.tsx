'use client'

import { motion } from 'framer-motion'
import type { Category } from '@/payload-types'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (slug: string | null) => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectCategory(null)}
        className={`filter-button ${selectedCategory === null ? 'active' : ''}`}
      >
        All Templates
      </motion.button>
      {categories.map((category, index) => {
        const categorySlug = typeof category === 'object' ? category.slug : category
        const categoryTitle = typeof category === 'object' ? category.title : category
        
        return (
          <motion.button
            key={categorySlug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(categorySlug)}
            className={`filter-button ${
              selectedCategory === categorySlug ? 'active' : ''
            }`}
          >
            {categoryTitle}
          </motion.button>
        )
      })}
    </div>
  )
}


