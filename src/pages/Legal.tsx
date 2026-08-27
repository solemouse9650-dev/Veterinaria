import { LegalDocument } from '@/components/legal/LegalDocument'
import {
  LEGAL_UPDATED,
  cookiesSections,
  noticeSections,
  privacySections,
  termsSections,
} from '@/data/legal'

export function TermsPage() {
  return (
    <LegalDocument
      title="Términos y condiciones"
      description="Términos de uso del sitio de EcoVet Clínica Veterinaria."
      path="/terminos-y-condiciones"
      updated={LEGAL_UPDATED}
      intro="Estas condiciones describen el uso del sitio web de EcoVet Clínica Veterinaria en Apóstoles, Misiones."
      sections={termsSections}
    />
  )
}

export function PrivacyPage() {
  return (
    <LegalDocument
      title="Política de privacidad"
      description="Cómo EcoVet trata los datos personales enviados por el sitio."
      path="/politica-de-privacidad"
      updated={LEGAL_UPDATED}
      intro="Explica qué datos recolecta este sitio, para qué se usan y cómo podés ejercer tus derechos."
      sections={privacySections}
    />
  )
}

export function CookiesPage() {
  return (
    <LegalDocument
      title="Política de cookies"
      description="Cookies y almacenamiento local utilizados por el sitio de EcoVet."
      path="/politica-de-cookies"
      updated={LEGAL_UPDATED}
      intro="Describe únicamente las tecnologías de almacenamiento que este sitio usa en la práctica. No se inventan herramientas de analítica."
      sections={cookiesSections}
    />
  )
}

export function LegalNoticePage() {
  return (
    <LegalDocument
      title="Aviso legal"
      description="Información del titular del sitio de EcoVet Clínica Veterinaria."
      path="/aviso-legal"
      updated={LEGAL_UPDATED}
      intro="Datos de identificación del sitio y alcance de la información publicada."
      sections={noticeSections}
    />
  )
}
