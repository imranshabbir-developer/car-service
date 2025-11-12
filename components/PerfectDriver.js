import "./perfect-driver.css";

export default function PerfectDriver() {
  const vehicles = [
    {
      title: "Cars",
      img: "https://americ41.in1.fcomet.com/wp-content/uploads/2024/03/Corrola.jpg",
    },
    {
      title: "4x4",
      img: "https://americ41.in1.fcomet.com/wp-content/uploads/2024/01/Untitled-design-2024-02-02T213538.970.jpg",
    },
    {
      title: "Vans & Buses",
      img: "https://americ41.in1.fcomet.com/wp-content/uploads/2024/03/Busses-1.jpg",
    },
  ];

  return (
    <section
      className="bg-white py-16 px-6 md:px-16 text-center"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <h2 className="text-3xl md:text-5xl font-bold text-[#0d1b2a] mb-12">
        Your Perfect Drive
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {vehicles.map((vehicle, index) => (
          <div
            key={index}
            className="vehicle-card bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-2xl overflow-hidden group"
          >
            <div className="vehicle-card-image-container bg-gradient-to-b from-gray-50 to-white p-8 sm:p-10 flex justify-center items-center min-h-[280px] sm:min-h-[320px]">
              <img
                src={vehicle.img}
                alt={vehicle.title}
                className="h-48 md:h-64 object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            </div>
            <div className="vehicle-card-bottom bg-[#0d1b2a] text-white text-lg sm:text-xl font-semibold py-4 sm:py-5 px-6">
              <span className="vehicle-card-bottom-text relative z-10 inline-block">
                {vehicle.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
