# EcoVet — Clínica Veterinaria Premium

Sitio web profesional y panel administrativo para una clínica veterinaria, listo para presentar como demo comercial.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Firebase Authentication, Firestore y Storage
- Framer Motion
- React Router
- React Hook Form + Zod
- Lucide Icons
- Recharts

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Panel Admin

- Acceso solo por URL: `/admin` o `/admin/login` (no hay enlace en la web pública)
- Login con Firebase Authentication
- Solo el usuario autorizado puede ingresar
- Botón **Cargar datos demo** para sembrar Firestore

## Deploy (importante para rutas como `/admin`)

Esta es una SPA. El hosting debe reescribir todas las rutas a `index.html`:

- **Vercel:** usa `vercel.json` (incluido)
- **Netlify:** usa `public/_redirects` (incluido)
- **Firebase Hosting:** usa `firebase.json` (incluido)

Sin esa regla, entrar a `/admin` directo da **404 NOT_FOUND**.

## Firebase

Configuración en `.env`. Publicá las reglas de `firestore.rules` y `storage.rules` en la consola de Firebase.

## Páginas públicas

Inicio, Nosotros, Servicios, Especialidades, Equipo, Galería, Blog, Reservas, Contacto, Preguntas frecuentes.
