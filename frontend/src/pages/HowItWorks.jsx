import React from 'react';
import { Clipboard, Users, Truck, Bike } from "lucide-react";
import myimg1 from "../assets/stick.png";

const steps = [
    {
        icons: Truck,
        title: "Transport",
        description: "Easily add your farm products to our marketplace.",
    },
    {
        icons: Clipboard,
        title: "List Products",
        description: "Easily add your farm products to our marketplace.",
    },
    {
        icons: Users,
        title: "Connect Buyers",
        description: "Engage directly with consumers interested in your produce.",
    },
    {
        icons: Bike,
        title: "Deliver",
        description: "Delivers the fresh produce from farm to your table.",
    },
];

const HowItWorks = () => {
  return (
    <div id="services" className="px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {steps.map((service, index) => (
            <div 
                key={index} 
                className="group rounded-lg shadow-lg hover:scale-105 transition duration-300 flex flex-col items-center justify-center bg-cover bg-center sm:h-72 h-60 w-full relative" 
                style={{ backgroundImage: `url(${myimg1})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '90%', height: '250px' }}
            >
                {/* Icon & Title (Visible by default) */}
                <div className="flex flex-col items-center group-hover:hidden">
                    <service.icons size={48} className="text-black mb-2" />
                    <h3 className="text-lg sm:text-xl font-semibold text-black mb-1 text-center p-1 rounded-lg w-4/5 bg-opacity-50">
                        {service.title}
                    </h3>
                </div>

                {/* Description (Hidden by default, shown on hover) */}
                <div className="hidden group-hover:flex flex-col items-center">
                    <p className="text-sm sm:text-base text-black text-center p-1 rounded-lg w-3/5 bg-opacity-50">
                        {service.description}
                    </p>
                </div>
            </div>
            ))}
        </div>
    </div>
  );
};

export default HowItWorks;
