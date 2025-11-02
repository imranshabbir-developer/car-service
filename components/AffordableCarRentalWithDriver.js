export default function AffordableCarRentalWithDriver() {
  return (
    <section className="bg-[#e7ecf5] w-full h-full py-16 px-6 md:px-20 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div className="relative flex justify-center">
          <div className="absolute -left-4 top-4 bg-[#1a2b5c] w-full h-full rounded-lg hidden md:block"></div>
          <img
            src="https://convoytravels.pk/wp-content/uploads/2024/11/eco_1-scaled.jpg"
            alt="Car rental in Lahore"
            className="relative rounded-lg w-full max-h-74 md:max-h-92 lg:max-h-96 object-cover shadow-lg"
          />
        </div>

        <div>
          <h2 className="text-[#1a2b5c] text-2xl md:text-2xl font-bold leading-snug mb-6">
            Affordable Car Rental with Driver in Lahore – Transparent Pricing at
            Convoy Travels
          </h2>
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            Looking for clear and competitive rent a car in Lahore with driver
            prices? At Convoy Travels, we believe in offering exceptional value.
            Our rates are structured to be both affordable and transparent—no
            hidden charges, no surprises. We offer flexible packages for hourly,
            daily, and weekly rentals, with options for both within-city and
            outstation trips. Our car rental with driver Lahore services include
            fuel, tolls, and courteous support—so you can focus on the journey,
            not the logistics.
            <br />
            <br />
            Choose Convoy Travels for dependable Lahore car rental with driver
            services that prioritize your comfort, convenience, and time.
          </p>

          <a
            href="#"
            className="text-[#1a2b5c] font-semibold hover:underline text-base"
          >
            Read More
          </a>
        </div>
      </div>
    </section>
  );
}

