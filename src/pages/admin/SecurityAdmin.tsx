import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'

const schema = z
  .object({
    currentPassword: z.string().min(6, 'Ingresá tu contraseña actual'),
    newPassword: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Za-z]/, 'Debe incluir letras')
      .regex(/[0-9]/, 'Debe incluir al menos un número'),
    confirmPassword: z.string().min(8, 'Confirmá la nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'La nueva contraseña debe ser distinta a la actual',
    path: ['newPassword'],
  })

type FormData = z.infer<typeof schema>

export function SecurityAdmin() {
  const { changePassword, user } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setError('')
    setSuccess('')
    try {
      await changePassword(data.currentPassword, data.newPassword)
      reset()
      setSuccess('Contraseña actualizada correctamente.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cambiar la contraseña')
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          Seguridad
        </h1>
        <p className="text-muted">
          Cambiá la contraseña del panel. No compartas tus credenciales.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5">
        <p className="text-sm text-muted">Cuenta activa</p>
        <p className="font-semibold text-ink">{user?.email}</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-line bg-white p-5"
        autoComplete="off"
      >
        <Input
          label="Contraseña actual"
          type="password"
          autoComplete="current-password"
          {...register('currentPassword')}
          error={errors.currentPassword?.message}
        />
        <Input
          label="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />
        <Input
          label="Confirmar nueva contraseña"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800">
            {success}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Cambiar contraseña'}
        </Button>
      </form>
    </div>
  )
}
