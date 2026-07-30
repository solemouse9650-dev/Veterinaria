import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SEO } from '@/components/seo/SEO'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Textarea } from '@/components/ui/Textarea'
import { useSite } from '@/contexts/SiteContext'
import { whatsappUrl } from '@/lib/utils'
import { createDoc, logActivity } from '@/services/firestore'

const schema = z.object({
  name: z.string().min(2, 'Ingresá tu nombre'),
  email: z.string().email('Correo inválido'),
  phone: z.string().min(6, 'Teléfono inválido'),
  message: z.string().min(10, 'Contanos un poco más'),
})

type FormData = z.infer<typeof schema>

export function Contact() {
  const { site, hours } = useSite()
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    await createDoc('clients', {
      ...data,
      type: 'contact',
      createdAt: new Date().toISOString(),
    })
    await logActivity('contacto', `${data.name} envió un mensaje de contacto`)
    setSent(true)
    reset()
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
                  rel="noreferrer"
                  className="mt-5 inline-block"
                >
                  <Button variant="whatsapp">Abrir WhatsApp</Button>
                </a>
              </div>
              <div className="rounded-3xl border border-line bg-white p-6">
                <p className="font-semibold">Horarios de atención</p>
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
                <iframe
                  title="Mapa EcoVet"
                  src={site.mapEmbedUrl}
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-[2rem] border border-line bg-white p-6 md:p-8"
            >
              <h2 className="font-display text-2xl font-semibold">Envianos un mensaje</h2>
              <div className="mt-6 grid gap-4">
                <Input label="Nombre" {...register('name')} error={errors.name?.message} />
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
