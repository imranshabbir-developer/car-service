"use client";

import { useState } from "react";

export default function OnlineCarBooking() {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = `
Booking your ideal car has never been easier with Convoy Travels’ online car booking for rent in Lahore. Our user-friendly website allows you to reserve a vehicle in just a few clicks, making it the go-to choice for those searching for a rent-a-car Lahore near-me solution. Here’s how simple it is:

Visit Our Website: Go to convoytravels.pk

On the Form Select Your Car: Choose the make of the car you are looking to rent in Lahore that suits your needs and budget.
Enter Booking Details: Fill in the pick-up date and drop-off date.
Browse Our Fleet: Explore the range of vehicles that are available based on your selected dates and the make of the vehicle you are looking for.
Select a car for rent in Lahore: Clicking a vehicle opens details regarding rental cost.
Request Booking: Select the “Request Booking” tab, enter your details, and press send.

With our rent-a-car Lahore self-drive options, you can enjoy the flexibility of picking up your car from a convenient location. Our fleet is updated and maintained to ensure availability. Experience convenient online booking and hit the road without delay with Convoy Travels.
`;

  const shortText = fullText.slice(0, 450) + "...";

  return (
    <section className="bg-[#f4f7fc] py-16 px-6 md:px-20 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">

        {/* IMAGE */}
        <div className="relative flex justify-center">
          <div className="absolute -left-4 top-4 bg-[#1a2b5c] w-full h-full rounded-lg hidden md:block"></div>
          <img
            src="/s1.gif"
            alt="Happy passenger in car"
            className="relative rounded-lg w-full max-h-48 md:max-h-56 lg:max-h-64 object-cover shadow-lg"
          />
        </div>

        {/* TEXT */}
        <div>
          <h2 className="text-[#1a2b5c] text-3xl md:text-4xl font-bold leading-snug mb-6">
            Online Car Booking for Rent in Lahore
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
