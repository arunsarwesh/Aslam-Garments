import "./globals.css"
import 'swiper/css';
import 'react-toastify/dist/ReactToastify.css';
import { NextUIProvider } from "@nextui-org/react"; // Import NextUIProvider

export const metadata = {
  title: 'Renz Trending',
  description: 'Shop the latest in fashion with Renz Trending. Discover quality garments from Aslam Garments, your trusted clothing brand for trendy and affordable clothing in our online factory outlet.',
  keywords: 'Aslam garments, Renz Trending, ecommerce, factory outlet, online shopping, clothing brand, fashion, affordable clothing, trendy wear, shop fashion, garment industry, renz, Renz, Titan Dev, TitanDev, TitanNatesan, Titan Natesan, Titan, Natesan, Natesan Titan'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://renz-trending.titandev.me" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />

        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.0.0/uicons-regular-straight/css/uicons-regular-straight.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&family=Lexend:wght@100..900&display=swap" />

      </head>
      <body>
        {/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  )
}
