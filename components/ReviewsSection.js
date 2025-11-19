'use client';

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

export default function ReviewsSection() {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-gradient-to-b from-gray-50 to-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a2b5c] mb-4">
            What Our Customers Say
          </h2>
          <div className="w-20 h-1 bg-[#1a2b5c] mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
          {/* Rating Summary Section */}
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start lg:pr-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm border border-gray-100 h-[320px] flex flex-col justify-between">
              <div className="text-center lg:text-left mb-6">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  EXCELLENT
                </h3>
                <div className="flex justify-center lg:justify-start items-center gap-1 mb-3">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <FaStar
                        key={i}
                        className="text-yellow-400 text-xl sm:text-2xl"
                        fill="currentColor"
                      />
                    ))}
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Based on <span className="font-bold text-gray-900">102 reviews</span>
                </p>
              </div>
              
              <div className="flex justify-center lg:justify-start pt-4 border-t border-gray-200">
                <img
                  src="https://cdn.trustindex.io/assets/platform/Google/icon.svg"
                  alt="Google"
                  className="w-20 sm:w-24 h-auto"
                />
              </div>
            </div>
          </div>

          {/* Reviews Carousel Section */}
          <div className="w-full lg:w-2/3 relative">
            {/* Custom Navigation Buttons - Outside Carousel */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full shadow-lg border-2 flex items-center justify-center transition-all duration-300 group ${
                isBeginning
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  : 'btn-gradient-outline text-[#1a2b5c] hover:scale-110 hover:shadow-xl relative z-10'
              }`}
              aria-label="Previous review"
            >
              <FaChevronLeft className="text-lg lg:text-xl" />
            </button>
            
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full shadow-lg border-2 flex items-center justify-center transition-all duration-300 group ${
                isEnd
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  : 'btn-gradient-outline text-[#1a2b5c] hover:scale-110 hover:shadow-xl relative z-10'
              }`}
              aria-label="Next review"
            >
              <FaChevronRight className="text-lg lg:text-xl" />
            </button>

            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              slidesPerView={1}
              spaceBetween={20}
              navigation={false}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              className="reviews-swiper"
            >
              {reviews.map((review, index) => (
                <SwiperSlide key={index} className="h-auto">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-6 h-[320px] flex flex-col border border-gray-100 group">
                    {/* Review Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={review.img}
                          alt={review.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-[#1a2b5c] transition-all duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {review.name}
                          </h4>
                          <img
                            src="https://cdn.trustindex.io/assets/platform/Google/icon.svg"
                            alt="Google"
                            className="w-4 h-4 flex-shrink-0"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">{review.time}</p>
                      </div>
                    </div>

                    {/* Stars Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm sm:text-base ${
                              i < review.stars
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill={i < review.stars ? "currentColor" : "none"}
                          />
                        ))}
                      <img
                        src="https://cdn.trustindex.io/assets/icon/ti-verified.svg"
                        alt="verified"
                        className="w-4 h-4 ml-1 flex-shrink-0"
                      />
                    </div>

                    {/* Review Text */}
                    <div className="flex-1 mb-4 overflow-hidden">
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-4">
                        {review.text}
                      </p>
                    </div>

                    {/* Read More Link */}
                    <a
                      href="#"
                      className="text-[#1a2b5c] text-xs sm:text-sm font-medium hover:underline inline-flex items-center gap-1 self-start transition-colors"
                    >
                      Read more
                      <span className="text-[#1a2b5c]">→</span>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
