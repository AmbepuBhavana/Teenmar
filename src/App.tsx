import { BrandStory } from './components/BrandStory'
import { ContactSection } from './components/ContactSection'
import { FloatingCallButton } from './components/FloatingCallButton'
import { Footer } from './components/Footer'
import { GallerySection } from './components/GallerySection'
import { HeroSection } from './components/HeroSection'
import { MenuSection } from './components/MenuSection'
import { Navbar } from './components/Navbar'
import { RestaurantExperience } from './components/RestaurantExperience'
import { SignatureDishes } from './components/SignatureDishes'
import { DEMO_MODE } from './data/restaurant'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <BrandStory />
        <SignatureDishes />
        <MenuSection />
        <GallerySection />
        <RestaurantExperience />
        <ContactSection />
      </main>
      <Footer />
      <FloatingCallButton />
      {DEMO_MODE ? (
        <div className="fixed bottom-4 left-4 z-20 rounded-full border border-[rgba(217,164,65,.5)] bg-[rgba(23,11,8,.8)] px-3 py-1.5 font-sans text-xs text-[#D9A441] pointer-events-none print:hidden">
          Demo preview
        </div>
      ) : null}
    </>
  )
}
