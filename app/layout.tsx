import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { headers } from 'next/headers'

import { ThemeProvider } from "../components/theme-provider"
import { detectLangFromHeader, getSeoContent } from "@/lib/seo"

import "./globals.css"

// New import for Providers
import { Providers } from "./providers"


const inter = Inter({ subsets: ["latin"] })

const siteUrl = "https://www.haru2end.com"
const ogImage = `${siteUrl}/og-image.png`

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const lang = detectLangFromHeader(headersList.get("accept-language"))
  const seo = getSeoContent(lang)

  const localeByLang = {
    ko: "ko_KR",
    en: "en_US",
    ja: "ja_JP",
    zh: "zh_CN",
  } as const
  const alternateLocales = Object.entries(localeByLang)
    .filter(([key]) => key !== lang)
    .map(([, value]) => value)

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.title,
      template: `%s | ${seo.siteName}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: siteUrl,
      siteName: seo.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.siteName} preview image`,
        },
      ],
      locale: seo.ogLocale,
      alternateLocale: alternateLocales,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        "ko-KR": `${siteUrl}/?lang=ko`,
        "en-US": `${siteUrl}/?lang=en`,
        "ja-JP": `${siteUrl}/?lang=ja`,
        "zh-CN": `${siteUrl}/?lang=zh`,
        "x-default": siteUrl,
      },
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const lang = detectLangFromHeader(headersList.get('accept-language'))
  const seo = getSeoContent(lang)

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KS38JN7W');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: seo.siteName,
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: seo.orgName,
              url: siteUrl,
              logo: `${siteUrl}/icon-512x512.png`
            })
          }}
        />
         <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "author": {
                "@type": "Organization",
                "name": seo.articleAuthor
              },
              "headline": seo.title,
              "description": seo.description,
              "image": ogImage,
              "publisher": {
                "@type": "Organization",
                "name": seo.orgName,
                "logo": {
                  "@type": "ImageObject",
                  "url": `${siteUrl}/icon-512x512.png`
                }
              }
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KS38JN7W"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
