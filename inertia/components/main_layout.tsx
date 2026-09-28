import { type ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
  narrow?: boolean
  className?: string
}

/**
 * Consistent layout container used across all pages.
 *
 * @param narrow - If true, use max-w-2xl for forms/auth pages. Default: false (uses max-w-screen-xl)
 * @param className - Additional CSS classes to apply
 */
export function MainLayout({ children, narrow = false, className = '' }: MainLayoutProps) {
  const containerClass = narrow
    ? 'mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-8'
    : 'mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-8'

  return <div className={`${containerClass} ${className}`}>{children}</div>
}

export default MainLayout
