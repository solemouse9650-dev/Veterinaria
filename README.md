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

- Ruta: `/admin`
- Login con Firebase Authentication
- Solo el UID autorizado puede ingresar
- Botón **Cargar datos demo** para sembrar Firestore

## Firebase

Configuración en `.env`. Publicá las reglas de `firestore.rules` y `storage.rules` en la consola de Firebase.

## Páginas públicas

Inicio, Nosotros, Servicios, Especialidades, Equipo, Galería, Blog, Reservas, Contacto, Preguntas frecuentes.
