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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${plexMono.variable} antialiased`}>
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
