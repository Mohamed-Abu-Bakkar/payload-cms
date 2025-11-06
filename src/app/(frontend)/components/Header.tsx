'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="header-nav"
      >
        <div className="header-content">
          <Link href="/" className="logo">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="logo-text"
            >
              Folio Mate
            </motion.span>
          </Link>

          <div className="header-actions">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/admin/login" className="login-button">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="login-icon"
                >
                  <path d="M15 3h4a2 2 2 0 0 1 2 2v14a2 2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>Login(Admin)</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>
    </header>
  )
}

