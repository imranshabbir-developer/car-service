export default function OnlineCarBooking() {
  return (
    <section className="bg-[#f4f7fc] py-16 px-6 md:px-20 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div className="relative flex justify-center">
          <div className="absolute -left-4 top-4 bg-[#1a2b5c] w-full h-full rounded-lg hidden md:block"></div>
          <img
            src="https://convoytravels.pk/wp-content/uploads/2021/07/Busses-1-1024x443-1.gif"
            alt="Happy passenger in car"
            className="relative rounded-lg w-full max-h-48 md:max-h-56 lg:max-h-64 object-cover shadow-lg"
          />
        </div>

        <div>
          <h2 className="text-[#1a2b5c] text-3xl md:text-4xl font-bold leading-snug mb-6">
            Rent a Car in Lahore With or <br /> Without Driver Prices
          </h2>
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            When it comes to freedom on the road, nothing beats driving a
            vehicle yourself. But finding a rent a car in Lahore without driver
            service isn't always easy—many providers only offer chauffeur-driven
            options. That's where Convoy Travels stands out. We proudly offer
            flexible rent a car in Lahore with or without driver, so you can
            travel on your terms.
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

