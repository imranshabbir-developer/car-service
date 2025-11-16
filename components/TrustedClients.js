"use client";

import Slider from "react-slick";

export default function TrustedClients() {
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
      src: "/t6.webp",
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

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
              <div className="flex items-center justify-center h-full px-2 sm:px-4 md:px-6">
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 hover:bg-gray-100 transition-colors duration-300">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="w-full h-auto max-h-16 object-contain"
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
