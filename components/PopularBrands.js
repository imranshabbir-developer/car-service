export default function PopularBrands() {
  const brands = [
    {
      img: "https://convoytravels.pk/wp-content/uploads/2024/03/Suzuki250.jpg",
      name: "Suzuki",
    },
    {
      img: "https://convoytravels.pk/wp-content/uploads/2024/03/Toyota-250.jpg",
      name: "Toyota",
    },
    {
      img: "https://convoytravels.pk/wp-content/uploads/2024/02/Honda250.jpg",
      name: "Honda",
    },
    {
      img: "https://convoytravels.pk/wp-content/uploads/2024/02/Others-1.jpg",
      name: "BMW",
    },
    {
      img: "https://convoytravels.pk/wp-content/uploads/2024/02/Luxcious250.jpg",
      name: "Mercedes",
    },
    {
      img: "https://convoytravels.pk/wp-content/uploads/2024/02/Vans-and-Buses.jpg",
      name: "Hyundai",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-[#1a2b5c] text-sm font-medium mb-2">
          <span className="inline-block w-8 h-0.5 bg-[#1a2b5c] mr-2"></span>
          Meet the Right Services
        </p>
        <h2 className="text-[#1a2b5c] text-4xl md:text-5xl font-bold mb-12">
          Popular Brands
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center p-6"
            >
              <img
                src={brand.img}
                alt={brand.name}
                className="h-16 md:h-20 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

