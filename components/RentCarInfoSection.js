"use client";

import { useState } from "react";

export default function RentCarInfoSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = `
When it comes to freedom on the road, nothing beats driving a vehicle yourself. But finding a rent a car in Lahore without driver service isn’t always easy—many providers only offer chauffeur-driven options. That’s where Convoy Travels stands out. We proudly offer flexible rent a car in Lahore with or without driver, so you can travel on your terms.
Say goodbye to rigid schedules and enjoy the liberty of driving yourself, or choose the convenience of a professional driver for a stress-free ride. Whether you're planning a weekend getaway or attending a business meeting, Convoy Travels has a vehicle to meet your needs.
We offer a wide selection of cars—everything from economy vehicles for budget-friendly travel to luxury sedans for premium comfort. Our transparent pricing ensures you always know what you’re paying for, whether you choose a self-drive option or a car with a driver.
Booking is easy with our user-friendly online system. With Convoy Travels, finding a reliable rent a car in Lahore—with or without driver—has never been more accessible.
`;

  const shortText = fullText.slice(0, 450) + "...";

  return (
    <section className="bg-[#e7ecf5] py-16 px-6 md:px-20 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* IMAGE */}
        <div className="relative flex justify-center">
          <div className="absolute -left-4 top-4 bg-[#1a2b5c] w-full h-full rounded-lg hidden md:block"></div>
          <img
            src="/girl.webp"
            alt="Happy passenger in car"
            className="relative rounded-lg w-full max-h-48 md:max-h-56 lg:max-h-64 object-cover shadow-lg"
          />
        </div>

        {/* TEXT */}
        <div>
          <h2 className="text-[#1a2b5c] text-3xl md:text-4xl font-bold leading-snug mb-6">
            Rent a Car in Lahore With or <br /> Without Driver Prices
          </h2>

          <p className="text-gray-600 text-base leading-relaxed mb-6">
            {isExpanded ? fullText : shortText}
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#1a2b5c] font-semibold hover:underline text-base"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>

      </div>
    </section>
  );
}
