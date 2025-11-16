"use client";

import { useState } from "react";

export default function AffordableCarRental() {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = `
At Convoy Travels, we make city travel hassle-free by offering reliable rent a car Lahore with driver services. Whether you're flying in for a business trip, planning a family outing, or just need a comfortable ride across town, our fleet and professional chauffeurs are ready to serve. With local expertise and a customer-first approach, Convoy Travels ensures you get to your destination safely and comfortably. From economy cars to executive sedans and SUVs, we provide vehicles suited for every need accompanied by skilled drivers who know Lahore like the back of their hand.
`;

  const shortText = fullText.slice(0, 450) + "...";

  return (
    <section className="py-16 px-6 md:px-20 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* TEXT SIDE */}
        <div>
          <h2 className="text-[#1a2b5c] text-3xl md:text-4xl font-bold leading-snug mb-6">
            Rent a Car in Lahore with Driver
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

        {/* IMAGE SIDE */}
        <div className="relative flex justify-center">
          <div className="absolute -right-4 top-4 bg-[#1a2b5c] w-full h-full rounded-lg hidden md:block"></div>
          <img
            src="/abc.png"
            alt="Cars parked"
            className="relative rounded-lg w-full max-h-48 md:max-h-56 lg:max-h-64 object-cover shadow-lg"
          />
        </div>

      </div>
    </section>
  );
}
