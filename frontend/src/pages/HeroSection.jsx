import React, { useState, useEffect } from "react";
import farmer from "../assets/indianFarmer.png";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [text, setText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const phrases = [
    'Supporting Local Farmers....',
    'Empowering Rural Communities....',
    'Growing a Sustainable Future....',
    'Farm Fresh to Your Table....',
  ];

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    let typingSpeed = isDeleting ? 50 : 100;
    let pauseDelay = 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentPhrase.length) {
          setText(currentPhrase.slice(0, text.length + 1));
        } else {
          setIsDeleting(true);
          setTimeout(() => {}, pauseDelay); // Pause before deleting
        }
      } else {
        if (text.length === 0) {
          setIsDeleting(false);
          setCurrentPhraseIndex((current) =>
            current === phrases.length - 1 ? 0 : current + 1
          );
        } else {
          setText(currentPhrase.slice(0, text.length - 1));
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, currentPhraseIndex, isDeleting]);

  return (
    <div className="relative min-h-screen bg-green-500 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight min-h-[3rem]">
              {text}
              <span className="animate-pulse">|</span>
            </h1>
            <p className="text-xl md:text-2xl">
              Empowering farmers with sustainable practices and fair trade opportunities
            </p>
            <div className="space-x-4 pt-4">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Join Us
              </button>
              <button onClick={()=>navigate("/learnFarmer")} className="bg-white hover:bg-gray-100 text-green-700 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[400px] md:h-[600px]">
            <img
              src={farmer}
              alt="Smiling farmer in traditional attire"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
