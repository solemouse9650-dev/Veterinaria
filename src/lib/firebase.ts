import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  type Auth,
} from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env
    .VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

/** Si faltan vars en el build (p. ej. Vercel), el sitio público usa contenido local. */
export const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
)

export const ADMIN_UID =
  (import.meta.env.VITE_ADMIN_UID as string | undefined)?.trim() ||
  '0RWsbSfbtycAnxmaik1wdAz4SRr2'

export const ADMIN_EMAIL = 'ecovetaspotoles@gmail.com'

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

if (hasFirebaseConfig) {
  app = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  })
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  void setPersistence(auth, browserLocalPersistence)
}

export { app, auth, db, storage }

export function isAuthorizedAdmin(user: {
  uid: string
  email: string | null
} | null) {
  if (!user) return false
  const email = user.email?.toLowerCase().trim()
  return user.uid === ADMIN_UID && email === ADMIN_EMAIL.toLowerCase()
}
