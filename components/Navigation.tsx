'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  userEmail?: string
}

export default function Navigation({ userEmail }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Modules', href: '/modules', icon: '📚' },
    { name: 'Resources', href: '/resources', icon: '🔗' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-dark-400 hover:text-white hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          {/* Hamburger icon */}
          <svg
            className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {/* Close icon */}
          <svg
            className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-900 rounded-lg mt-2 shadow-lg">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`${
                isActive(item.href)
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              } group flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          {/* User info and logout */}
          <div className="border-t border-dark-700 pt-3 mt-3">
            <div className="px-3 py-2">
              <p className="text-sm text-dark-400">Ingelogd als:</p>
              <p className="text-sm font-medium text-white">{userEmail}</p>
            </div>
            <Link
              href="/logout"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:bg-dark-800 hover:text-white transition-colors"
            >
              <span className="mr-3">🚪</span>
              Uitloggen
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="hidden lg:flex lg:items-center lg:space-x-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              isActive(item.href)
                ? 'bg-primary-600 text-white'
                : 'text-dark-300 hover:bg-dark-800 hover:text-white'
            } px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.name}
          </Link>
        ))}
        
        {/* Desktop user menu */}
        <div className="ml-4 flex items-center space-x-3">
          <span className="text-sm text-dark-400">{userEmail}</span>
          <Link
            href="/logout"
            className="bg-dark-800 hover:bg-dark-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Uitloggen
          </Link>
        </div>
      </div>
    </>
  )
}
