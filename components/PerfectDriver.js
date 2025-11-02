export default function PerfectDriver() {
  const vehicles = [
    {
      title: "Cars",
      img: "https://convoytravels.pk/wp-content/uploads/2024/03/Corrola.jpg",
    },
    {
      title: "4x4",
      img: "https://convoytravels.pk/wp-content/uploads/2024/01/Untitled-design-2024-02-02T213538.970.jpg",
    },
    {
      title: "Vans & Buses",
      img: "https://convoytravels.pk/wp-content/uploads/2024/03/Busses-1.jpg",
    },
  ];

  return (
    <section className="bg-white py-16 px-6 md:px-16 text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-[#0d1b2a] mb-12">
        Your Perfect Drive
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {vehicles.map((vehicle, index) => (
          <div
            key={index}
            className="border border-gray-300 shadow-sm rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="bg-white p-6 flex justify-center items-center">
              <img
                src={vehicle.img}
                alt={vehicle.title}
                className="h-48 md:h-56 object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="bg-[#0d1b2a] text-white text-lg font-medium py-3">
              {vehicle.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

