"use client";

import { useState } from "react";

export default function AffordableRentCarSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = `
Looking for an affordable and convenient way to travel around Lahore? At Convoy Travels, we offer budget-friendly rent a car in Lahore with or without driver to match your needs. Whether you prefer the freedom of driving yourself or the comfort of a chauffeur-driven ride, we’ve got you covered with transparent pricing and reliable service.

Our flexible rental plans are designed to suit every budget and travel style. Choose from a wide range of vehicles—from economical cars for daily use to premium options for business or leisure travel. Whether you're a local or a tourist, our car rental services in Lahore offer both self-drive and with-driver options to give you complete control and convenience.

All our cars are well-maintained and regularly inspected for safety and performance. Plus, with our easy online booking system, you can reserve your car in minutes—no hassle, no hidden charges. Experience the best of Lahore with Convoy Travels – your trusted partner for rent a car services in Lahore.
`;

  const shortText = fullText.slice(0, 550) + "...";

  return (
    <section className="py-16 px-6 md:px-20 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div>
          <h2 className="text-[#1a2b5c] text-3xl md:text-4xl font-bold leading-snug mb-6">
            Affordable Rent a Car in Lahore
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

        <div className="relative flex justify-center">
          <div className="absolute -right-4 top-4 bg-[#1a2b5c] w-full h-full rounded-lg hidden md:block"></div>
          <img
            src="/s2.webp"
            alt="Cars parked"
            className="relative rounded-lg w-full max-h-48 md:max-h-56 lg:max-h-64 object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
