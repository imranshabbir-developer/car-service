'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export default function ReviewsSection() {
  const reviews = [
    {
      name: "Anum Ahmad",
      time: "1 month ago",
      stars: 4,
      text: "I rented a car from Convoy Travels without driver and had an excellent experience. The booking process was smooth and staff was helpful.",
      img: "https://lh3.googleusercontent.com/a/ACg8ocKKpvdT8TnFMYlpRQShDJ1oi2arNyLk9xo_cMG9j-IBxE3x4w=w40-h40-c-rp-mo-br100",
    },
    {
      name: "Azum Iqbal",
      time: "1 month ago",
      stars: 5,
      text: "We had a family gathering, so we went with the best car rental with driver from Convoy Travels. The driver was professional and the vehicle was clean.",
      img: "https://lh3.googleusercontent.com/a-/ALV-UjWUi07pGpQElI2OQCwm2gQKarPyyygGJLn5KeVQ4HEst-sq1hSCFg=w40-h40-c-rp-mo-ba3-br100",
    },
    {
      name: "Shabana Bin Fazal",
      time: "1 month ago",
      stars: 5,
      text: "Convoy Travels is hands down the best car rental service in Lahore! From the very first call, their team was professional and friendly.",
      img: "https://lh3.googleusercontent.com/a-/ALV-UjXNLK94kQ2059EIGx26Jq228oIcTtUh0bfyRd7KIJ0fwa4JSD4=w40-h40-c-rp-mo-ba2-br100",
    },
    {
      name: "Shabana Bin Fazal",
      time: "1 month ago",
      stars: 5,
      text: "Convoy Travels is hands down the best car rental service in Lahore! From the very first call, their team was professional and friendly.",
      img: "https://lh3.googleusercontent.com/a-/ALV-UjXNLK94kQ2059EIGx26Jq228oIcTtUh0bfyRd7KIJ0fwa4JSD4=w40-h40-c-rp-mo-ba2-br100",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-20 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        <div className="text-center lg:text-left lg:w-1/3">
          <h3 className="text-black text-xl font-semibold mb-2">EXCELLENT</h3>
          <div className="flex justify-center lg:justify-start mb-2">
            {Array(5)
              .fill()
              .map((_, i) => (
                <span key={i} className="text-yellow-400 text-2xl">
                  ★
                </span>
              ))}
          </div>
          <p className="text-gray-700 mb-2">
            Based on <span className="font-bold">102 reviews</span>
          </p>
          <img
            src="https://cdn.trustindex.io/assets/platform/Google/icon.svg"
            alt="Google"
            className="w-24 mx-auto lg:mx-0"
          />
        </div>

        <div className="lg:w-2/3 w-full">
          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            navigation={true}
            modules={[Navigation]}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-6"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index} className="scale-95">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 h-full flex flex-col justify-between">
                  <div className="flex items-center mb-2">
                    <img
                      src={review.img}
                      alt={review.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 flex items-center gap-1 text-sm">
                        {review.name}
                        <img
                          src="https://cdn.trustindex.io/assets/platform/Google/icon.svg"
                          alt="G"
                          className="w-3 h-3"
                        />
                      </h4>
                      <p className="text-xs text-gray-500">{review.time}</p>
                    </div>
                  </div>

                  <div className="flex mb-1">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <span
                          key={i}
                          className={`text-base ${
                            i < review.stars
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    <img
                      src="https://cdn.trustindex.io/assets/icon/ti-verified.svg"
                      alt="verified"
                      className="w-3 h-3 ml-1"
                    />
                  </div>

                  <p className="text-gray-600 text-xs mb-2 leading-relaxed">
                    {review.text}
                  </p>
                  <a
                    href="#"
                    className="text-gray-500 text-xs font-medium hover:underline"
                  >
                    Read more
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

