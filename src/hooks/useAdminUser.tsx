'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import type { AdminRole } from '@/lib/auth'

interface AdminUserContext {
  id:      string
  email:   string
  role:    AdminRole
}

interface AdminSessionState {
  user:    AdminUserContext | null
  loading: boolean
}

const AdminUserCtx = createContext<AdminSessionState>({
  user:    null,
  loading: true,
})

export function AdminUserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminSessionState>({ user: null, loading: true })

  useEffect(() => {
    const supabase = createClient()

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setState({ user: null, loading: false })
        return
      }

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('id', user.id)
        .single()

      if (!adminData) {
        setState({ user: null, loading: false })
        return
      }

      setState({
        user: {
          id:    user.id,
          email: user.email ?? '',
          role:  adminData.role as AdminRole,
        },
        loading: false,
      })
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AdminUserCtx.Provider value={state}>
      {children}
    </AdminUserCtx.Provider>
  )
}

export function useAdminUser() {
  return useContext(AdminUserCtx)
}

export function useIsOwner() {
  const { user } = useAdminUser()
  return user?.role === 'owner'
}
