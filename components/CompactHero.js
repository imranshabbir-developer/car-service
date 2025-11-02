export default function CompactHero() {
  return (
    <section className="bg-gray-300 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-8 md:py-12 lg:py-14">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
          <img
            src="https://convoytravels.pk/wp-content/uploads/elementor/thumbs/721911-qiong1d2t31nsvzti80r5qrpns973gdv02iis0zbxc-r1bcy7ch2akd6t264paag0q2m1z3kmnghjfcxivyn4.png"
            alt="Rent Icon"
            className="w-full h-auto object-contain"
          />
        </div>

        <div>
          <p className="text-[#0b2850] text-sm md:text-base font-medium mb-1">
            1000 People Use Convoy Travels
          </p>
          <h1 className="text-[#0b2850] text-2xl md:text-4xl font-bold leading-tight">
            Top-Quality Rental Cars in Lahore
          </h1>
        </div>
      </div>

      <div className="mt-6 md:mt-0">
        <button className="border border-[#0b2850] text-[#0b2850] font-semibold px-6 md:px-10 py-2 md:py-3 rounded-lg hover:bg-[#0b2850] hover:text-white transition">
          Find Anything
        </button>
      </div>
    </section>
  );
}

