import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // Evitar filtrar stack traces en la interfaz.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
          <p className="font-display text-2xl font-semibold text-ink">
            No se pudo cargar esta vista
          </p>
          <p className="mt-2 max-w-md text-sm text-muted">
            Recargá la página. Si el problema sigue, escribinos por WhatsApp.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
