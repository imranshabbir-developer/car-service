import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSocialBar from "@/components/FloatingSocialBar";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css";
import "swiper/css/navigation";

export const metadata = {
  title: "Convoy Travels - Rent a Car in Lahore",
  description: "Rent a car in Lahore with or without driver. Affordable car rental services.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
        <FloatingSocialBar />
      </body>
    </html>
  );
}

