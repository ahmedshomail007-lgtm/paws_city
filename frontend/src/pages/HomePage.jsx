import React from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShield, FiAward } from "react-icons/fi";
import Button from "../components/ui/Button";
import FeaturedPets from "../components/home/FeaturedPets";
import { Services } from "../components/Services";

const HomePage = () => {
  const navigate = useNavigate();


  return (
    <main>

      <section className="bg-[#EEF7FE] py-16">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">


          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#1A237E]">
              Find Your Perfect{" "}
              <span className="block text-primary text-[#1E88E5]">Furry Friend</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto lg:mx-0">
              Discover loving pets, connect with trusted veterinarians, and join our community of pet lovers at Paws City.
            </p>
            <div className="mb-6 max-w-md mx-auto lg:mx-0">
            <Button onClick={() => navigate("/marketplace")}>Explore Pets</Button>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E3F2FD] mx-auto mb-4">
                  <FiHeart size={24} className="text-[#1E88E5]" />
                </div>
                <div className="text-xl font-bold text-[#1A237E]">500+</div>
                <div className="text-sm text-gray-500">Happy Adoptions</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E3F2FD] mx-auto mb-4">
                  <FiShield size={24} className="text-[#1E88E5]" />
                </div>
                <div className="text-xl font-bold text-[#1A237E]">50+</div>
                <div className="text-sm text-gray-500">Trusted Vets</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E3F2FD] mx-auto mb-4">
                  <FiAward size={24} className="text-[#1E88E5]" />
                </div>
                <div className="text-xl font-bold text-[#1A237E]">5 Years</div>
                <div className="text-sm text-gray-500">Experience</div>
              </div>
            </div>
          </div>


          <div className="order-1 lg:order-2 relative max-w-md mx-auto">
            <img
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Happy dog"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-md flex items-center p-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-primary text-lg mr-3">
                🐕
              </div>
              <div>
                <h4 className="text-base font-medium m-0">Max</h4>
                <p className="text-xs text-gray-500 m-0">Golden Retriever</p>
              </div>
            </div>
            <div className="absolute top-6 right-6 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md text-red-500">
              <FiHeart size={20} fill="currentColor" />
            </div>
          </div>
        </div>
      </section>

      <FeaturedPets />
      <Services />
    </main>
  );
};

export default HomePage;
