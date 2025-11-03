import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
  },
  auth: {
    tokenExpiration: 7200, // 2 hours
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
    // Email and password added by default via auth: true
  ],
}
