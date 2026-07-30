import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { WhatsAppButton } from './WhatsAppButton'
import { SchemaOrg } from '@/components/seo/SchemaOrg'

export function Layout() {
  return (
    <div className="min-h-screen">
      <SchemaOrg />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
