import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaPaw, FaMapMarkerAlt } from "react-icons/fa";
import PetCard from "../components/ui/PetCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function VolunteerPage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");

  useEffect(() => {
    fetchVolunteerPets();
  }, []);

  useEffect(() => {
    let filtered = [...pets];

    if (searchTerm) {
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (speciesFilter) {
      filtered = filtered.filter((pet) => pet.species === speciesFilter);
    }

    setFilteredPets(filtered);
  }, [searchTerm, speciesFilter, pets]);

  const fetchVolunteerPets = async () => {
    try {
      console.log("Fetching volunteer pets from:", `${API}/api/pets/volunteer`);
      const response = await axios.get(`${API}/api/pets/volunteer`);
      console.log("Volunteer pets response:", response.data);
      setPets(response.data.pets);
      setFilteredPets(response.data.pets);
    } catch (error) {
      console.error("Error fetching volunteer pets:", error);
      console.error("Error details:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1E88E5] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading volunteer pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaHeart className="text-5xl animate-pulse" />
            <FaPaw className="text-4xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Volunteer & Adopt for Free
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Give a loving home to pets in need. All pets listed here are available for free adoption.
            Be a hero and change a life today!
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, breed, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Species Filter */}
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
            >
              <option value="">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Bird">Birds</option>
              <option value="Rabbit">Rabbits</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              <span className="font-bold text-[#1E88E5] text-2xl">{filteredPets.length}</span>{" "}
              {filteredPets.length === 1 ? "pet" : "pets"} available for free adoption
            </p>
          </div>
        </div>

        {/* Pets Grid */}
        {filteredPets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-300 mb-4">
              <FaPaw className="text-8xl mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Pets Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || speciesFilter
                ? "Try adjusting your search filters"
                : "Check back soon for new volunteer adoption opportunities!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <div key={pet._id} className="relative">
                {/* Free Badge */}
                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2">
                  <FaHeart className="animate-pulse" />
                  FREE ADOPTION
                </div>
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-white py-16 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1A237E] mb-4">
            Want to List Your Pet for Free Adoption?
          </h2>
          <p className="text-gray-600 mb-8">
            If you have a pet that needs a new home, you can list it here for free adoption.
            Help us connect loving pets with caring families!
          </p>
          <button
            onClick={() => navigate("/user-profile")}
            className="bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            List Your Pet
          </button>
        </div>
      </div>
    </div>
  );
}
