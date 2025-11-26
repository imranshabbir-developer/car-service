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
  const [expandedReviews, setExpandedReviews] = useState({});

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
      text: "Convoy Travels is hands down the best car rental service in Lahore! From the very first call, their team was professional and friendly. The car was in perfect condition and the pricing was very reasonable. I highly recommend them for anyone looking for reliable car rental services.",
      img: "https://lh3.googleusercontent.com/a-/ALV-UjXNLK94kQ2059EIGx26Jq228oIcTtUh0bfyRd7KIJ0fwa4JSD4=w40-h40-c-rp-mo-ba2-br100",
    },
    {
      name: "Muhammad Ali",
      time: "2 months ago",
      stars: 5,
      text: "Outstanding service! I booked a luxury vehicle for a business trip and was impressed by the quality and cleanliness of the car. The customer support team was responsive and helped me with all my queries. Will definitely use their services again.",
      img: "https://lh3.googleusercontent.com/a-/ALV-UjWUi07pGpQElI2OQCwm2gQKarPyyygGJLn5KeVQ4HEst-sq1hSCFg=w40-h40-c-rp-mo-ba3-br100",
    },
    {
      name: "Fatima Khan",
      time: "2 months ago",
      stars: 5,
      text: "Perfect experience from start to finish! The online booking was easy, and when I arrived to pick up the car, everything was ready. The vehicle was spotless and well-maintained. Great value for money and excellent customer service.",
      img: "https://lh3.googleusercontent.com/a/ACg8ocKKpvdT8TnFMYlpRQShDJ1oi2arNyLk9xo_cMG9j-IBxE3x4w=w40-h40-c-rp-mo-br100",
    },
    {
      name: "Ahmed Hassan",
      time: "3 months ago",
      stars: 5,
      text: "Convoy Travels made our family vacation so much easier! We rented a van for our trip to Northern Pakistan and it was perfect. The car was comfortable, reliable, and the staff was very accommodating with our schedule changes. Highly recommended!",
      img: "https://lh3.googleusercontent.com/a-/ALV-UjXNLK94kQ2059EIGx26Jq228oIcTtUh0bfyRd7KIJ0fwa4JSD4=w40-h40-c-rp-mo-ba2-br100",
    },
    {
      name: "Sara Malik",
      time: "3 months ago",
      stars: 4,
      text: "Good service overall. The car was clean and in good condition. The booking process was straightforward, though I wish there were more vehicle options available. The staff was helpful and professional throughout.",
      img: "https://lh3.googleusercontent.com/a-/ALV-UjWUi07pGpQElI2OQCwm2gQKarPyyygGJLn5KeVQ4HEst-sq1hSCFg=w40-h40-c-rp-mo-ba3-br100",
    },
    {
      name: "Usman Sheikh",
      time: "1 month ago",
      stars: 5,
      text: "Excellent car rental service! I've used Convoy Travels multiple times now and they never disappoint. The cars are always well-maintained, the prices are competitive, and the customer service is top-notch. They've become my go-to car rental company in Lahore.",
      img: "https://lh3.googleusercontent.com/a/ACg8ocKKpvdT8TnFMYlpRQShDJ1oi2arNyLk9xo_cMG9j-IBxE3x4w=w40-h40-c-rp-mo-br100",
    },
  ];

  const toggleReview = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
          <div className="w-full lg:w-2/3 relative px-8 sm:px-12 md:px-16 lg:px-0">
            {/* Custom Navigation Buttons - Improved for Mobile and Desktop */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className={`absolute left-0 sm:-left-2 md:-left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
                isBeginning
                  ? 'bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-white border-2 border-[#1a2b5c] text-[#1a2b5c] hover:bg-[#1a2b5c] hover:text-white hover:scale-110 hover:shadow-2xl active:scale-95'
              }`}
              aria-label="Previous review"
            >
              <FaChevronLeft className="text-base sm:text-lg md:text-xl" />
            </button>
            
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className={`absolute right-0 sm:-right-2 md:-right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
                isEnd
                  ? 'bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-white border-2 border-[#1a2b5c] text-[#1a2b5c] hover:bg-[#1a2b5c] hover:text-white hover:scale-110 hover:shadow-2xl active:scale-95'
              }`}
              aria-label="Next review"
            >
              <FaChevronRight className="text-base sm:text-lg md:text-xl" />
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
                  <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col border border-gray-100 group ${
                    expandedReviews[index] ? 'min-h-[320px]' : 'h-[320px]'
                  }`}>
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
                      <p className={`text-gray-700 text-sm sm:text-base leading-relaxed ${
                        expandedReviews[index] ? '' : 'line-clamp-4'
                      }`}>
                        {review.text}
                      </p>
                    </div>

                    {/* Read More/Read Less Button */}
                    {review.text.length > 100 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReview(index);
                        }}
                        className="group relative inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#1a2b5c] bg-gradient-to-r from-blue-50 to-indigo-50 border border-[#1a2b5c]/20 rounded-lg hover:from-[#1a2b5c] hover:to-[#0d1b2a] hover:text-white hover:border-[#1a2b5c] transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1a2b5c] focus:ring-offset-2 self-start"
                      >
                        <span>{expandedReviews[index] ? 'Read less' : 'Read more'}</span>
                        <span className={`inline-flex items-center justify-center w-4 h-4 transition-all duration-300 ${
                          expandedReviews[index] 
                            ? 'rotate-90 translate-x-0' 
                            : 'group-hover:translate-x-0.5'
                        }`}>
                          <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M9 5l7 7-7 7" 
                            />
                          </svg>
                        </span>
                      </button>
                    )}
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
