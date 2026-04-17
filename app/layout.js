import "./globals.css";

export const metadata = {
  title: "VoiceBridge+ | Voice AI for Everyone",
  description: "Voice-first AI assistant for accessibility & task automation. Book appointments, check balances, and find scholarships — in your language.",
  keywords: "voice AI, accessibility, Hindi, Hinglish, doctor appointment, scholarship, VoiceBridge",
  openGraph: {
    title: "VoiceBridge+ | Voice AI for Everyone",
    description: "Bridging the gap between people and essential services through voice AI.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}