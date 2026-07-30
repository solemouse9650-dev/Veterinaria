import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Logo } from '@/components/brand/Logo'
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
  const { login, resetPassword, user, loading, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin', { replace: true })
    }
  }, [loading, user, isAdmin, navigate])

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
      // Si hay otra sesión no autorizada, la cerramos primero
      if (user && !isAdmin) {
        await logout()
      }
      await login(data.email, data.password)
      navigate('/admin', { replace: true })
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-900 via-ink to-brand-700 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-[2rem] border border-line bg-white p-8 shadow-2xl"
        noValidate
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo imgClassName="h-20 w-20" />
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-brand-700">
            EcoVet Admin
          </h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-500">
            Acceso autorizado
          </p>
        </div>
        <div className="space-y-4">
          <Input
            label="Correo"
            type="email"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
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
