import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  Stethoscope,
  Video,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { SEO } from '@/components/seo/SEO'
import { Accordion } from '@/components/ui/Accordion'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { COUNTRIES, COUNTRY_CODE_OPTIONS, COUNTRY_OPTIONS } from '@/data/countries'
import { TELEMEDICINE_PHOTO } from '@/data/media'
import { assertPublicFormAllowed } from '@/lib/publicForm'
import { encodeJsonForScript, sanitizeEmail, sanitizePhone, sanitizeText } from '@/lib/sanitize'
import { createTelemedicineRequest } from '@/services/firestore'

const schema = z.object({
  ownerName: z.string().min(2, 'Ingresá tu nombre y apellido').max(120),
  country: z.string().min(2, 'Seleccioná un país').max(80),
  city: z.string().min(1, 'Ingresá tu ciudad').max(80),
  countryCode: z.string().min(1, 'Seleccioná el código de país').max(8),
  phone: z.string().min(6, 'Teléfono inválido').max(40),
  email: z.string().email('Correo inválido').max(120),
  petName: z.string().min(1, 'Ingresá el nombre de tu mascota').max(80),
  species: z.string().min(1, 'Seleccioná una especie').max(40),
  breed: z.string().min(1, 'Ingresá la raza').max(80),
  age: z.string().min(1, 'Ingresá la edad').max(40),
  sex: z.string().min(1, 'Seleccioná el sexo').max(20),
  consultationReason: z.string().min(1, 'Seleccioná el motivo').max(120),
  description: z
    .string()
    .min(10, 'Contanos un poco más sobre el motivo de la consulta')
    .max(2000),
  durationNote: z.string().min(1, 'Indicá desde cuándo ocurre').max(80),
  additionalInformation: z.string().max(2000).optional(),
  termsAccepted: z.boolean().refine((value) => value === true, {
    message: 'Debés aceptar para enviar la solicitud',
  }),
  contactConsent: z.boolean().refine((value) => value === true, {
    message: 'Necesitamos tu consentimiento para contactarte',
  }),
  hp_field: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const faqs = [
  {
    id: 'que-es',
    question: '¿Qué es una consulta veterinaria online?',
    answer:
      'Es una solicitud de atención a distancia. Completás un formulario con los datos de contacto y de tu mascota, y el equipo de EcoVet revisa la información para coordinar una consulta online cuando corresponda.',
  },
  {
    id: 'otro-pais',
    question: '¿Puedo solicitar una consulta desde otro país?',
    answer:
      'Sí podés enviar la solicitud desde cualquier ciudad o país. La disponibilidad de la telemedicina puede depender de la ubicación del paciente, la normativa aplicable y el tipo de consulta. El equipo confirmará si es posible atender el caso y con qué modalidad.',
  },
  {
    id: 'como-solicito',
    question: '¿Cómo solicito una consulta de telemedicina?',
    answer:
      'Completá el formulario de esta página con tus datos, los de tu mascota y el motivo de la consulta. No se reserva un horario automático: primero recibimos la solicitud y después coordinamos el siguiente paso.',
  },
  {
    id: 'informacion',
    question: '¿Qué información necesito proporcionar?',
    answer:
      'Nombre y datos de contacto, ubicación, datos básicos de la mascota y una descripción clara de lo que ocurre. Cuanto más completa sea la información, más ágil será la revisión.',
  },
  {
    id: 'reemplaza',
    question: '¿La consulta online reemplaza una consulta presencial?',
    answer:
      'No. La telemedicina no reemplaza una evaluación presencial cuando el caso lo requiere, ni está pensada para urgencias. Si hace falta un examen físico, estudios o una visita en la clínica, el equipo te lo indicará.',
  },
  {
    id: 'como-se-realiza',
    question: '¿Cómo se realiza la consulta?',
    answer:
      'Luego de revisar la solicitud, EcoVet se comunica con vos para acordar el medio (por ejemplo WhatsApp, llamada o videollamada) y el momento. No hay una plataforma de videollamada propia en esta web.',
  },
  {
    id: 'respuesta',
    question: '¿Cuándo recibiré una respuesta?',
    answer:
      'El equipo revisa las solicitudes y se comunica con los datos que indiques. El tiempo puede variar según el volumen de consultas y el horario de atención de la clínica.',
  },
]

export function Telemedicine() {
  const [confirmation, setConfirmation] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      country: 'Argentina',
      countryCode: '+54',
      species: 'Perro',
      sex: 'Macho',
      consultationReason: '',
      durationNote: '',
      additionalInformation: '',
      termsAccepted: false,
      contactConsent: false,
      hp_field: '',
    },
  })

  const schemaJson = useMemo(
    () =>
      encodeJsonForScript({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            name: 'Telemedicina Veterinaria Online',
            serviceType: 'Consulta veterinaria online',
            description:
              'Solicitud de consulta veterinaria online de EcoVet Clínica Veterinaria. El equipo revisa cada caso y coordina la modalidad de atención.',
            url: 'https://ecovet.clinic/telemedicina',
            image: TELEMEDICINE_PHOTO.src,
            provider: {
              '@type': 'VeterinaryCare',
              name: 'EcoVet Clínica Veterinaria',
              url: 'https://ecovet.clinic/',
            },
            areaServed: 'Online',
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          },
        ],
      }),
    [],
  )

  const countryField = register('country')

  const onInvalid = () => {
    setSubmitError('Revisá los campos marcados para enviar la solicitud.')
    window.requestAnimationFrame(() => {
      document
        .querySelector('#solicitud .text-red-600')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const onSubmit = async (data: FormData) => {
    setSubmitError('')
    if ((data.hp_field || '').trim()) {
      return
    }
    try {
      assertPublicFormAllowed('telemedicina', '')
    } catch {
      setSubmitError('Esperá unos segundos antes de volver a enviar.')
      return
    }

    const email = sanitizeEmail(data.email)
    const phone = sanitizePhone(data.phone)
    const countryCode = sanitizeText(data.countryCode, 8)
    if (!email || phone.replace(/\D/g, '').length < 6) {
      setSubmitError('Revisá el correo y el teléfono.')
      return
    }

    const codeDigits = countryCode.replace(/\D/g, '')
    const phoneDigits = phone.replace(/\D/g, '')
    const whatsapp =
      codeDigits && phoneDigits.startsWith(codeDigits)
        ? phoneDigits
        : `${codeDigits}${phoneDigits}`

    if (whatsapp.length < 6) {
      setSubmitError('Revisá el código de país y el teléfono.')
      return
    }

    const now = new Date().toISOString()
    try {
      await createTelemedicineRequest({
        ownerName: sanitizeText(data.ownerName, 120),
        country: sanitizeText(data.country, 80),
        city: sanitizeText(data.city, 80),
        countryCode,
        phone,
        whatsapp: sanitizeText(whatsapp, 40),
        email,
        petName: sanitizeText(data.petName, 80),
        species: sanitizeText(data.species, 40),
        breed: sanitizeText(data.breed, 80),
        age: sanitizeText(data.age, 40),
        sex: sanitizeText(data.sex, 20),
        consultationReason: sanitizeText(data.consultationReason, 120),
        description: sanitizeText(data.description, 2000),
        durationNote: sanitizeText(data.durationNote, 80),
        additionalInformation: sanitizeText(data.additionalInformation || '', 2000),
        status: 'pendiente',
        createdAt: now,
        updatedAt: now,
        termsAccepted: true,
        contactConsent: true,
      })
      setConfirmation(true)
      reset()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError('No pudimos enviar la solicitud. Revisá tu conexión e intentá nuevamente.')
    }
  }

  return (
    <>
      <SEO
        absoluteTitle="Telemedicina Veterinaria Online | Consultas Veterinarias Online"
        description="Solicitá una consulta veterinaria online desde cualquier lugar. EcoVet revisa tu solicitud de telemedicina y coordina la atención a distancia para perros y gatos."
        path="/telemedicina"
        image={TELEMEDICINE_PHOTO.src}
      />
      <Helmet>
        <script type="application/ld+json">{schemaJson}</script>
      </Helmet>

      <section className="relative overflow-hidden bg-ink">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[52svh] sm:min-h-[58svh] lg:min-h-[88svh]">
            <img
              src={TELEMEDICINE_PHOTO.src}
              alt={TELEMEDICINE_PHOTO.alt}
              className="absolute inset-0 h-full w-full object-cover object-center"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/10 lg:bg-gradient-to-r lg:from-transparent lg:via-ink/20 lg:to-ink/80" />
          </div>
          <div className="relative flex flex-col justify-center px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
            <div className="container-page mx-0 max-w-xl px-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200 sm:text-sm">
                Atención a distancia
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                Telemedicina Veterinaria Online
              </h1>
              <p className="mt-4 font-display text-lg font-semibold text-white sm:text-xl md:text-2xl">
                Consultas veterinarias online desde cualquier lugar
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                Solicitá una consulta veterinaria online completando el formulario.
                El equipo de EcoVet revisa cada caso y se comunica con vos para
                coordinar la modalidad de atención.
              </p>
              <div className="mt-8 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
            <a href="#solicitud" className="w-full sm:w-auto">
              <Button type="button" size="lg" className="w-full sm:w-auto">
                Solicitar consulta online
              </Button>
            </a>
            <a href="#como-funciona" className="w-full sm:w-auto">
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full border-white/30 bg-white/10 text-white hover:bg-white hover:text-ink sm:w-auto"
              >
                    ¿Cómo funciona?
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="section-pad scroll-mt-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Proceso"
            title="¿Cómo funciona la telemedicina veterinaria?"
            description="Es una solicitud de consulta online. No se asigna un horario automático: primero recibimos tu información y después coordinamos."
          />
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: ClipboardList,
                title: '1. Completá la solicitud',
                text: 'Proporcioná tus datos de contacto y explicá el motivo de la consulta.',
              },
              {
                icon: Stethoscope,
                title: '2. Revisamos tu solicitud',
                text: 'La solicitud llega al panel administrativo de la veterinaria.',
              },
              {
                icon: MessageCircle,
                title: '3. Nos comunicamos con vos',
                text: 'El equipo se contacta con los datos que indiques para coordinar la consulta.',
              },
              {
                icon: Video,
                title: '4. Realizamos la consulta online',
                text: 'La consulta se realiza por el medio acordado con la veterinaria.',
              },
            ].map((step, index) => (
              <AnimatedSection key={step.title} delay={index * 0.06}>
                <div className="h-full rounded-3xl border border-line bg-white p-5 sm:p-6">
                  <step.icon className="h-9 w-9 text-brand-600" />
                  <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-muted sm:text-base">
            Solicitá una consulta veterinaria online desde cualquier lugar. La
            disponibilidad de la telemedicina puede depender de la ubicación del
            paciente, la normativa aplicable y el tipo de consulta. Nuestro equipo
            confirmará la disponibilidad y modalidad de atención luego de recibir
            tu solicitud.
          </p>
        </div>
      </section>

      <section id="solicitud" className="section-pad scroll-mt-24 bg-white">
        <div className="container-page max-w-4xl">
          <SectionHeading
            eyebrow="Formulario"
            title="Solicitar consulta de telemedicina"
            description="Completá los datos. Un envío no confirma un turno: es una solicitud para que el equipo evalúe el caso y te contacte."
          />

          {confirmation ? (
            <div className="rounded-[2rem] border border-brand-200 bg-white p-6 shadow-sm md:p-8">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-brand-600" />
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-800">
                  ¡Solicitud recibida!
                </h2>
                <p className="mt-3 text-muted">
                  Recibimos correctamente tu solicitud de consulta veterinaria
                  online. Nuestro equipo revisará la información y se pondrá en
                  contacto con vos para coordinar los próximos pasos.
                </p>
              </div>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/">
                  <Button size="lg" className="w-full sm:w-auto">
                    Volver al inicio
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setConfirmation(false)
                    setSubmitError('')
                  }}
                >
                  Realizar otra solicitud
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="relative rounded-[2rem] border border-line bg-canvas p-6 md:p-8"
              noValidate
            >
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('hp_field')}
                />
              </div>

              <fieldset className="space-y-4">
                <legend className="font-display text-xl font-semibold text-ink">
                  Tus datos
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Nombre y apellido"
                    autoComplete="name"
                    {...register('ownerName')}
                    error={errors.ownerName?.message}
                  />
                  <Select
                    label="País"
                    {...countryField}
                    onChange={(e) => {
                      void countryField.onChange(e)
                      const match = COUNTRIES.find((item) => item.name === e.target.value)
                      if (match && match.code !== '+') {
                        setValue('countryCode', match.code, { shouldValidate: true })
                      }
                    }}
                    options={COUNTRY_OPTIONS}
                    error={errors.country?.message}
                  />
                  <Input
                    label="Ciudad"
                    autoComplete="address-level2"
                    {...register('city')}
                    error={errors.city?.message}
                  />
                  <Select
                    label="Código de país"
                    {...register('countryCode')}
                    options={COUNTRY_CODE_OPTIONS}
                    error={errors.countryCode?.message}
                  />
                  <Input
                    label="Teléfono / WhatsApp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Número sin el código de país"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                  <Input
                    label="Email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>
              </fieldset>

              <fieldset className="mt-8 space-y-4">
                <legend className="font-display text-xl font-semibold text-ink">
                  Datos de tu mascota
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Nombre de la mascota"
                    {...register('petName')}
                    error={errors.petName?.message}
                  />
                  <Select
                    label="Especie"
                    {...register('species')}
                    options={[
                      { value: 'Perro', label: 'Perro' },
                      { value: 'Gato', label: 'Gato' },
                      { value: 'Otro', label: 'Otro' },
                    ]}
                    error={errors.species?.message}
                  />
                  <Input label="Raza" {...register('breed')} error={errors.breed?.message} />
                  <Input
                    label="Edad"
                    placeholder="Ej: 3 años"
                    {...register('age')}
                    error={errors.age?.message}
                  />
                  <Select
                    label="Sexo"
                    {...register('sex')}
                    options={[
                      { value: 'Macho', label: 'Macho' },
                      { value: 'Hembra', label: 'Hembra' },
                      { value: 'No lo sé', label: 'No lo sé' },
                    ]}
                    error={errors.sex?.message}
                  />
                </div>
              </fieldset>

              <fieldset className="mt-8 space-y-4">
                <legend className="font-display text-xl font-semibold text-ink">
                  Información de la consulta
                </legend>
                <Select
                  label="Motivo de la consulta"
                  {...register('consultationReason')}
                  placeholder="Seleccioná un motivo"
                  options={[
                    { value: 'Consulta por síntomas', label: 'Consulta por síntomas' },
                    { value: 'Control general', label: 'Control general' },
                    { value: 'Nutrición', label: 'Nutrición' },
                    { value: 'Comportamiento', label: 'Comportamiento' },
                    { value: 'Seguimiento de tratamiento', label: 'Seguimiento de tratamiento' },
                    { value: 'Segunda opinión', label: 'Segunda opinión' },
                    { value: 'Otro', label: 'Otro' },
                  ]}
                  error={errors.consultationReason?.message}
                />
                <Select
                  label="Desde cuándo ocurre"
                  {...register('durationNote')}
                  placeholder="Seleccioná una opción"
                  options={[
                    { value: 'Menos de 24 horas', label: 'Menos de 24 horas' },
                    { value: '1 a 3 días', label: '1 a 3 días' },
                    { value: '4 a 7 días', label: '4 a 7 días' },
                    { value: 'Más de una semana', label: 'Más de una semana' },
                    { value: 'Más de un mes', label: 'Más de un mes' },
                    { value: 'No estoy seguro', label: 'No estoy seguro' },
                  ]}
                  error={errors.durationNote?.message}
                />
                <Textarea
                  label="Descripción detallada del problema"
                  rows={7}
                  className="min-h-40"
                  placeholder="Contanos qué le ocurre a tu mascota, qué síntomas presenta, desde cuándo los tiene y cualquier otra información que consideres importante."
                  {...register('description')}
                  error={errors.description?.message}
                />
                <Textarea
                  label="Información adicional (opcional)"
                  {...register('additionalInformation')}
                  error={errors.additionalInformation?.message}
                />
              </fieldset>

              <fieldset className="mt-8 space-y-3">
                <legend className="font-display text-xl font-semibold text-ink">
                  Confirmación
                </legend>
                <label className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 rounded border-line text-brand-600 focus-ring"
                    {...register('termsAccepted')}
                  />
                  <span>
                    Entiendo que esta es una solicitud de consulta online, no un
                    diagnóstico ni un turno confirmado, y que EcoVet evaluará la
                    disponibilidad según el caso.
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="text-xs text-red-600" role="alert">
                    {errors.termsAccepted.message}
                  </p>
                )}
                <label className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 rounded border-line text-brand-600 focus-ring"
                    {...register('contactConsent')}
                  />
                  <span>
                    Acepto que el equipo de EcoVet me contacte por teléfono,
                    WhatsApp o email para coordinar la consulta.
                  </span>
                </label>
                {errors.contactConsent && (
                  <p className="text-xs text-red-600" role="alert">
                    {errors.contactConsent.message}
                  </p>
                )}
              </fieldset>

              {submitError && (
                <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {submitError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="mt-6 w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando solicitud...' : 'Enviar solicitud'}
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-4xl">
          <SectionHeading
            eyebrow="Consultas frecuentes"
            title="Preguntas frecuentes sobre telemedicina veterinaria"
            description="Respuestas claras sobre la consulta veterinaria online y cómo se coordina la atención a distancia."
          />
          <Accordion items={faqs} />
          <p className="mt-8 text-center text-sm text-muted">
            Si preferís una visita en la clínica, también podés{' '}
            <Link to="/reservas" className="font-medium text-brand-700 hover:underline">
              reservar un turno presencial
            </Link>{' '}
            o escribirnos desde{' '}
            <Link to="/contacto" className="font-medium text-brand-700 hover:underline">
              Contacto
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
