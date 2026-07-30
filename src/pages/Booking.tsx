import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { SEO } from '@/components/seo/SEO'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import { timeSlots } from '@/data/seed'
import { formatDate, formatPrice, whatsappUrl } from '@/lib/utils'
import { createReservation, logActivity } from '@/services/firestore'

const schema = z.object({
  firstName: z.string().min(2, 'Requerido'),
  lastName: z.string().min(2, 'Requerido'),
  email: z.string().email('Correo inválido'),
  phone: z.string().min(6, 'Teléfono inválido'),
  petName: z.string().min(1, 'Requerido'),
  species: z.string().min(1, 'Seleccioná una especie'),
  breed: z.string().min(1, 'Requerido'),
  age: z.string().min(1, 'Requerido'),
  weight: z.string().min(1, 'Requerido'),
  serviceId: z.string().min(1, 'Seleccioná un servicio'),
  date: z.string().min(1, 'Seleccioná una fecha'),
  time: z.string().min(1, 'Seleccioná una hora'),
  veterinarianId: z.string().min(1, 'Seleccioná un veterinario'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface BookingConfirmation {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  petName: string
  species: string
  breed: string
  age: string
  weight: string
  serviceName: string
  date: string
  time: string
  veterinarianName: string
  notes: string
  estimatedPrice: number
}

export function Booking() {
  const { services, team, site } = useSite()
  const [params] = useSearchParams()
  const preselectedSlug = params.get('servicio')
  const preselected = services.find((s) => s.slug === preselectedSlug)
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null,
  )

  const defaultServiceId = preselected?.id || services[0]?.id || ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: defaultServiceId,
      veterinarianId: team[0]?.id || '',
      species: 'Perro',
      notes: '',
    },
  })

  const serviceOptions = useMemo(
    () => services.map((s) => ({ value: s.id, label: s.name })),
    [services],
  )
  const vetOptions = useMemo(
    () => team.map((t) => ({ value: t.id, label: t.name })),
    [team],
  )

  const onSubmit = async (data: FormData) => {
    const service = services.find((s) => s.id === data.serviceId)
    const vet = team.find((t) => t.id === data.veterinarianId)
    const now = new Date().toISOString()
    const id = await createReservation({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      petName: data.petName,
      species: data.species,
      breed: data.breed,
      age: data.age,
      weight: data.weight,
      serviceId: data.serviceId,
      serviceName: service?.name || '',
      date: data.date,
      time: data.time,
      veterinarianId: data.veterinarianId,
      veterinarianName: vet?.name || '',
      notes: data.notes || '',
      status: 'pendiente',
      createdAt: now,
      updatedAt: now,
      estimatedPrice: service?.price || 0,
    })
    await logActivity(
      'reserva',
      `Nueva reserva de ${data.firstName} ${data.lastName} para ${data.petName}`,
    )
    setConfirmation({
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      petName: data.petName,
      species: data.species,
      breed: data.breed,
      age: data.age,
      weight: data.weight,
      serviceName: service?.name || '',
      date: data.date,
      time: data.time,
      veterinarianName: vet?.name || '',
      notes: data.notes || '',
      estimatedPrice: service?.price || 0,
    })
    reset()
  }

  return (
    <>
      <SEO
        title="Reservar turno"
        description="Reservá tu turno veterinario online en EcoVet de forma rápida y segura."
        path="/reservas"
      />
      <section className="section-pad pt-32">
        <div className="container-page max-w-4xl">
          <SectionHeading
            eyebrow="Reservas"
            title="Agenda tu visita en minutos"
            description={`Completá el formulario y el equipo de ${site.name} te confirmará el turno.`}
          />

          {confirmation ? (
            <div className="rounded-[2rem] border border-brand-200 bg-white p-6 shadow-sm md:p-8">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-brand-600" />
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-800">
                  ¡Reserva confirmada!
                </h2>
                <p className="mt-2 text-muted">
                  Recibimos tu solicitud. Código de referencia:{' '}
                  <span className="font-semibold text-ink">
                    {confirmation.id.slice(0, 8).toUpperCase()}
                  </span>
                </p>
              </div>

              <div className="mt-8 grid gap-3 rounded-2xl border border-line bg-brand-50/60 p-5 sm:grid-cols-2">
                <Detail label="Cliente" value={`${confirmation.firstName} ${confirmation.lastName}`} />
                <Detail label="Teléfono" value={confirmation.phone} />
                <Detail label="Correo" value={confirmation.email} />
                <Detail label="Mascota" value={`${confirmation.petName} (${confirmation.species})`} />
                <Detail label="Raza" value={confirmation.breed} />
                <Detail label="Edad / Peso" value={`${confirmation.age} · ${confirmation.weight}`} />
                <Detail label="Servicio" value={confirmation.serviceName} />
                <Detail label="Veterinario/a" value={confirmation.veterinarianName} />
                <Detail
                  label="Fecha y hora"
                  value={`${formatDate(confirmation.date)} · ${confirmation.time}`}
                />
                <Detail
                  label="Precio de referencia"
                  value={formatPrice(confirmation.estimatedPrice)}
                />
                {confirmation.notes && (
                  <div className="sm:col-span-2">
                    <Detail label="Observaciones" value={confirmation.notes} />
                  </div>
                )}
              </div>

              <p className="mt-5 text-center text-sm text-muted">
                Estado actual: <strong className="text-brand-700">pendiente de confirmación</strong>.
                Te contactaremos por WhatsApp o correo para validar disponibilidad.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={whatsappUrl(
                    site.whatsapp,
                    `Hola EcoVet, acabo de reservar un turno (ref. ${confirmation.id.slice(0, 8).toUpperCase()}) para ${confirmation.petName}.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="whatsapp">
                    <MessageCircle className="h-4 w-4" />
                    Escribir por WhatsApp
                  </Button>
                </a>
                <Button variant="outline" onClick={() => setConfirmation(null)}>
                  Hacer otra reserva
                </Button>
                <Link to="/">
                  <Button variant="ghost">Volver al inicio</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-[2rem] border border-line bg-white p-6 md:p-8"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Nombre" {...register('firstName')} error={errors.firstName?.message} />
                <Input label="Apellido" {...register('lastName')} error={errors.lastName?.message} />
                <Input label="Correo" type="email" {...register('email')} error={errors.email?.message} />
                <Input
                  label="Teléfono / WhatsApp"
                  placeholder="Ej: 11 2345-6789"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <Input label="Nombre de la mascota" {...register('petName')} error={errors.petName?.message} />
                <Select
                  label="Especie"
                  {...register('species')}
                  error={errors.species?.message}
                  options={[
                    { value: 'Perro', label: 'Perro' },
                    { value: 'Gato', label: 'Gato' },
                    { value: 'Exótico', label: 'Exótico' },
                    { value: 'Granja', label: 'Animal de granja' },
                  ]}
                />
                <Input label="Raza" {...register('breed')} error={errors.breed?.message} />
                <Input label="Edad" placeholder="Ej: 3 años" {...register('age')} error={errors.age?.message} />
                <Input label="Peso" placeholder="Ej: 12 kg" {...register('weight')} error={errors.weight?.message} />
                <Select
                  label="Servicio"
                  {...register('serviceId')}
                  error={errors.serviceId?.message}
                  options={serviceOptions}
                />
                <Input label="Fecha" type="date" {...register('date')} error={errors.date?.message} />
                <Select
                  label="Hora"
                  {...register('time')}
                  error={errors.time?.message}
                  placeholder="Seleccionar hora"
                  options={timeSlots.map((t) => ({ value: t, label: t }))}
                />
                <Select
                  label="Veterinario"
                  {...register('veterinarianId')}
                  error={errors.veterinarianId?.message}
                  options={vetOptions}
                />
              </div>
              <div className="mt-4">
                <Textarea
                  label="Observaciones"
                  {...register('notes')}
                  placeholder="Síntomas, alergias, preferencias…"
                />
              </div>
              <Button type="submit" className="mt-6 w-full md:w-auto" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando reserva…' : 'Confirmar reserva'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  )
}
