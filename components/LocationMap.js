export default function LocationMap() {
  return (
    <section className="w-full py-10 px-4 md:px-10 bg-white">
      <h2 className="text-[#0b2850] text-2xl md:text-4xl font-semibold text-center mb-8">
        Find Convoy Travels – Rent a Car in Lahore
      </h2>

      <div className="w-full max-w-7xl mx-auto rounded-lg overflow-hidden shadow-md">
        <iframe
          title="Convoy Travels Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13609.330705337598!2d74.2805106!3d31.4762152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391903b859e21f09%3A0x35ee51d2fcd12e1a!2sConvoy%20Travels%20-%20Rent%20A%20Car%20in%20Lahore%20with%20Driver!5e0!3m2!1sen!2s!4v1730259069447!5m2!1sen!2s"
          width="100%"
          height="450"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0 w-full h-[350px] md:h-[450px]"
        ></iframe>
      </div>
    </section>
  );
}

