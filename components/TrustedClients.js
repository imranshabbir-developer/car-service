"use client";

import { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";

export default function TrustedClients() {
  const [slidesConfig, setSlidesConfig] = useState({
    slidesToShow: 4,
    arrows: true,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isBelow1024 = width < 1024;

      setSlidesConfig({
        slidesToShow: isBelow1024 ? 2 : 4,
        arrows: !isBelow1024,
      });
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const logos = [
    {
      src: "/t1.webp",
      alt: "World Health Organization",
    },
    {
      src: "/t2.webp",
      alt: "United Solar Group",
    },
    {
      src: "/t3.webp",
      alt: "Khyber Petroleum",
    },
    {
      src: "/t4.webp",
      alt: "Denim Factory",
    },
    {
      src: "/t5.webp",
      alt: "PAK-TURK MAARIF",
    },
    {
      src: "/t6.png",
      alt: "Gas Development Company",
    },
    {
      src: "/t7.webp",
      alt: "Lords College of Pharmacy",
    },
    {
      src: "/t8.webp",
      alt: "Eastern Group of Companies",
    },
    {
      src: "/t9.webp",
      alt: "National Engineering Services Pakistan",
    },
  ];

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 2500,
      slidesToShow: slidesConfig.slidesToShow,
      slidesToScroll: slidesConfig.slidesToShow === 2 ? 1 : 1,
      arrows: slidesConfig.arrows,
      pauseOnHover: true,
      cssEase: "ease-in-out",
    }),
    [slidesConfig]
  );

  return (
    <section className="bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-16 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0d1b2a] mb-6 sm:mb-8 md:mb-10 px-2">
        Trusted by our corporate clients:
      </h2>

      {/* Slider Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <Slider {...settings} className="trusted-clients-slider">
          {logos.map((logo, index) => (
            <div key={index}>
              <div className="flex items-center justify-center h-full px-2 md:px-3 lg:px-4">
                <div className="w-full flex items-center justify-center bg-white p-3 md:p-6 lg:p-8">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="w-full h-auto max-h-[120px] md:max-h-[140px] lg:max-h-[160px] object-contain"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <p className="text-gray-600 mt-12 sm:mt-14 md:mt-16 text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 px-4">
        Explore our fleet of top-quality.
      </p>
    </section>
  );
}
