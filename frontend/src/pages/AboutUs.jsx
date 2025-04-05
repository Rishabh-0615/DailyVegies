import React from "react";
import about from "../assets/aboutus.jpg"

const AboutUs = () => {
  return (
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center animate-fade-in">
        {/* Image Section */}
        <div className="md:w-1/2 mb-8 md:mb-0 animate-slide-in-left">
          <img
            src={about}
            alt="Happy farmers"
            width={500}
            height={400}
            className="rounded-lg shadow-lg lg:ml-8"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 md:pl-12 text-center md:text-left animate-slide-in-right">
          <h2 className="text-4xl font-bold text-white mb-6">About Us</h2>
          <p className="text-lg text-white mb-6 leading-relaxed">
            We're passionate about connecting local farmers with consumers who
            appreciate fresh, high-quality produce. Our platform makes it easy
            for farmers to showcase their products and for buyers to access the
            best local ingredients.
          </p>
          <p className="text-lg text-white leading-relaxed">
            By cutting out the middleman, we ensure that farmers receive fair
            prices for their hard work, while consumers enjoy the freshest
            produce at competitive rates. Join us in supporting sustainable
            agriculture and building stronger local food systems.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;