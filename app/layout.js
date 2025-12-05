import ConditionalLayout from "@/components/ConditionalLayout";
import Script from "next/script";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css";
import "swiper/css/navigation";

export const metadata = {
  title: "Convoy Travels - Rent a Car in Lahore",
  description: "Rent a car in Lahore with or without driver. Affordable car rental services.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "rnWeToOa_ED1J9NwEYe6omABuuJ4s2-dudf1JVJmM0M",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="rnWeToOa_ED1J9NwEYe6omABuuJ4s2-dudf1JVJmM0M"
        />
      </head>
      <body suppressHydrationWarning>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0NZQWLFL7B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0NZQWLFL7B');
          `}
        </Script>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
