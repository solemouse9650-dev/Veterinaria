import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { About } from '@/pages/About'
import { Blog } from '@/pages/Blog'
import { BlogPost } from '@/pages/BlogPost'
import { Booking } from '@/pages/Booking'
import { Contact } from '@/pages/Contact'
import { FAQPage } from '@/pages/FAQ'
import { Gallery } from '@/pages/Gallery'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { ServiceDetail } from '@/pages/ServiceDetail'
import { Services } from '@/pages/Services'
import { Specialties } from '@/pages/Specialties'
import { Team } from '@/pages/Team'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminLogin } from '@/pages/admin/Login'
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { ReservationsAdmin } from '@/pages/admin/ReservationsAdmin'
import { ServicesAdmin } from '@/pages/admin/ServicesAdmin'
import { TeamAdmin } from '@/pages/admin/TeamAdmin'
import { GalleryAdmin } from '@/pages/admin/GalleryAdmin'
import { BlogAdmin } from '@/pages/admin/BlogAdmin'
import { FAQAdmin } from '@/pages/admin/FAQAdmin'
import { HoursAdmin } from '@/pages/admin/HoursAdmin'
import { HeroAdmin } from '@/pages/admin/HeroAdmin'
import { TestimonialsAdmin } from '@/pages/admin/TestimonialsAdmin'
import { SiteAdmin } from '@/pages/admin/SiteAdmin'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="nosotros" element={<About />} />
          <Route path="servicios" element={<Services />} />
          <Route path="servicios/:slug" element={<ServiceDetail />} />
          <Route path="especialidades" element={<Specialties />} />
          <Route path="equipo" element={<Team />} />
          <Route path="galeria" element={<Gallery />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="reservas" element={<Booking />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="preguntas-frecuentes" element={<FAQPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="reservas" element={<ReservationsAdmin />} />
          <Route path="servicios" element={<ServicesAdmin />} />
          <Route path="equipo" element={<TeamAdmin />} />
          <Route path="galeria" element={<GalleryAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="faqs" element={<FAQAdmin />} />
          <Route path="horarios" element={<HoursAdmin />} />
          <Route path="hero" element={<HeroAdmin />} />
          <Route path="testimonios" element={<TestimonialsAdmin />} />
          <Route path="sitio" element={<SiteAdmin />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
