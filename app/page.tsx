import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Skills } from "@/components/sections/skills"
import { Education } from "@/components/sections/education"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Education />
      <Footer />
    </main>
  )
}
