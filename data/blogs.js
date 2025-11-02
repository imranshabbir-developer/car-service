// Blog posts data
export const blogs = [
  {
    id: 1,
    slug: "kia-sportage-gets-striking-new-look-details",
    img: "https://convoytravels.pk/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-30-at-12.59.58_2b2df75e-750x430-1.jpg",
    title: "Kia Sportage Gets \"Striking New Look\" – Details",
    date: "May 31, 2024",
    desc: "Kia Sportage Gets \"Striking New Look\" – Details Kia Motor Pakistan has announced a minor upgrade in its crossover SUV, Kia.",
    author: "Convoy Travels",
    category: "Automotive News",
    content: `
      <p class="mb-4">Kia Motor Pakistan has announced a minor upgrade in its crossover SUV, Kia Sportage, with a striking new look that has caught the attention of automotive enthusiasts across the country.</p>
      
      <h2 class="text-2xl font-bold text-[#1a2b5c] mb-4 mt-6">What's New?</h2>
      <p class="mb-4">The updated Kia Sportage features several aesthetic enhancements including redesigned front grille, updated headlights, and fresh color options. The interior has also received subtle improvements with better material quality and updated infotainment system.</p>
      
      <h2 class="text-2xl font-bold text-[#1a2b5c] mb-4 mt-6">Performance Specifications</h2>
      <p class="mb-4">Under the hood, the Sportage maintains its reliable engine options. The SUV continues to offer excellent fuel economy and performance, making it a popular choice for families and individuals looking for a versatile vehicle.</p>
      
      <h2 class="text-2xl font-bold text-[#1a2b5c] mb-4 mt-6">Availability</h2>
      <p class="mb-4">The updated Kia Sportage is now available at Kia dealerships across Pakistan. Customers can expect competitive pricing and attractive financing options.</p>
      
      <p class="mb-4">For those interested in experiencing this updated model, Convoy Travels offers the latest Kia Sportage in our rental fleet. Book your ride today and experience the striking new look firsthand!</p>
    `,
  },
  {
    id: 2,
    slug: "locally-assembled-haval-jolion-hev-specs-features",
    img: "https://convoytravels.pk/wp-content/uploads/2021/07/Busses-1-1024x443-1.gif",
    title: "Locally Assembled Haval Jolion HEV – Specs & Features",
    date: "April 2, 2024",
    desc: "Locally Assembled Haval Jolion HEV – Specs & Features. As we told you earlier, the locally assembled Haval Jolion HEV is launched.",
    author: "Convoy Travels",
    category: "New Launch",
    content: `
      <p class="mb-4">The locally assembled Haval Jolion HEV has been officially launched in Pakistan, marking a significant milestone in the country's automotive industry.</p>
      
      <h2 class="text-2xl font-bold text-[#1a2b5c] mb-4 mt-6">Key Specifications</h2>
      <p class="mb-4">The Haval Jolion HEV comes equipped with a hybrid powertrain that combines an internal combustion engine with an electric motor. This setup provides exceptional fuel efficiency while maintaining strong performance characteristics.</p>
      
      <h2 class="text-2xl font-bold text-[#1a2b5c] mb-4 mt-6">Premium Features</h2>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Advanced hybrid technology for superior fuel economy</li>
        <li>Spacious interior with premium materials</li>
        <li>Latest infotainment system with smartphone connectivity</li>
        <li>Comprehensive safety features including multiple airbags</li>
        <li>Modern design with LED lighting throughout</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-[#1a2b5c] mb-4 mt-6">Local Assembly Benefits</h2>
      <p class="mb-4">The local assembly of the Haval Jolion HEV brings several advantages including competitive pricing, readily available spare parts, and better after-sales service support.</p>
      
      <p class="mb-4">This launch represents Haval's commitment to the Pakistani market and its efforts to provide high-quality, fuel-efficient vehicles to local consumers.</p>
    `,
  },
  {
    id: 3,
    slug: "petrol-price-jacked-up-by-rs-966",
    img: "https://convoytravels.pk/wp-content/uploads/2024/04/Petrol-Price-Change-Feature-Artwork-750x430-1.jpg",
    title: "Petrol Price Jacked Up By Rs. 9.66",
    date: "April 2, 2024",
    desc: "Petrol Price Jacked Up By Rs. 9.66. The Ministry of Finance has issued a notification regarding the new prices of petroleum products.",
    author: "Convoy Travels",
    category: "Market Update",
    content: `
      <p class="mb-4">The Ministry of Finance has issued a notification regarding the new prices of petroleum products, announcing a significant increase in petrol prices.</p>
      
      <h2 class="text-2xl font-bold text-[#1a2b5c] mb-4 mt-6">Price Changes</h2>
      <p class="mb-4">Effective immediately, the price of petrol has been increased by Rs. 9.66 per liter. This substantial increase will impact consumers across the country, affecting both private vehicle owners and commercial transportation.</p>
      
      <h2 class="text-2xl font-bold text-[#1a2b5c] mb-4 mt-6">Impact on Transportation</h2>
      <p class="mb-4">The price hike is expected to affect various sectors including ride-hailing services, public transportation, and logistics companies. Consumers may need to adjust their travel budgets accordingly.</p>
      
      <h2 class="text-2xl font-bold text-[#1a2b5c] mb-4 mt-6">Alternative Solutions</h2>
      <p class="mb-4">In light of these price increases, many consumers are exploring alternative transportation options. Car rental services with fuel-efficient vehicles have become increasingly attractive, as they allow for better cost management.</p>
      
      <p class="mb-4">Convoy Travels offers a wide range of fuel-efficient vehicles that can help mitigate the impact of rising fuel costs. Our fleet includes modern, economical cars perfect for both short-term and long-term rental needs.</p>
      
      <h2 class="text-2xl font-bold text-[#1a2b5c] mb-4 mt-6">Looking Ahead</h2>
      <p class="mb-4">Market analysts suggest that fuel prices may continue to fluctuate based on global oil market trends. It's advisable to stay informed about price changes and plan accordingly.</p>
    `,
  },
];

export const getBlogBySlug = (slug) => {
  return blogs.find(blog => blog.slug === slug);
};

export const getBlogById = (id) => {
  return blogs.find(blog => blog.id === parseInt(id));
};

