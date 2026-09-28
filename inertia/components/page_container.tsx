import type { ReactNode } from 'react'
import { SiteHeader } from './site_header'

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
