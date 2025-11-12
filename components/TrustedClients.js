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
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="bg-white py-16 px-6 md:px-16 text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-[#0d1b2a] mb-10">
        Trusted by our corporate clients:
      </h2>

      {/* Slider Section */}
      <div className="max-w-6xl mx-auto">
        <Slider {...settings}>
          {logos.map((logo, index) => (
            <div key={index} className="px-8">
              <img
                src={logo.src}
                alt={logo.alt}
                className="mx-auto h-24 md:h-28 object-contain"
              />
            </div>
          ))}
        </Slider>
      </div>

      <p className="text-gray-600 mt-10 text-base md:text-lg flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#0d1b2a]"></span>
        Explore our fleet of top-quality.
      </p>
    </section>
  );
}
