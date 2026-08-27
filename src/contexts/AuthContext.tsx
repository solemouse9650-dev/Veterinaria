import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  type User,
} from 'firebase/auth'
import { ADMIN_EMAIL, auth, isAuthorizedAdmin } from '@/lib/firebase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const LOGIN_ATTEMPTS_KEY = 'ecovet_admin_login_attempts'
const MAX_ATTEMPTS = 5
const LOCK_MS = 5 * 60 * 1000

function mapAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error && 'code' in error
      ? String((error as { code: string }).code)
      : ''

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-login-credentials':
      return 'Correo o contraseña incorrectos.'
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Probá más tarde o recuperá la contraseña.'
    case 'auth/network-request-failed':
      return 'Error de red. Verificá tu conexión e intentá de nuevo.'
    case 'auth/user-disabled':
      return 'Esta cuenta está deshabilitada.'
    case 'auth/invalid-email':
      return 'El correo no es válido.'
    case 'auth/weak-password':
      return 'La nueva contraseña es demasiado débil. Usá al menos 8 caracteres.'
    case 'auth/requires-recent-login':
      return 'Por seguridad, volvé a iniciar sesión e intentá de nuevo.'
    default:
      if (
        error instanceof Error &&
        (error.message === 'Correo o contraseña incorrectos.' ||
          error.message === 'Sesión no válida.' ||
          error.message.startsWith('Demasiados intentos'))
      ) {
        return error.message
      }
      return 'No se pudo completar la operación. Intentá nuevamente.'
  }
}

function getLoginLock(): { locked: boolean; remainingMs: number } {
  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY)
    if (!raw) return { locked: false, remainingMs: 0 }
    const data = JSON.parse(raw) as { count: number; ts: number }
    if (data.count >= MAX_ATTEMPTS) {
      const remaining = LOCK_MS - (Date.now() - data.ts)
      if (remaining > 0) return { locked: true, remainingMs: remaining }
      sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY)
    }
  } catch {
    sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY)
  }
  return { locked: false, remainingMs: 0 }
}

function registerFailedLogin() {
  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY)
    const prev = raw ? (JSON.parse(raw) as { count: number; ts: number }) : null
    const count = (prev?.count || 0) + 1
    sessionStorage.setItem(
      LOGIN_ATTEMPTS_KEY,
      JSON.stringify({ count, ts: Date.now() }),
    )
  } catch {
    // ignore storage errors
  }
}

function clearLoginAttempts() {
  sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const firebaseAuth = auth
    const unsub = onAuthStateChanged(firebaseAuth, (next) => {
      if (next && !isAuthorizedAdmin(next)) {
        void signOut(firebaseAuth)
        setUser(null)
        setLoading(false)
        return
      }
      setUser(next)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!auth) {
      throw new Error('El panel no está disponible en este momento.')
    }
    const firebaseAuth = auth
    const lock = getLoginLock()
    if (lock.locked) {
      const mins = Math.ceil(lock.remainingMs / 60000)
      throw new Error(
        `Demasiados intentos fallidos. Esperá ${mins} minuto(s) e intentá de nuevo.`,
      )
    }

    try {
      const cred = await signInWithEmailAndPassword(
        firebaseAuth,
        email.trim().toLowerCase(),
        password,
      )
      if (!isAuthorizedAdmin(cred.user)) {
        await signOut(firebaseAuth)
        registerFailedLogin()
        throw new Error('Correo o contraseña incorrectos.')
      }
      clearLoginAttempts()
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.includes('Demasiados intentos')
      ) {
        registerFailedLogin()
      }
      throw new Error(mapAuthError(error))
    }
  }, [])

  const logout = useCallback(() => (auth ? signOut(auth) : Promise.resolve()), [])

  const resetPassword = useCallback(async (email: string) => {
    const normalized = email.trim().toLowerCase()
    if (normalized !== ADMIN_EMAIL.toLowerCase()) {
      return
    }
    if (!auth) return
    await sendPasswordResetEmail(auth, normalized)
  }, [])

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const current = auth?.currentUser
      if (!current?.email || !isAuthorizedAdmin(current)) {
        throw new Error('Sesión no válida.')
      }
      try {
        const credential = EmailAuthProvider.credential(
          current.email,
          currentPassword,
        )
        await reauthenticateWithCredential(current, credential)
        await updatePassword(current, newPassword)
      } catch (error) {
        throw new Error(mapAuthError(error))
      }
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: isAuthorizedAdmin(user),
      login,
      logout,
      resetPassword,
      changePassword,
    }),
    [user, loading, login, logout, resetPassword, changePassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
