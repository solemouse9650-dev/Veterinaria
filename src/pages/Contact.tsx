import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SEO } from '@/components/seo/SEO'
import { WhatsAppIcon } from '@/components/brand/SocialIcons'
import { OpenStatusBadge } from '@/components/hours/OpenStatusBadge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import { sanitizeEmail, sanitizePhone, sanitizeText, sanitizeMapEmbedUrl } from '@/lib/sanitize'
import { assertPublicFormAllowed } from '@/lib/publicForm'
import { whatsappUrl } from '@/lib/utils'
import { createDoc } from '@/services/firestore'

const schema = z.object({
  name: z.string().min(2, 'Ingresá tu nombre').max(120),
  email: z.string().email('Correo inválido').max(120),
  phone: z.string().min(6, 'Teléfono inválido').max(40),
  message: z.string().min(10, 'Contanos un poco más').max(2000),
  website: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function Contact() {
  const { site, hours } = useSite()
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setSent(false)
    setSubmitError('')
    try {
      assertPublicFormAllowed('contacto', '')
    } catch {
      setSubmitError('Esperá unos segundos antes de volver a enviar.')
      return
    }
    if ((data.website || '').trim()) {
      setSent(true)
      reset()
      return
    }
    const email = sanitizeEmail(data.email)
    const phone = sanitizePhone(data.phone)
    if (!email || phone.replace(/\D/g, '').length < 6) {
      setSubmitError('Revisá el correo y el teléfono.')
      return
    }
    try {
      await createDoc('clients', {
        name: sanitizeText(data.name, 120),
        email,
        phone,
        message: sanitizeText(data.message, 2000),
        type: 'contact',
        createdAt: new Date().toISOString(),
      })
      setSent(true)
      reset()
    } catch {
      setSubmitError('No pudimos enviar el mensaje. Revisá tu conexión e intentá nuevamente.')
    }
  }

  return (
    <>
      <SEO
        title="Contacto"
        description={`Contactá a ${site.name}: WhatsApp, teléfono, email, mapa y horarios.`}
        path="/contacto"
      />
      <section className="section-pad page-top">
        <div className="container-page">
          <SectionHeading
            eyebrow="Contacto"
            title="Estamos para ayudarte"
            description="Escribinos, llamanos o visitanos. También podés enviar un mensaje desde el formulario."
          />
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-line bg-white p-6">
                <ul className="space-y-4 text-sm">
                  <li className="flex gap-3">
                    <MapPin className="h-5 w-5 text-brand-600" />
                    <span>
                      {site.address}, {site.city}, {site.province}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="h-5 w-5 text-brand-600" />
                    <a href={`tel:${site.phone}`}>{site.phone}</a>
                  </li>
                  <li className="flex gap-3">
                    <Mail className="h-5 w-5 text-brand-600" />
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </li>
                </ul>
                <a
                  href={whatsappUrl(site.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block"
                >
                  <Button variant="whatsapp">
                    <WhatsAppIcon className="h-4 w-4" />
                    Abrir WhatsApp
                  </Button>
                </a>
              </div>
              <div className="rounded-3xl border border-line bg-white p-6">
                <p className="font-semibold">Horarios de atención</p>
                <OpenStatusBadge hours={hours} className="mt-3" />
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {hours.regular.map((d) => (
                    <li key={d.day} className="flex justify-between gap-4">
                      <span>{d.day}</span>
                      <span>{d.closed ? 'Cerrado' : `${d.open} – ${d.close}`}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overflow-hidden rounded-3xl border border-line">
                {sanitizeMapEmbedUrl(site.mapEmbedUrl) ? (
                  <iframe
                    title="Mapa EcoVet"
                    src={sanitizeMapEmbedUrl(site.mapEmbedUrl)}
                    className="h-64 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <p className="p-6 text-sm text-muted">
                    Mapa no disponible. Consultá la dirección en Suipacha 250, Apóstoles.
                  </p>
                )}
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative rounded-[2rem] border border-line bg-white p-6 md:p-8"
            >
              <h2 className="font-display text-2xl font-semibold">Envianos un mensaje</h2>
              <div className="mt-6 grid gap-4">
                <Input label="Nombre" {...register('name')} error={errors.name?.message} />
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                  <input tabIndex={-1} autoComplete="off" {...register('website')} />
                </div>
                <Input
                  label="Correo"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Input label="Teléfono" {...register('phone')} error={errors.phone?.message} />
                <Textarea
                  label="Mensaje"
                  {...register('message')}
                  error={errors.message?.message}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
                </Button>
                {submitError && (
                  <p className="text-sm text-red-600" role="alert">
                    {submitError}
                  </p>
                )}
                {sent && (
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-brand-700">
                    <CheckCircle2 className="h-4 w-4" />
                    ¡Mensaje enviado! Te responderemos a la brevedad.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
