import type { Metadata } from "next"
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

export const metadata: Metadata = {
  title: "Chun Lok Ling — Senior Software Engineer",
  description:
    "Senior Software Engineer at Digital Asset. 15+ years building distributed ledgers and high-performance financial systems — a force-directed view of a 15-year topology.",
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
        {children}
      </body>
    </html>
  )
}
