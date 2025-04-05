import React, { useState, useEffect } from 'react';

const ThreeDLandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const getTransform = (depth) => {
    const moveX = mousePosition.x * depth;
    const moveY = -mousePosition.y * depth;
    return `perspective(1000px) rotateX(${moveY}deg) rotateY(${moveX}deg)`;
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-8">
          <div 
            className="text-2xl font-bold text-cyan-400"
            style={{ transform: getTransform(20) }}
          >
            CUBIC
          </div>
          <div className="flex gap-8">
            {['Home', 'Features', 'Pricing', 'Contact'].map((item, index) => (
              <a 
                key={index}
                href="#" 
                className="hover:text-cyan-400 transition-colors duration-300"
                style={{ transform: getTransform(10 + index * 2) }}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 py-16">
          <div 
            className="lg:w-1/2"
            style={{ transform: getTransform(30) }}
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Experience The Future With Our 3D Technology
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg">
              Leverage the power of our cutting-edge 3D solutions to transform your digital experiences and stand out from the competition.
            </p>
            <button 
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ transform: getTransform(40) }}
            >
              Get Started
            </button>
          </div>
          
          <div className="lg:w-1/2 h-96 relative">
            {/* 3D Elements */}
            <div 
              className="absolute w-64 h-64 top-0 left-0 opacity-80"
              style={{ 
                transform: `${getTransform(50)} rotateX(${Date.now() * 0.0005}deg) rotateY(${Date.now() * 0.0003}deg)`,
                animation: "spin 20s linear infinite"
              }}
            >
              <div className="w-full h-full relative transform-style-3d">
                {/* Cube faces */}
                <div className="absolute inset-0 bg-cyan-500 bg-opacity-10 border-2 border-cyan-400 border-opacity-30 transform translate-z-32"></div>
                <div className="absolute inset-0 bg-cyan-500 bg-opacity-10 border-2 border-cyan-400 border-opacity-30 transform -translate-z-32 rotate-y-180"></div>
                <div className="absolute inset-0 bg-cyan-500 bg-opacity-10 border-2 border-cyan-400 border-opacity-30 transform translate-x-32 rotate-y-90"></div>
                <div className="absolute inset-0 bg-cyan-500 bg-opacity-10 border-2 border-cyan-400 border-opacity-30 transform -translate-x-32 -rotate-y-90"></div>
                <div className="absolute inset-0 bg-cyan-500 bg-opacity-10 border-2 border-cyan-400 border-opacity-30 transform translate-y-32 rotate-x-90"></div>
                <div className="absolute inset-0 bg-cyan-500 bg-opacity-10 border-2 border-cyan-400 border-opacity-30 transform -translate-y-32 -rotate-x-90"></div>
              </div>
            </div>
            
            <div 
              className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-slate-800 top-20 left-40 shadow-lg shadow-cyan-400/20"
              style={{ 
                transform: getTransform(60),
                animation: "float 4s ease-in-out infinite"
              }}
            ></div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          {[
            {
              title: "3D Modeling",
              description: "Create stunning 3D models with our intuitive design tools and advanced rendering capabilities.",
              icon: "📊"
            },
            {
              title: "Augmented Reality",
              description: "Blend digital content with the real world using our cutting-edge AR technology.",
              icon: "🔮"
            },
            {
              title: "Interactive Experiences",
              description: "Build immersive and interactive experiences that captivate your audience.",
              icon: "✨"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-slate-800 bg-opacity-70 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl"
              style={{ 
                transform: getTransform(20 + index * 10),
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className="text-4xl mb-6 text-cyan-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 border-t border-slate-800 mt-16">
        <p>© 2025 CUBIC. All rights reserved.</p>
      </footer>
      
      {/* Add CSS keyframes */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotateX(0) rotateY(0); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default ThreeDLandingPage;