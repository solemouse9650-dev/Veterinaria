export function writeErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error && 'code' in error
      ? String((error as { code: string }).code)
      : ''

  if (
    code === 'permission-denied' ||
    code === 'storage/unauthorized' ||
    code === 'storage/unauthorized-app'
  ) {
    return 'No se pudo guardar. La sesión no tiene permiso de escritura. En Firebase Console publicá las reglas actualizadas de Firestore y Storage.'
  }
  if (code === 'unauthenticated' || code === 'storage/unauthenticated') {
    return 'La sesión expiró. Volvé a iniciar sesión e intentá de nuevo.'
  }
  if (code === 'unavailable' || code === 'storage/retry-limit-exceeded') {
    return 'El servicio no respondió. Revisá la conexión e intentá de nuevo.'
  }
  if (error instanceof Error && error.message.includes('no está disponible')) {
    return error.message
  }
  return 'No se pudo guardar. Intentá de nuevo.'
}
