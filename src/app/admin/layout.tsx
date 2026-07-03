import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { AdminUserProvider } from '@/hooks/useAdminUser'

export const metadata: Metadata = {
  title: {
    default:  'Panel Admin | Beauty Ballons',
    template: '%s | Admin Beauty Ballons',
  },
  robots: { index: false, follow: false },
}

export default function AdminLayoutWrapper({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AdminUserProvider>
      <div
        className="min-h-screen"
        style={{ backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {children}
      </div>
    </AdminUserProvider>
  )
}
