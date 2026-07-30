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

export const siteInfo: SiteInfo = {
  name: 'EcoVet',
  tagline: 'Cuidado veterinario premium con alma cercana',
  description:
    'EcoVet es una clínica veterinaria integral dedicada al bienestar de perros, gatos, animales exóticos y de granja. Combinamos tecnología, experiencia y trato humano para acompañarte en cada etapa de la vida de tu mascota.',
  phone: '+54 11 4567-8900',
  email: 'hola@ecovet.clinic',
  whatsapp: '5491112345678',
  address: 'Av. del Libertador 4250',
  city: 'Buenos Aires',
  province: 'CABA',
  postalCode: '1425',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.123!2d-58.43!3d-34.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM0JzEyLjAiUyA1OMKwMjUnNDguMCJX!5e0!3m2!1ses!2sar!4v1700000000000',
  mapLat: -34.5708,
  mapLng: -58.4305,
  social: {
    facebook: 'https://facebook.com/ecovetclinic',
    instagram: 'https://instagram.com/ecovetclinic',
    youtube: 'https://youtube.com/@ecovetclinic',
    tiktok: 'https://tiktok.com/@ecovetclinic',
  },
  yearsExperience: 12,
  patientsServed: 5200,
  mission:
    'Brindar medicina veterinaria de excelencia con empatía, transparencia y compromiso ambiental, creando vínculos de confianza con cada familia.',
  history:
    'EcoVet nació en 2013 con una idea simple: la medicina veterinaria puede ser rigurosa y cálida al mismo tiempo. Desde un consultorio pequeño en Palermo, crecimos hasta convertirnos en un centro integral con quirófano, diagnóstico por imágenes, laboratorio propio y un equipo multidisciplinario. Hoy seguimos cuidando a miles de mascotas con el mismo espíritu de cercanía del primer día.',
  values: [
    {
      title: 'Empatía real',
      description:
        'Escuchamos a tutores y pacientes. Cada decisión clínica contempla el vínculo emocional con la mascota.',
    },
    {
      title: 'Excelencia clínica',
      description:
        'Protocolos actualizados, formación continua y tecnología al servicio de diagnósticos precisos.',
    },
    {
      title: 'Transparencia',
      description:
        'Explicamos opciones, costos y cuidados de forma clara para que puedas decidir con tranquilidad.',
    },
    {
      title: 'Compromiso sostenible',
      description:
        'Reducimos residuos, elegimos insumos responsables y educamos sobre tenencia responsable.',
    },
  ],
  commitment:
    'Nos comprometemos a acompañarte antes, durante y después de cada consulta: recordatorios de vacunas, planes preventivos y seguimiento postquirúrgico incluido.',
}

export const heroContent: HeroContent = {
  title: 'Tu mascota merece una clínica que inspire confianza',
  subtitle:
    'Atención veterinaria integral, turnos online y un equipo que trata a cada paciente como parte de la familia.',
  image:
    'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=2000&q=80',
  ctaPrimary: 'Reservar Turno',
  ctaSecondary: 'Contactar por WhatsApp',
  ctaTertiary: 'Ver Servicios',
  stats: [
    { label: 'Más de 10 años cuidando mascotas', value: '12+' },
    { label: 'Pacientes atendidos', value: '5000+' },
    { label: 'Atención personalizada', value: '1:1' },
    { label: 'Urgencias', value: '24/7' },
  ],
}

const img = {
  consulta:
    'https://images.unsplash.com/photo-1576201832337-cebc1a8c8d0d?auto=format&fit=crop&w=1200&q=80',
  vacuna:
    'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=1200&q=80',
  desparasitacion:
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
  cirugia:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
  castracion:
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
  lab: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
  eco: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
  rx: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80',
  internacion:
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
  emergencia:
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80',
  peluqueria:
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
  bano: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
  unas: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
  dental:
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1200&q=80',
  alimento:
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80',
  farmacia:
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
  accesorios:
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
}

export const services: Service[] = [
  {
    id: 'svc-consulta',
    name: 'Consulta clínica',
    slug: 'consulta-clinica',
    shortDescription: 'Evaluación completa con plan preventivo personalizado.',
    description:
      'Consulta general con examen físico completo, revisión de historial, recomendaciones nutricionales y plan de prevención a medida.',
    price: 18000,
    duration: 30,
    image: img.consulta,
    category: 'Clínica',
    active: true,
    featured: true,
    order: 1,
  },
  {
    id: 'svc-vacunacion',
    name: 'Vacunación',
    slug: 'vacunacion',
    shortDescription: 'Calendario actualizado para perros y gatos.',
    description:
      'Aplicación de vacunas esenciales y opcionales según edad, estilo de vida y riesgo epidemiológico, con carnet digital.',
    price: 22000,
    duration: 20,
    image: img.vacuna,
    category: 'Prevención',
    active: true,
    featured: true,
    order: 2,
  },
  {
    id: 'svc-desparasitacion',
    name: 'Desparasitación',
    slug: 'desparasitacion',
    shortDescription: 'Control interno y externo seguro y efectivo.',
    description:
      'Planes de desparasitación interna y externa adaptados al peso, especie y entorno de tu mascota.',
    price: 12000,
    duration: 15,
    image: img.desparasitacion,
    category: 'Prevención',
    active: true,
    featured: false,
    order: 3,
  },
  {
    id: 'svc-cirugias',
    name: 'Cirugías',
    slug: 'cirugias',
    shortDescription: 'Quirófano equipado con monitoreo continuo.',
    description:
      'Cirugías blandas y ortopédicas con anestesia segura, monitoreo multiparamétrico y recuperación supervisada.',
    price: 150000,
    duration: 120,
    image: img.cirugia,
    category: 'Cirugía',
    active: true,
    featured: true,
    order: 4,
  },
  {
    id: 'svc-castraciones',
    name: 'Castraciones',
    slug: 'castraciones',
    shortDescription: 'Procedimiento seguro con seguimiento postoperatorio.',
    description:
      'Esterilización canina y felina con protocolo analgésico completo y controles incluidos.',
    price: 65000,
    duration: 60,
    image: img.castracion,
    category: 'Cirugía',
    active: true,
    featured: true,
    order: 5,
  },
  {
    id: 'svc-laboratorio',
    name: 'Laboratorio',
    slug: 'laboratorio',
    shortDescription: 'Análisis clínicos con resultados ágiles.',
    description:
      'Hematología, bioquímica, orina y pruebas específicas con interpretación clínica el mismo día en la mayoría de los casos.',
    price: 28000,
    duration: 25,
    image: img.lab,
    category: 'Diagnóstico',
    active: true,
    featured: false,
    order: 6,
  },
  {
    id: 'svc-ecografia',
    name: 'Ecografía',
    slug: 'ecografia',
    shortDescription: 'Diagnóstico por imágenes no invasivo.',
    description:
      'Ecografías abdominales y gestacionales realizadas por especialistas, con informe detallado.',
    price: 45000,
    duration: 40,
    image: img.eco,
    category: 'Diagnóstico',
    active: true,
    featured: false,
    order: 7,
  },
  {
    id: 'svc-radiografias',
    name: 'Radiografías',
    slug: 'radiografias',
    shortDescription: 'Imágenes digitales de alta definición.',
    description:
      'Radiología digital para evaluación ósea, torácica y abdominal con entrega inmediata.',
    price: 38000,
    duration: 30,
    image: img.rx,
    category: 'Diagnóstico',
    active: true,
    featured: false,
    order: 8,
  },
  {
    id: 'svc-internacion',
    name: 'Internación',
    slug: 'internacion',
    shortDescription: 'Cuidados intensivos con monitoreo 24 hs.',
    description:
      'Área de internación climatizada, fluidoterapia, oxigenoterapia y comunicación constante con la familia.',
    price: 55000,
    duration: 1440,
    image: img.internacion,
    category: 'Cuidados',
    active: true,
    featured: false,
    order: 9,
  },
  {
    id: 'svc-emergencias',
    name: 'Emergencias',
    slug: 'emergencias',
    shortDescription: 'Respuesta rápida ante urgencias vitales.',
    description:
      'Atención de urgencias clínicas y traumáticas con triaje prioritario y estabilización inmediata.',
    price: 40000,
    duration: 45,
    image: img.emergencia,
    category: 'Urgencias',
    active: true,
    featured: true,
    order: 10,
  },
  {
    id: 'svc-peluqueria',
    name: 'Peluquería',
    slug: 'peluqueria',
    shortDescription: 'Estética profesional sin estrés.',
    description:
      'Cortes de raza, higiene y estética con manejo suave y productos hipoalergénicos.',
    price: 25000,
    duration: 90,
    image: img.peluqueria,
    category: 'Estética',
    active: true,
    featured: false,
    order: 11,
  },
  {
    id: 'svc-bano',
    name: 'Baño',
    slug: 'bano',
    shortDescription: 'Baño medicinal o de mantenimiento.',
    description:
      'Baños dermatológicos, antipulgas o de mantenimiento con secado profesional.',
    price: 15000,
    duration: 60,
    image: img.bano,
    category: 'Estética',
    active: true,
    featured: false,
    order: 12,
  },
  {
    id: 'svc-unas',
    name: 'Corte de uñas',
    slug: 'corte-de-unas',
    shortDescription: 'Corte seguro y sin molestias.',
    description:
      'Recorte de uñas con contención amable, ideal para mascotas sensibles o primerizas.',
    price: 6000,
    duration: 15,
    image: img.unas,
    category: 'Estética',
    active: true,
    featured: false,
    order: 13,
  },
  {
    id: 'svc-dental',
    name: 'Limpieza dental',
    slug: 'limpieza-dental',
    shortDescription: 'Profilaxis bajo anestesia segura.',
    description:
      'Limpieza ultrasónica, pulido y evaluación periodontal para prevenir enfermedades orales.',
    price: 85000,
    duration: 90,
    image: img.dental,
    category: 'Clínica',
    active: true,
    featured: false,
    order: 14,
  },
  {
    id: 'svc-alimentos',
    name: 'Venta de alimentos',
    slug: 'venta-de-alimentos',
    shortDescription: 'Nutrición premium y dietas clínicas.',
    description:
      'Asesoramiento nutricional y venta de alimentos premium, naturales y terapéuticos.',
    price: 8000,
    duration: 15,
    image: img.alimento,
    category: 'Tienda',
    active: true,
    featured: false,
    order: 15,
  },
  {
    id: 'svc-farmacia',
    name: 'Farmacia veterinaria',
    slug: 'farmacia-veterinaria',
    shortDescription: 'Medicación con indicación profesional.',
    description:
      'Dispensación de medicamentos, antiparasitarios y tratamientos con orientación farmacéutica veterinaria.',
    price: 5000,
    duration: 10,
    image: img.farmacia,
    category: 'Tienda',
    active: true,
    featured: false,
    order: 16,
  },
  {
    id: 'svc-accesorios',
    name: 'Accesorios',
    slug: 'accesorios',
    shortDescription: 'Productos seleccionados para el día a día.',
    description:
      'Collares, transportadoras, juguetes enriquecedores y productos de higiene recomendados por nuestro equipo.',
    price: 4500,
    duration: 10,
    image: img.accesorios,
    category: 'Tienda',
    active: true,
    featured: false,
    order: 17,
  },
]

export const specialties: Specialty[] = [
  {
    id: 'sp-perros',
    name: 'Perros',
    description:
      'Medicina preventiva, clínica y quirúrgica adaptada a cada raza, tamaño y etapa de vida.',
    image:
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=80',
    features: ['Cachorros y seniors', 'Planes antirabia', 'Ortopedia canina'],
  },
  {
    id: 'sp-gatos',
    name: 'Gatos',
    description:
      'Consultorio felino con manejo low-stress, medicina interna y controles geriátricos.',
    image:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    features: ['Sala low-stress', 'Chequeos renales', 'Comportamiento'],
  },
  {
    id: 'sp-exoticos',
    name: 'Animales exóticos',
    description:
      'Atención especializada para conejos, hurones, aves y pequeños mamíferos.',
    image:
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=1200&q=80',
    features: ['Conejos y aves', 'Nutrición específica', 'Cirugía delicada'],
  },
  {
    id: 'sp-granja',
    name: 'Animales de granja',
    description:
      'Asesoramiento productivo, vacunación y atención clínica para animales de compañía rurales.',
    image:
      'https://images.unsplash.com/photo-1500595046743-cd271d694e30?auto=format&fit=crop&w=1200&q=80',
    features: ['Vacunación', 'Prevención', 'Visitas coordinadas'],
  },
  {
    id: 'sp-urgencias',
    name: 'Urgencias',
    description:
      'Protocolo de triaje, estabilización y comunicación clara en momentos críticos.',
    image:
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
    features: ['Triaje prioritario', 'Monitoreo continuo', 'WhatsApp urgente'],
  },
]

export const team: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Dra. Camila Herrera',
    specialty: 'Directora médica · Clínica general',
    description:
      'Fundadora de EcoVet. Especialista en medicina preventiva y comunicación con tutores.',
    experience: '14 años de experiencia',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lun a Vie 9:00–18:00',
    active: true,
    order: 1,
  },
  {
    id: 'team-2',
    name: 'Dr. Martín Ríos',
    specialty: 'Cirugía y anestesiología',
    description:
      'Referente en cirugías blandas y protocolos anestésicos seguros para pacientes de riesgo.',
    experience: '11 años de experiencia',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
    schedule: 'Mar, Jue y Sáb 10:00–19:00',
    active: true,
    order: 2,
  },
  {
    id: 'team-3',
    name: 'Dra. Lucía Peña',
    specialty: 'Medicina felina',
    description:
      'Apasionada por el bienestar felino y el manejo sin estrés en consulta e internación.',
    experience: '9 años de experiencia',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80',
    schedule: 'Lun a Vie 11:00–20:00',
    active: true,
    order: 3,
  },
  {
    id: 'team-4',
    name: 'Dr. Nicolás Vidal',
    specialty: 'Diagnóstico por imágenes',
    description:
      'Ecografista con formación continua en cardiología y medicina de urgencias.',
    experience: '8 años de experiencia',
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    schedule: 'Mié a Dom 9:00–17:00',
    active: true,
    order: 4,
  },
]

export const gallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Recepción EcoVet',
    image:
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1400&q=80',
    type: 'image',
    category: 'Instalaciones',
    order: 1,
  },
  {
    id: 'gal-2',
    title: 'Consultorio principal',
    image:
      'https://images.unsplash.com/photo-1576201832337-cebc1a8c8d0d?auto=format&fit=crop&w=1400&q=80',
    type: 'image',
    category: 'Instalaciones',
    order: 2,
  },
  {
    id: 'gal-3',
    title: 'Paciente feliz post consulta',
    image:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1400&q=80',
    type: 'image',
    category: 'Pacientes',
    order: 3,
  },
  {
    id: 'gal-4',
    title: 'Área de peluquería',
    image:
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1400&q=80',
    type: 'image',
    category: 'Estética',
    order: 4,
  },
  {
    id: 'gal-5',
    title: 'Equipo en acción',
    image:
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1400&q=80',
    type: 'image',
    category: 'Equipo',
    order: 5,
  },
  {
    id: 'gal-6',
    title: 'Sala de espera',
    image:
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1400&q=80',
    type: 'image',
    category: 'Instalaciones',
    order: 6,
  },
  {
    id: 'gal-7',
    title: 'Gato en control',
    image:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1400&q=80',
    type: 'image',
    category: 'Pacientes',
    order: 7,
  },
  {
    id: 'gal-8',
    title: 'Tour virtual EcoVet',
    image: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'video',
    category: 'Videos',
    order: 8,
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 'tes-1',
    name: 'María Fernanda López',
    petName: 'Luna',
    rating: 5,
    comment:
      'Desde la primera consulta sentí confianza. Explicaron cada paso del tratamiento de Luna con claridad y mucha calidez.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    active: true,
    order: 1,
  },
  {
    id: 'tes-2',
    name: 'Diego Salinas',
    petName: 'Otto',
    rating: 5,
    comment:
      'Llevé a Otto de urgencia un domingo y la respuesta fue impecable. Profesionalismo real cuando más lo necesitás.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    active: true,
    order: 2,
  },
  {
    id: 'tes-3',
    name: 'Valentina Cruz',
    petName: 'Mora',
    rating: 5,
    comment:
      'La peluquería y el control clínico el mismo día fue un alivio. Mora salió feliz y yo tranquila.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    active: true,
    order: 3,
  },
  {
    id: 'tes-4',
    name: 'Julián Acosta',
    petName: 'Tokio',
    rating: 5,
    comment:
      'Excelente seguimiento post castración. WhatsApp siempre disponible y controles puntuales.',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    active: true,
    order: 4,
  },
]

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: '¿Cómo reservo un turno?',
    answer:
      'Podés reservar desde la sección Reservas completando el formulario, o escribirnos por WhatsApp. Te confirmaremos disponibilidad a la brevedad.',
    order: 1,
    active: true,
  },
  {
    id: 'faq-2',
    question: '¿Atienden emergencias?',
    answer:
      'Sí. Contamos con protocolo de urgencias. Ante una emergencia, contactanos por WhatsApp o teléfono indicando síntomas para priorizar la atención.',
    order: 2,
    active: true,
  },
  {
    id: 'faq-3',
    question: '¿Qué debo llevar a la primera consulta?',
    answer:
      'Traé carnet de vacunas si lo tenés, historial previo, y datos sobre alimentación, hábitos y síntomas. Si es un cachorro, también la fecha aproximada de nacimiento.',
    order: 3,
    active: true,
  },
  {
    id: 'faq-4',
    question: '¿Realizan castraciones?',
    answer:
      'Sí, realizamos castraciones caninas y felinas con evaluación prequirúrgica, anestesia monitoreada y seguimiento postoperatorio incluido.',
    order: 4,
    active: true,
  },
  {
    id: 'faq-5',
    question: '¿Puedo pagar con tarjeta?',
    answer:
      'Aceptamos efectivo, transferencia y tarjetas de débito/crédito. Consultá promociones vigentes en recepción.',
    order: 5,
    active: true,
  },
  {
    id: 'faq-6',
    question: '¿Atienden animales exóticos?',
    answer:
      'Sí. Nuestro equipo está capacitado para conejos, aves y pequeños mamíferos. Te recomendamos avisar al reservar para preparar el consultorio.',
    order: 6,
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
      <p>En EcoVet armamos un plan personalizado según raza, tamaño y entorno familiar.</p>
    `,
    image:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1400&q=80',
    category: 'Cachorros',
    author: 'Dra. Camila Herrera',
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
      <h2>Recordatorios EcoVet</h2>
      <p>Te avisamos antes de cada refuerzo para que no se te pase ninguna dosis importante.</p>
    `,
    image:
      'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=1400&q=80',
    category: 'Prevención',
    author: 'Dr. Martín Ríos',
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
    image:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1400&q=80',
    category: 'Nutrición',
    author: 'Dra. Lucía Peña',
    published: true,
    publishedAt: '2026-04-10',
    createdAt: '2026-04-08',
  },
  {
    id: 'blog-4',
    title: 'Qué hacer en una emergencia veterinaria',
    slug: 'que-hacer-en-una-emergencia',
    excerpt:
      'Pasos claros para actuar con calma y ayudar a tu mascota mientras llega la atención profesional.',
    content: `
      <h2>Mantener la calma salva tiempo</h2>
      <p>Observá respiración, color de mucosas y nivel de respuesta. No administres medicamentos humanos.</p>
      <ul>
        <li>Contactá a EcoVet e indicá síntomas</li>
        <li>Transportá con seguridad y contención</li>
        <li>No ofrezcas comida si hay vómitos o trauma</li>
      </ul>
    `,
    image:
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1400&q=80',
    category: 'Urgencias',
    author: 'Dr. Nicolás Vidal',
    published: true,
    publishedAt: '2026-03-22',
    createdAt: '2026-03-20',
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
      <p>En consulta evaluamos el producto ideal según peso, especie y convivencia con niños.</p>
    `,
    image:
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1400&q=80',
    category: 'Prevención',
    author: 'Dra. Camila Herrera',
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
    image:
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1400&q=80',
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
    { day: 'Lunes', open: '09:00', close: '20:00', closed: false },
    { day: 'Martes', open: '09:00', close: '20:00', closed: false },
    { day: 'Miércoles', open: '09:00', close: '20:00', closed: false },
    { day: 'Jueves', open: '09:00', close: '20:00', closed: false },
    { day: 'Viernes', open: '09:00', close: '20:00', closed: false },
    { day: 'Sábado', open: '09:00', close: '14:00', closed: false },
    { day: 'Domingo', open: '10:00', close: '13:00', closed: false },
  ],
  holidays: [
    { date: '2026-12-25', name: 'Navidad', closed: true },
    { date: '2027-01-01', name: 'Año Nuevo', closed: true },
  ],
  vacations: [],
  emergencyNote:
    'Urgencias: contactanos por WhatsApp las 24 hs para orientación y derivación prioritaria.',
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
  '19:30',
]
