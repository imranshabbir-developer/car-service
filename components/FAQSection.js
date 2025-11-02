'use client';

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function FAQSection() {
  const faqs = [
    {
      question: "Is it cheaper to rent a car at the airport or in the city?",
      answer:
        "Generally, renting in the city is cheaper than at the airport due to lower fees and surcharges.",
    },
    {
      question:
        "Can I pick up at the airport and drop off at a different location?",
      answer:
        "Yes, Convoy Travels offers flexible pick-up and drop-off options across multiple locations.",
    },
    {
      question: "How much does self-drive cost per day in Lahore?",
      answer:
        "Self-drive rentals in Lahore typically start around PKR 5,000 per day depending on vehicle type.",
    },
    {
      question: "Can I extend my self-drive rental?",
      answer:
        "Yes, you can extend your rental easily by contacting our support team before your return date.",
    },
    {
      question: "What documents are required to rent a car with driver?",
      answer:
        "You just need a valid CNIC or passport and basic contact details to confirm your booking.",
    },
    {
      question: "What are the typical daily rates for chauffeur-driven cars?",
      answer:
        "Rates vary from PKR 7,000 to 15,000 per day depending on the car category and trip distance.",
    },
    {
      question: "Are fuel, tolls, and driver charges included?",
      answer:
        "Usually, packages are exclusive of fuel and tolls. Driver charges depend on your selected plan.",
    },
    {
      question: "Can I book hourly and outstation trips with a driver?",
      answer:
        "Yes, Convoy Travels offers both hourly and outstation chauffeur-driven car services.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 px-6 md:px-16 bg-white">
      <h2 className="text-[#0b2850] text-2xl md:text-4xl font-semibold text-center mb-8">
        Rent a Car in Lahore Frequently Asked Questions (FAQ's)
      </h2>

      <div className="max-w-5xl mx-auto border border-gray-300 rounded-md divide-y divide-gray-300">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="cursor-pointer hover:bg-gray-50 transition"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center px-4 py-4">
              <p className="text-gray-800 text-sm md:text-base font-medium">
                {faq.question}
              </p>
              <FaChevronDown
                className={`text-gray-600 transform transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </div>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-600 text-sm md:text-base leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

