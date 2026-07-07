import { getSiteConfig, getSocialLinks } from '@/lib/queries/site-config'
import {
  getHeroSection, getSectionLabel,
  getActiveTestimonials, getActiveFaqs, getProcessSteps,
} from '@/lib/queries/content'
import { getFeaturedServices }               from '@/lib/queries/services'
import { getFeaturedPhotos, getPortfolioCategories } from '@/lib/queries/portfolio'

import { Navbar }              from '@/components/site/Navbar'
import { HeroSection }         from '@/components/site/HeroSection'
import { TrustBar }            from '@/components/site/TrustBar'
import { PortfolioSection }    from '@/components/site/PortfolioSection'
import { ServicesSection }     from '@/components/site/ServicesSection'
import { ProcessSection }      from '@/components/site/ProcessSection'
import { TestimonialsSection } from '@/components/site/TestimonialsSection'
import { FaqSection }          from '@/components/site/FaqSection'
import { CtaSection }          from '@/components/site/CtaSection'
import { Footer }              from '@/components/site/Footer'
import { WhatsAppButton }      from '@/components/site/WhatsAppButton'
import { RevealObserver }      from '@/components/site/RevealObserver'
import { FaqSchema }           from '@/components/site/SchemaOrg'
import { SITE_DEFAULTS }       from '@/config/site'

// ISR: regenerar la página cada 30 segundos en producción
export const revalidate = 30

export default async function HomePage() {
  const [
    config, hero, socials,
    services, photos, categories,
    testimonials, faqs, steps,
    servicesLabel, processLabel,
    testimonialsLabel, faqLabel,
  ] = await Promise.all([
    getSiteConfig(),
    getHeroSection(),
    getSocialLinks(),
    getFeaturedServices(),
    getFeaturedPhotos(),
    getPortfolioCategories(),
    getActiveTestimonials(),
    getActiveFaqs(),
    getProcessSteps(),
    getSectionLabel('services'),
    getSectionLabel('process'),
    getSectionLabel('testimonials'),
    getSectionLabel('faq'),
  ])

  const waNumber = config?.whatsapp_number     ?? SITE_DEFAULTS.whatsapp.number
  const waMsg    = config?.whatsapp_default_msg ?? SITE_DEFAULTS.whatsapp.message

  return (
    <>
      {/* FAQPage Schema para SEO */}
      {faqs.length > 0 && (
        <FaqSchema faqs={faqs.map(f => ({ question: f.question, answer: f.answer }))} />
      )}

      <RevealObserver />

      <Navbar
        logoUrl={config?.logo_url   ?? null}
        siteName={config?.site_name ?? SITE_DEFAULTS.name}
      />

      {hero && <HeroSection hero={hero} waNumber={waNumber} waMsg={waMsg} />}

      {config && <TrustBar config={config} />}

      <PortfolioSection
        photos={photos}
        categories={categories}
        label={null}
        waNumber={waNumber}
        waDefaultMsg={waMsg}
      />

      <ServicesSection
        services={services}
        label={servicesLabel}
        waNumber={waNumber}
        waDefaultMsg={waMsg}
      />

      <ProcessSection steps={steps} label={processLabel} />

      <TestimonialsSection testimonials={testimonials} label={testimonialsLabel} />

      <FaqSection faqs={faqs} label={faqLabel} waNumber={waNumber} />

      {config && (
        <CtaSection config={config} label={null} socialLinks={socials} />
      )}

      {config && <Footer config={config} />}

      {config?.whatsapp_float_visible !== false && (
        <WhatsAppButton number={waNumber} message={waMsg} />
      )}
    </>
  )
}
