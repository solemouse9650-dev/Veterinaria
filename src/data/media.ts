import type { GalleryItem } from '@/types'

const patientStillIds = [
  0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
] as const

function patientSrc(id: number) {
  return id === 0
    ? '/fotovet/pacientes/fotovet.jpeg'
    : `/fotovet/pacientes/fotovet-${id}.jpeg`
}

export const TEAM_PHOTOS = {
  claudia: '/fotovet/equipo/claudia-koziuk.jpeg',
  martin: '/fotovet/equipo/martin-zuchino.jpeg',
  alejandro: '/fotovet/equipo/alejandro-gimenez.jpeg',
} as const

export const CLINIC_PHOTOS = [
  {
    src: '/fotovet/instalaciones/vetefoto-1.jpeg',
    alt: 'Vidriera de EcoVet Clínica Veterinaria con servicios y branding',
  },
  {
    src: '/fotovet/instalaciones/vetefoto-2.jpeg',
    alt: 'Entrada principal de EcoVet Clínica Veterinaria en Apóstoles',
  },
  {
    src: '/fotovet/instalaciones/vetefoto-3.jpeg',
    alt: 'Espacio interior de EcoVet Clínica Veterinaria',
  },
  {
    src: '/fotovet/instalaciones/vetefoto-4.jpeg',
    alt: 'Instalaciones de EcoVet Clínica Veterinaria',
  },
  {
    src: '/fotovet/instalaciones/vetefoto-5.jpeg',
    alt: 'Área de cirugía y equipamiento de EcoVet Clínica Veterinaria',
  },
  {
    src: '/fotovet/instalaciones/vetefoto-6.jpeg',
    alt: 'Espacio de atención de EcoVet Clínica Veterinaria',
  },
  {
    src: '/fotovet/instalaciones/vetefoto-7.jpeg',
    alt: 'Instalaciones de EcoVet Clínica Veterinaria',
  },
  {
    src: '/fotovet/instalaciones/vetefoto-8.jpeg',
    alt: 'Recepción y área de alimentos de EcoVet Clínica Veterinaria',
  },
] as const

export const PATIENT_PHOTOS = patientStillIds.map((id) => ({
  src: patientSrc(id),
  alt: 'Paciente atendido en EcoVet Clínica Veterinaria',
}))

/** Recorte destacado en inicio (el resto se ve en Galería). */
export const HOME_PATIENT_PREVIEW = PATIENT_PHOTOS.filter((_, index) =>
  [0, 1, 2, 3, 4, 5, 11, 14, 16, 22].includes(index),
)

export const PATIENT_VIDEOS = [
  {
    src: '/fotovet/pacientes/fotovet-8.mp4',
    alt: 'Actividad en EcoVet Clínica Veterinaria',
  },
  {
    src: '/fotovet/pacientes/fotovet-10.mp4',
    alt: 'Actividad en EcoVet Clínica Veterinaria',
  },
] as const

export const localGallery: GalleryItem[] = [
  ...CLINIC_PHOTOS.map((photo, i) => ({
    id: `gal-clinic-${i + 1}`,
    title: 'Nuestra veterinaria',
    image: photo.src,
    type: 'image' as const,
    category: 'Instalaciones',
    order: i + 1,
  })),
  ...PATIENT_PHOTOS.map((photo, i) => ({
    id: `gal-patient-${i + 1}`,
    title: 'Pacientes',
    image: photo.src,
    type: 'image' as const,
    category: 'Pacientes',
    order: 20 + i,
  })),
  ...PATIENT_VIDEOS.map((video, i) => ({
    id: `gal-video-${i + 1}`,
    title: 'Actividades EcoVet',
    image: video.src,
    type: 'video' as const,
    category: 'Pacientes',
    order: 80 + i,
  })),
]

export function isStockMediaUrl(url?: string) {
  if (!url) return true
  const value = url.toLowerCase()
  return (
    value.includes('unsplash.com') ||
    value.includes('images.unsplash') ||
    value.endsWith('/logo.png') ||
    value.endsWith('/logo.svg')
  )
}
