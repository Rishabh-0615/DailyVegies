import React, { useEffect } from 'react';
import FarmerNavbar from './FarmerNavbar';
import Footer from './NewFooter';
import  HeroSection  from './HeroSection';

import { ProductData } from '../context/FarmerContext';
import { Loading } from '../components/Loading';
import ItemCardHome from '../components/ItemCardHome';
import myimg from "../assets/farm2.jpg";
import { UserData } from '../context/UserContext';

/*const HeroSection = () => (
  <div className="relative overflow-hidden mb-8 bg-gradient-to-b from-amber-50 to-amber-100">
    <div className="absolute inset-0">
      <img src={myimg} alt="Fresh produce background" className="w-full h-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-green-900/20" />
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-6">
          <span className="block">Fresh From The Farm</span>
          <span className="block text-amber-700">Direct To Your Table</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-stone-700 mb-8">
          Support local farmers and enjoy fresh, sustainably grown produce delivered right to your doorstep.
        </p>
      </div>
    </div>
  </div>
);
*/
const FarmerHome = () => {
  const { fetchProducts, products, loading } = ProductData();
  const {user} =UserData()
  console.log(products);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Recently Added Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Fresh Produce from Fellow Farmers
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Explore the latest fresh produce added by fellow farmers in our community.
        Stay updated on locally sourced products, ensuring quality and fostering 
        mutual support within local agriculture
        </p>
      </div>

      {/* Product Display Section */}
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Grid Layout for Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products && products.length > 0 ? (
                products.map((product, i) => (
                  <div
                    key={i}
                    className="flex justify-center"
                  >
                    <ItemCardHome product={product} currentUserId={user}/>
                  </div>
                ))
              ) : (
                <p className="text-center text-xl text-gray-600 col-span-full">
                  No Products Yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FarmerHome;