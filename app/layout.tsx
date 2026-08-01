import type { Metadata, Viewport } from "next"
import { Sora, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
})

const TITLE = "Chun Lok Ling — Senior Software Engineer"
const DESCRIPTION =
  "Senior Software Engineer at Digital Asset. 15+ years building distributed ledgers and high-performance financial systems — a force-directed view of a 15-year topology."

export const metadata: Metadata = {
  metadataBase: new URL("https://fele.io"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "fele.io",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: "#0A0B12",
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Chun Lok Ling",
  url: "https://fele.io",
  jobTitle: "Senior Software Engineer",
  worksFor: { "@type": "Organization", name: "Digital Asset" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "The Hong Kong University of Science and Technology",
  },
  knowsAbout: [
    "Distributed Systems",
    "Distributed Ledger Technology",
    "Scala",
    "Java",
    "TypeScript",
    "Kubernetes",
  ],
  sameAs: [
    "https://www.linkedin.com/in/chun-lok-ling-195a923b",
    "https://github.com/feleio",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Font variables live on <html> so :root-level CSS vars can resolve them.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${plexMono.variable}`}
    >
      <body className="antialiased">
        {/* Mark JS as active before paint so the reveal system never flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  )
}
