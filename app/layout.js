import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// Heading font - Javanese/elegant feel
const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

// Body font - Modern and readable
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Natal Gabungan 2025 | Padhang Ing Tengahing Peteng",
  description: "Perayaan Natal dengan nuansa budaya Jawa di SMK PGRI 1 Kediri. Tema: Padhang Ing Tengahing Peteng - Terang di Tengah Kegelapan.",
  keywords: ["Natal", "SMK PGRI 1 Kediri", "Event", "Jawa", "Christmas", "Kediri"],
  authors: [{ name: "Fellowship SMK PGRI 1 Kediri" }],
  openGraph: {
    title: "Natal Gabungan 2025",
    description: "Padhang Ing Tengahing Peteng - Terang di Tengah Kegelapan",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="icon" href="/Picture1.webp" />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-[#0F0F0F] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
