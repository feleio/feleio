import { SiteHeader } from "@/components/sections/site-header"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Skills } from "@/components/sections/skills"
import { Education } from "@/components/sections/education"
import { Footer } from "@/components/sections/footer"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Education />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  )
}
