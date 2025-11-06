import React from 'react'
import './styles.css'
import Header from './components/Header'

export const metadata = {
  description: 'Discover beautifully crafted templates designed to help you build stunning websites faster.',
  title: 'FolioMate',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
