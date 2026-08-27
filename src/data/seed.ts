import type {
  BlogPost,
  FAQ,
  GalleryItem,
  HeroContent,
  HoursConfig,
  Service,
  SiteInfo,
  Specialty,
  TeamMember,
  Testimonial,
} from '@/types'
import {
  CLINIC_PHOTOS,
  PATIENT_PHOTOS,
  TEAM_PHOTOS,
  localGallery,
} from '@/data/media'

export const siteInfo: SiteInfo = {
  name: 'EcoVet',
  tagline: 'Atención veterinaria integral, profesional y cercana',
  description:
    'EcoVet Clínica Veterinaria en Apóstoles, Misiones. Atención veterinaria integral, profesional y de calidad, enfocada en la prevención, el diagnóstico y el tratamiento.',
  phone: '3758-445387',
  email: 'ecovetaspotoles@gmail.com',
  whatsapp: '5493758445387',
  address: 'Suipacha 250',
  city: 'Apóstoles',
  province: 'Misiones',
  postalCode: '',
  mapEmbedUrl:
    'https://www.google.com/maps?q=Suipacha+250,+Apostoles,+Misiones,+Argentina&output=embed',
  mapLat: -27.9147,
  mapLng: -55.7537,
  social: {
    facebook:
      'https://www.facebook.com/people/EcoVet-Cl%C3%ADnica-veterinaria/61572983251304/',
    instagram: 'https://instagram.com/ecovet_apostoles',
  },
  yearsExperience: 0,
  patientsServed: 0,
  mission:
    'Brindar atención veterinaria integral, profesional y de calidad, enfocada en la prevención, el diagnóstico y el tratamiento, acompañando a cada paciente y a su familia con empatía, compromiso y respeto.\n\nBuscamos combinar nuestra experiencia profesional, tecnología y actualización constante para ofrecer una medicina veterinaria responsable, cercana y centrada en el bienestar de cada animal.',
  history:
    'EcoVet Clínica Veterinaria nació el 22 de febrero de 2025, con el sueño de brindar en Apóstoles una atención veterinaria integral, profesional y cercana, poniendo siempre el bienestar de cada paciente en el centro.\n\nNuestro proyecto se construyó sobre una amplia trayectoria y experiencia profesional desarrollada en Buenos Aires, que hoy trasladamos a nuestra comunidad con el compromiso de seguir creciendo y ofreciendo servicios de calidad.\n\nDesde nuestros comienzos, incorporamos distintas áreas y especialidades para acompañar a nuestros pacientes en cada etapa de su vida, combinando experiencia, tecnología, dedicación y amor por los animales.\n\nHoy seguimos construyendo nuestra historia junto a cada familia que confía en nosotros.\nEcoVet: una veterinaria que nació de la experiencia y crece con el amor por nuestros pacientes. 🐶🐱💚',
  values: [
    {
      title: 'Amor y respeto por los animales',
      description:
        'Cada paciente es único y merece ser tratado con cuidado, paciencia y dignidad.',
    },
    {
      title: 'Profesionalismo',
      description:
        'Trabajamos con responsabilidad, conocimiento y criterio médico.',
    },
    {
      title: 'Empatía',
      description:
        'Acompañamos a las familias comprendiendo sus necesidades y preocupaciones.',
    },
    {
      title: 'Compromiso',
      description:
        'Nos involucramos en cada caso y buscamos siempre brindar la mejor atención posible.',
    },
    {
      title: 'Prevención',
      description:
        'Creemos en la medicina preventiva como herramienta fundamental para una vida más saludable.',
    },
    {
      title: 'Innovación y actualización',
      description:
        'Incorporamos tecnología y nuevos conocimientos para mejorar nuestros servicios.',
    },
    {
      title: 'Trabajo en equipo',
      description:
        'Valoramos la colaboración entre profesionales para lograr mejores resultados.',
    },
    {
      title: 'Calidez',
      description:
        'Queremos que cada visita a EcoVet sea una experiencia de confianza, tranquilidad y cercanía.',
    },
  ],
  commitment:
    'Hoy seguimos construyendo nuestra historia junto a cada familia que confía en nosotros.',
}

export const heroContent: HeroContent = {
  title: 'Atención veterinaria integral, profesional y cercana',
  subtitle:
    'En Apóstoles, Misiones. Prevención, diagnóstico y tratamiento, acompañando a cada paciente y a su familia.',
  image: CLINIC_PHOTOS[7].src,
  ctaPrimary: 'Reservar Turno',
  ctaSecondary: 'Contactar por WhatsApp',
  ctaTertiary: 'Ver Servicios',
  stats: [
    { label: 'Apóstoles, Misiones', value: '📍' },
    { label: 'Desde el 22 de febrero de 2025', value: '2025' },
    { label: 'Atención veterinaria integral', value: '✓' },
    { label: 'No se realizan urgencias', value: '—' },
  ],
}

function svc(
  partial: Omit<Service, 'price' | 'duration' | 'active' | 'description'> & {
    description?: string
    price?: number
    duration?: number
    active?: boolean
  },
): Service {
  return {
    price: 0,
    duration: 0,
    active: true,
    description: partial.description ?? partial.shortDescription,
    ...partial,
  }
}

export const services: Service[] = [
  svc({
    id: 'svc-clinica-general',
    name: 'Clínica general',
    slug: 'clinica-general',
    shortDescription: 'Clínica general',
    image: PATIENT_PHOTOS[3].src,
    category: 'Clínica',
    featured: true,
    order: 1,
  }),
  svc({
    id: 'svc-vacunaciones',
    name: 'Vacunaciones',
    slug: 'vacunaciones',
    shortDescription: 'Vacunaciones',
    image: PATIENT_PHOTOS[0].src,
    category: 'Prevención',
    featured: true,
    order: 2,
  }),
  svc({
    id: 'svc-ecografia',
    name: 'Ecografía',
    slug: 'ecografia',
    shortDescription: 'Ecografía',
    image: PATIENT_PHOTOS[7].src,
    category: 'Diagnóstico',
    featured: true,
    order: 3,
  }),
  svc({
    id: 'svc-radiografia-digital',
    name: 'Radiografía digital',
    slug: 'radiografia-digital',
    shortDescription: 'Radiografía digital',
    image: CLINIC_PHOTOS[3].src,
    category: 'Diagnóstico',
    featured: true,
    order: 4,
  }),
  svc({
    id: 'svc-cirugias-tejidos-blandos',
    name: 'Cirugías de tejidos blandos',
    slug: 'cirugias-de-tejidos-blandos',
    shortDescription: 'Cirugías de tejidos blandos',
    image: CLINIC_PHOTOS[4].src,
    category: 'Cirugía',
    featured: true,
    order: 5,
  }),
  svc({
    id: 'svc-cardiologia',
    name: 'Cardiología',
    slug: 'cardiologia',
    shortDescription: 'Cardiología',
    image: PATIENT_PHOTOS[5].src,
    category: 'Cardiología',
    featured: true,
    order: 6,
  }),
  svc({
    id: 'svc-ecocardiografia',
    name: 'Ecocardiografía',
    slug: 'ecocardiografia',
    shortDescription: 'Ecocardiografía',
    image: PATIENT_PHOTOS[7].src,
    category: 'Cardiología',
    featured: false,
    order: 7,
  }),
  svc({
    id: 'svc-electrocardiograma',
    name: 'Electrocardiograma',
    slug: 'electrocardiograma',
    shortDescription: 'Electrocardiograma',
    image: PATIENT_PHOTOS[5].src,
    category: 'Cardiología',
    featured: false,
    order: 8,
  }),
  svc({
    id: 'svc-presion-arterial',
    name: 'Medición de presión arterial',
    slug: 'medicion-de-presion-arterial',
    shortDescription: 'Medición de presión arterial',
    image: PATIENT_PHOTOS[5].src,
    category: 'Cardiología',
    featured: false,
    order: 9,
  }),
  svc({
    id: 'svc-odontologia',
    name: 'Odontología canina y felina',
    slug: 'odontologia-canina-y-felina',
    shortDescription: 'Odontología canina y felina',
    image: PATIENT_PHOTOS[2].src,
    category: 'Odontología',
    featured: true,
    order: 10,
  }),
  svc({
    id: 'svc-analisis-clinicos',
    name: 'Análisis clínicos',
    slug: 'analisis-clinicos',
    shortDescription: 'Análisis clínicos',
    image: CLINIC_PHOTOS[5].src,
    category: 'Diagnóstico',
    featured: false,
    order: 11,
  }),
  svc({
    id: 'svc-farmacia',
    name: 'Farmacia',
    slug: 'farmacia',
    shortDescription: 'Farmacia',
    image: CLINIC_PHOTOS[6].src,
    category: 'Farmacia y alimentos',
    featured: false,
    order: 12,
  }),
  svc({
    id: 'svc-alimentos-balanceados',
    name: 'Alimentos balanceados',
    slug: 'alimentos-balanceados',
    shortDescription: 'Alimentos balanceados',
    image: CLINIC_PHOTOS[7].src,
    category: 'Farmacia y alimentos',
    featured: false,
    order: 13,
  }),
  svc({
    id: 'svc-estetica-proximamente',
    name: 'Próximamente estética canina (peluquería)',
    slug: 'proximamente-estetica-canina-peluqueria',
    shortDescription: 'Próximamente estética canina (peluquería)',
    description: 'Próximamente estética canina (peluquería)',
    image: PATIENT_PHOTOS[1].src,
    category: 'Próximamente',
    featured: false,
    order: 14,
  }),
]

export const specialties: Specialty[] = [
  {
    id: 'sp-clinica',
    name: 'Clínica general',
    description: 'Clínica general',
    image: PATIENT_PHOTOS[3].src,
    features: ['Clínica general', 'Vacunaciones', 'Análisis clínicos'],
  },
  {
    id: 'sp-cardiologia',
    name: 'Cardiología',
    description: 'Cardiología',
    image: PATIENT_PHOTOS[5].src,
    features: [
      'Cardiología',
      'Ecocardiografía',
      'Electrocardiograma',
      'Medición de presión arterial',
    ],
  },
  {
    id: 'sp-imagenes',
    name: 'Diagnóstico por imágenes',
    description: 'Ecografía y radiografía digital',
    image: CLINIC_PHOTOS[2].src,
    features: ['Ecografía', 'Radiografía digital'],
  },
  {
    id: 'sp-cirugia',
    name: 'Cirugías de tejidos blandos',
    description: 'Cirugías de tejidos blandos',
    image: CLINIC_PHOTOS[4].src,
    features: ['Cirugías de tejidos blandos'],
  },
  {
    id: 'sp-odontologia',
    name: 'Odontología canina y felina',
    description: 'Odontología canina y felina',
    image: PATIENT_PHOTOS[2].src,
    features: ['Odontología canina y felina'],
  },
]

export const team: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Dra. Claudia Andrea Koziuk',
    specialty: 'Médica veterinaria, MP 633',
    description: 'Médica veterinaria, MP 633',
    experience: '',
    image: TEAM_PHOTOS.claudia,
    schedule: '',
    active: true,
    order: 1,
    areas: [
      'Medicina integrativa',
      'Ecografías',
      'Radiografías',
      'Cirugía de tejidos blandos',
    ],
  },
  {
    id: 'team-2',
    name: 'Dr. Martin Zuchino',
    specialty: 'Cardiología',
    description: 'Cardiología',
    experience: '',
    image: TEAM_PHOTOS.martin,
    schedule: '',
    active: true,
    order: 2,
  },
  {
    id: 'team-3',
    name: 'Alejandro Gimenez',
    specialty: 'Administración y estilista canino',
    description: 'Administración y estilista canino',
    experience: '',
    image: TEAM_PHOTOS.alejandro,
    schedule: '',
    active: true,
    order: 3,
  },
]

export const gallery: GalleryItem[] = localGallery

export const testimonials: Testimonial[] = []

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: '¿Cómo reservo un turno?',
    answer:
      'Podés reservar desde la sección Reservas completando el formulario, o escribirnos por WhatsApp al 3758-445387.',
    order: 1,
    active: true,
  },
  {
    id: 'faq-2',
    question: '¿Atienden urgencias?',
    answer: 'No se realizan urgencias.',
    order: 2,
    active: true,
  },
  {
    id: 'faq-3',
    question: '¿Cuáles son los horarios de atención?',
    answer:
      '9-12:30 hs y de 16-19 hs. Los miércoles de 9-16 hs. Sábados de 9-12:30.',
    order: 3,
    active: true,
  },
  {
    id: 'faq-4',
    question: '¿Dónde están?',
    answer: 'Suipacha 250, Apóstoles, Misiones.',
    order: 4,
    active: true,
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Cómo cuidar un cachorro en sus primeros meses',
    slug: 'como-cuidar-un-cachorro',
    excerpt:
      'Guía práctica de socialización, nutrición, vacunas y hábitos para un comienzo saludable.',
    content: `
      <h2>Los primeros 90 días importan</h2>
      <p>Un cachorro necesita rutina, estimulación suave y controles veterinarios frecuentes. La socialización temprana reduce miedos futuros.</p>
      <h2>Checklist esencial</h2>
      <ul>
        <li>Vacunación y desparasitación según calendario</li>
        <li>Alimento premium adecuado a la edad</li>
        <li>Juegos cortos y descanso suficiente</li>
        <li>Visitas de control cada 3–4 semanas</li>
      </ul>
    `,
    image: PATIENT_PHOTOS[3].src,
    category: 'Cachorros',
    author: 'Equipo EcoVet',
    published: true,
    publishedAt: '2026-05-12',
    createdAt: '2026-05-10',
  },
  {
    id: 'blog-2',
    title: 'Calendario de vacunación: lo que tenés que saber',
    slug: 'calendario-de-vacunacion',
    excerpt:
      'Te explicamos las vacunas esenciales y cómo adaptarlas al estilo de vida de tu mascota.',
    content: `
      <h2>Prevención inteligente</h2>
      <p>El calendario no es igual para todos. Depende de la especie, la edad y la exposición a otros animales.</p>
      <p>Las vacunas esenciales protegen contra enfermedades graves. Las opcionales se eligen según riesgo.</p>
    `,
    image: PATIENT_PHOTOS[0].src,
    category: 'Prevención',
    author: 'Equipo EcoVet',
    published: true,
    publishedAt: '2026-04-28',
    createdAt: '2026-04-26',
  },
  {
    id: 'blog-3',
    title: 'Cómo alimentar correctamente a un gato',
    slug: 'como-alimentar-un-gato',
    excerpt:
      'Claves de nutrición felina para energía, pelaje saludable y buen tránsito digestivo.',
    content: `
      <h2>Los gatos son carnívoros obligados</h2>
      <p>Necesitan proteínas de alta calidad y una hidratación adecuada. El alimento húmedo suele ayudar en pacientes con tendencia urinaria.</p>
      <p>Evitá cambios bruscos de dieta y consultá antes de usar suplementos caseros.</p>
    `,
    image: PATIENT_PHOTOS[2].src,
    category: 'Nutrición',
    author: 'Equipo EcoVet',
    published: true,
    publishedAt: '2026-04-10',
    createdAt: '2026-04-08',
  },
  {
    id: 'blog-5',
    title: 'Parásitos: prevención todo el año',
    slug: 'parasitos-prevencion',
    excerpt:
      'Pulgas, garrapatas y vermes internos: cómo proteger a tu mascota en cada estación.',
    content: `
      <h2>La prevención es continua</h2>
      <p>Los parásitos no se toman vacaciones. Un plan anual reduce riesgos de anemia, dermatitis y enfermedades transmitidas.</p>
    `,
    image: PATIENT_PHOTOS[5].src,
    category: 'Prevención',
    author: 'Equipo EcoVet',
    published: true,
    publishedAt: '2026-03-05',
    createdAt: '2026-03-03',
  },
  {
    id: 'blog-6',
    title: 'Consejos para una tenencia responsable',
    slug: 'consejos-tenencia-responsable',
    excerpt:
      'Paseos seguros, enriquecimiento ambiental y controles periódicos: el combo del bienestar.',
    content: `
      <h2>Cuidar también es prevenir</h2>
      <p>Identificación, esterilización responsable, paseos con correa y chequeos anuales son pilares de una convivencia sana.</p>
    `,
    image: TEAM_PHOTOS.claudia,
    category: 'Consejos',
    author: 'Equipo EcoVet',
    published: true,
    publishedAt: '2026-02-18',
    createdAt: '2026-02-16',
  },
]

export const hoursConfig: HoursConfig = {
  id: 'hours-main',
  regular: [
    { day: 'Lunes', open: '09:00-12:30', close: '16:00-19:00', closed: false },
    { day: 'Martes', open: '09:00-12:30', close: '16:00-19:00', closed: false },
    { day: 'Miércoles', open: '09:00', close: '16:00', closed: false },
    { day: 'Jueves', open: '09:00-12:30', close: '16:00-19:00', closed: false },
    { day: 'Viernes', open: '09:00-12:30', close: '16:00-19:00', closed: false },
    { day: 'Sábado', open: '09:00', close: '12:30', closed: false },
  ],
  holidays: [],
  vacations: [],
  emergencyNote: 'No se realizan urgencias.',
  statusOverride: 'auto',
  statusNote: '',
}

export const timeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
]
