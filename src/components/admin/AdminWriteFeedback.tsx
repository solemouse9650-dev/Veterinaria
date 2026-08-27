import { useState } from 'react'
import { writeErrorMessage } from '@/lib/adminWrite'

export function useAdminWrite() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const run = async (action: () => Promise<void>) => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await action()
      setSuccess('Los cambios se guardaron correctamente.')
      return true
    } catch (err) {
      setError(writeErrorMessage(err))
      return false
    } finally {
      setSaving(false)
    }
  }

  return { saving, error, success, run }
}

export function AdminWriteFeedback({
  error,
  success,
}: {
  error: string
  success: string
}) {
  if (error) {
    return (
      <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
        {error}
      </p>
    )
  }
  if (success) {
    return (
      <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800">
        {success}
      </p>
    )
  }
  return null
}
