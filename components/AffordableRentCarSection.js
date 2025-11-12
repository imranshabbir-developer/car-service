export default function AffordableRentCarSection() {
  return (
    <section className="py-16 px-6 md:px-20 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div>
          <h2 className="text-[#1a2b5c] text-3xl md:text-4xl font-bold leading-snug mb-6">
            Affordable Rent a Car in Lahore
          </h2>
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            Looking for an affordable and convenient way to travel around
            Lahore? At Convoy Travels, we offer budget-friendly rent a car in
            Lahore with or without driver to match your needs. Whether you
            prefer the freedom of driving yourself or the comfort of a
            chauffeur-driven ride, we&apos;ve got you covered with transparent
            pricing and reliable service.
          </p>

          <a
            href="#"
            className="text-[#1a2b5c] font-semibold hover:underline text-base"
          >
            Read More
          </a>
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

