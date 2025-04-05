import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the farm-to-table delivery process work?",
      answer: "We harvest fresh produce from local farms on the day of delivery. Orders are carefully packed and delivered directly to your doorstep within 24 hours of harvest, ensuring maximum freshness. You can track your delivery in real-time through our app."
    },
    {
      question: "What's the minimum order value and delivery frequency?",
      answer: "The minimum order value is $25. You can choose between weekly, bi-weekly, or monthly subscription plans. One-time orders are also available with a slightly higher minimum order value of $35."
    },
    {
      question: "How do you ensure produce quality?",
      answer: "We partner with certified organic farms that follow sustainable farming practices. Each harvest undergoes quality checks, and we guarantee replacement or refund if you're not satisfied with the quality. All produce is handled following strict food safety guidelines."
    },
    {
      question: "I'm a farmer. How can I become a supplier?",
      answer: "We welcome local farmers who follow organic or sustainable farming practices. You'll need to provide certification documents, undergo a farm inspection, and meet our quality standards. Contact our farmer relations team at farmers@dailyvegies.com."
    },
    {
      question: "What if I'm not home during delivery?",
      answer: "You can specify a safe spot for contactless delivery, or we can deliver to neighbors with prior arrangement. Our insulated packaging keeps produce fresh for up to 6 hours after delivery. You'll receive notifications before and after delivery."
    },
    {
      question: "Do you offer seasonal produce boxes?",
      answer: "Yes! We offer curated seasonal boxes that change weekly based on harvest. These boxes offer the best value and include recipe cards. You can customize your box or opt out of specific items."
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Add scroll-based animations
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75;
        if (isInView) {
          element.classList.add('animate-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 
        className={`
          text-2xl sm:text-3xl lg:text-4xl font-bold text-center 
          mb-6 sm:mb-10 lg:mb-12 text-white z-10
          transform transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
      >
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className={`
              border border-green-200 rounded-lg overflow-hidden bg-white
              transform transition-all duration-700 ease-out
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
            style={{
              transitionDelay: `${index * 100}ms`
            }}
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-green-50 transition-colors duration-300"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-green-900 text-xl">{faq.question}</span>
              <div className="transition-transform duration-300 ease-in-out">
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-green-600 transform rotate-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-green-600 transform rotate-0" />
                )}
              </div>
            </button>
            
            <div 
              className={`
                transform transition-all duration-300 ease-in-out
                ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                overflow-hidden
              `}
            >
              <div className={`
                px-6 py-4 bg-green-50
                transform transition-all duration-300 delay-100
                ${openIndex === index ? 'translate-y-0' : '-translate-y-4'}
              `}>
                <p className="text-gray-700 text-lg">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .scroll-animate {
          transition: all 1s ease-out;
        }
        .scroll-animate.animate-in {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) !important;
        }
      `}</style>
    </div>
  );
};

export default FAQs;