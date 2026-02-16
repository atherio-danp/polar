import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = "https://polar.codewrinkles.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Polar — Watch How Opinions Form, Spread, and Divide",
    template: "%s | Polar",
  },
  description:
    "An interactive simulator showing how people's opinions change when they talk, consume media, and encounter disagreement. Pick a society type — from open democracy to culture war — press Play, and watch polarization, echo chambers, or consensus emerge from simple rules. Powered by real social science models with AI commentary.",
  keywords: [
    "opinion dynamics",
    "polarization simulator",
    "bounded confidence model",
    "echo chambers",
    "social simulation",
    "Deffuant model",
    "belief formation",
    "political polarization",
    "filter bubbles",
    "agent-based model",
    "interactive simulation",
    "social science",
  ],
  authors: [{ name: "Codewrinkles" }],
  creator: "Codewrinkles",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Polar",
    title: "Polar — Watch How Opinions Form, Spread, and Divide",
    description:
      "An interactive simulator showing how people's opinions change through conversation, media, and disagreement. Based on real social science models with AI-powered commentary.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Polar — an interactive opinion dynamics simulator showing dots clustering and dividing on a 2D scatter plot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Polar — Watch How Opinions Form, Spread, and Divide",
    description:
      "An interactive simulator showing how people's opinions change through conversation, media, and disagreement. Based on real social science models with AI-powered commentary.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Polar",
    url: SITE_URL,
    description:
      "An interactive simulator showing how people's opinions change when they talk, consume media, and encounter disagreement. Based on bounded-confidence models from social science.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Codewrinkles",
      url: "https://codewrinkles.com",
    },
    about: [
      {
        "@type": "Thing",
        name: "Opinion dynamics",
        description: "The study of how opinions form and change through social interaction",
      },
      {
        "@type": "Thing",
        name: "Political polarization",
        description: "The divergence of political attitudes toward ideological extremes",
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
