import { zodResolver } from '@hookform/resolvers/zod'
import { PawPrint } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export function AdminLogin() {
  const { login, resetPassword, user, loading, isAdmin } = useAuth()
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = async (data: FormData) => {
    setError('')
    setInfo('')
    try {
      await login(data.email, data.password)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión')
    }
  }

  const onReset = async () => {
    setError('')
    setInfo('')
    const email = getValues('email')
    if (!email) {
      setError('Ingresá tu correo para recuperar la contraseña')
      return
    }
    try {
      await resetPassword(email)
      setInfo('Te enviamos un correo para restablecer la contraseña.')
    } catch {
      setError('No pudimos enviar el correo de recuperación.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-900 via-ink to-brand-800 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <PawPrint className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">EcoVet Admin</h1>
            <p className="text-sm text-muted">Acceso autorizado</p>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            label="Correo"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Contraseña"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-brand-700">{info}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
          </Button>
          <button
            type="button"
            onClick={() => void onReset()}
            className="w-full text-sm font-medium text-brand-700 hover:underline"
          >
            Recuperar contraseña
          </button>
        </div>
      </form>
    </div>
  )
}
