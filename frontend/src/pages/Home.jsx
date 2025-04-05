import React from 'react';
import myimg2 from "../assets/bg2.jpg";
import Navbar from "./Navbar";
import HowItWorks from "./HowItWorks";
import AboutUs from "./AboutUs"
import FAQs from './FAQs';
import NewFooter from './Footer';

const Home = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background image container */}
      <div 
        className="fixed inset-0 bg-fixed bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${myimg2})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>


      {/* Content container */}
      <div className="relative z-10">
        <Navbar />
        <HowItWorks />
        <AboutUs />
        <FAQs />
        <NewFooter />
      </div>

    </div>
  );
};

export default Home;