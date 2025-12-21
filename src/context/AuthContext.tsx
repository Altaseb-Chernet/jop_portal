import { createContext, useContext, useMemo, useState } from 'react'
import type { AuthResponse, User } from '../types/auth'
import { clearAuthStorage, getToken, getUser, setToken, setUser } from '../lib/storage'

type AuthState = {
  token: string | null
  user: User | null
}

type AuthContextValue = AuthState & {
  isAuthenticated: boolean
  signIn: (auth: AuthResponse) => void
  signOut: () => void
  setUserState: (user: User) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokenState, setTokenState] = useState<string | null>(() => getToken())
  const [userState, setUserStateInternal] = useState<User | null>(() => getUser<User>())

  const value = useMemo<AuthContextValue>(() => {
    return {
      token: tokenState,
      user: userState,
      isAuthenticated: Boolean(tokenState && userState),
      signIn: (auth) => {
        setToken(auth.token)
        setUser(auth.user)
        setTokenState(auth.token)
        setUserStateInternal(auth.user)
      },
      signOut: () => {
        clearAuthStorage()
        setTokenState(null)
        setUserStateInternal(null)
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.assign('/login')
        }
      },
      setUserState: (user) => {
        setUser(user)
        setUserStateInternal(user)
      },
    }
  }, [tokenState, userState])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
