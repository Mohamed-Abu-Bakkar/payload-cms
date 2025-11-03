import type { CollectionConfig } from 'payload'

export const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'price', 'updatedAt'],
    preview: (doc) => {
      if (doc?.slug) {
        return `http://localhost:3001/template/${doc.slug}?preview=true`
      }
      return null
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Template Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Unique URL-friendly identifier for this template',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              // Auto-generate slug from name if not provided
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
      admin: {
        description: 'A brief description of the template',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: false,
      label: 'Price',
      admin: {
        description: 'Template price in USD',
        step: 0.01,
      },
      defaultValue: 0,
    },
    {
      name: 'liveDemo',
      type: 'text',
      required: false,
      label: 'Live Demo URL',
      admin: {
        description: 'URL to the live demo of this template',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Thumbnail',
      admin: {
        description: 'Main thumbnail image for the template',
      },
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Template Sections',
      admin: {
        description: 'Add detailed sections to showcase template features',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Section Title',
        },
        {
          name: 'content',
          type: 'textarea',
          required: false,
          label: 'Section Content',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Section Image',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Categories',
      admin: {
        description: 'Assign one or more categories to this template',
      },
    },
  ],
}
