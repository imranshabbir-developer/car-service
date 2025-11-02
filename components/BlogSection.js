export default function BlogSection() {
  const blogs = [
    {
      img: "https://convoytravels.pk/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-30-at-12.59.58_2b2df75e-750x430-1.jpg",
      title: "Kia Sportage Gets \"Striking New Look\" – Details",
      date: "May 31, 2024",
      desc: "Kia Sportage Gets \"Striking New Look\" – Details Kia Motor Pakistan has announced a minor upgrade in its crossover SUV, Kia.",
    },
    {
      img: "https://convoytravels.pk/wp-content/uploads/2021/07/Busses-1-1024x443-1.gif",
      title: "Locally Assembled Haval Jolion HEV – Specs & Features",
      date: "April 2, 2024",
      desc: "Locally Assembled Haval Jolion HEV – Specs & Features. As we told you earlier, the locally assembled Haval Jolion HEV is launched.",
    },
    {
      img: "https://convoytravels.pk/wp-content/uploads/2024/04/Petrol-Price-Change-Feature-Artwork-750x430-1.jpg",
      title: "Petrol Price Jacked Up By Rs. 9.66",
      date: "April 2, 2024",
      desc: "Petrol Price Jacked Up By Rs. 9.66. The Ministry of Finance has issued a notification regarding the new prices of petroleum products.",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-20 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-[#1a2b5c] text-4xl md:text-5xl font-bold mb-12">
          Blog Post
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white text-left border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={blog.img}
                alt={blog.title}
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-[#1a2b5c] font-semibold text-lg mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-sm mb-2">{blog.date}</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {blog.desc}
                </p>
                <a
                  href="#"
                  className="inline-block bg-[#1a2b5c] text-white text-sm px-4 py-2 rounded hover:bg-[#132045] transition-colors duration-300"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="inline-block bg-[#1a2b5c] text-white font-medium px-6 py-3 rounded hover:bg-[#132045] transition-colors duration-300"
        >
          View All Blogs
        </a>
      </div>
    </section>
  );
}

