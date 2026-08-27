const WINDOW_MS = 20_000
const storageKey = (form: string) => `ecovet_form_${form}`

/** Límite local contra reenvíos accidentales o scripts triviales. No reemplaza App Check. */
export function assertPublicFormAllowed(formId: string, websiteHoneypot: string) {
  if (websiteHoneypot.trim()) {
    throw new Error('No se pudo enviar el formulario.')
  }
  try {
    const raw = sessionStorage.getItem(storageKey(formId))
    const last = raw ? Number(raw) : 0
    if (last && Date.now() - last < WINDOW_MS) {
      throw new Error('Esperá unos segundos antes de volver a enviar.')
    }
    sessionStorage.setItem(storageKey(formId), String(Date.now()))
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Esperá')) throw error
  }
}
