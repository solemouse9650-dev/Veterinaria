import { initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyBfRigZEOBm5A15FEm4WGQAgL4jns2U4lk',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'veterinaria-c42fd.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || 'veterinaria-c42fd',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'veterinaria-c42fd.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '222646129381',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:222646129381:web:a519417898fb0ac1957a0c',
}

/** UID y email autorizados (fallback si falla el .env) */
export const ADMIN_UID =
  (import.meta.env.VITE_ADMIN_UID as string | undefined)?.trim() ||
  '4uP29AKNr9evZLbL1HrsOHGdrQH2'

export const ADMIN_EMAIL = 'solemouse9650@gmail.com'

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

void setPersistence(auth, browserLocalPersistence)

export function isAuthorizedAdmin(user: {
  uid: string
  email: string | null
} | null) {
  if (!user) return false
  const email = user.email?.toLowerCase().trim()
  return (
    user.uid === ADMIN_UID ||
    email === ADMIN_EMAIL.toLowerCase()
  )
}
