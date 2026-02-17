import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Palas Berber | Erkek Kuaförü",
  description: "Palas Berber - Profesyonel erkek kuaförü ve online randevu sistemi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
