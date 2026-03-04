import React, { useEffect, useState } from "react";
import axios from "axios";
import GroomingCard from "../components/ui/GroomingCard";
import SectionHeading from "../components/ui/SectionHeading";
import { FaSearch, FaCut } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function GroomingServices() {
  const [groomingProfiles, setGroomingProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    fetchGroomingProfiles();
  }, []);

  const fetchGroomingProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/grooming-profiles`);
      setGroomingProfiles(response.data.groomingProfiles || []);
    } catch (error) {
      console.error("Error fetching grooming profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProfiles = () => {
    let filtered = groomingProfiles;

    if (searchTerm) {
      filtered = filtered.filter((profile) =>
        profile.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.services?.some(service => 
          service.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        profile.specializations?.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (cityFilter) {
      filtered = filtered.filter((profile) =>
        profile.city?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
  };

  useEffect(() => {
    filterProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, cityFilter, groomingProfiles]);

  const cities = [...new Set(groomingProfiles.map((p) => p.city))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <FaCut className="text-6xl mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pet Grooming Services
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Find the best grooming shops for your furry friends
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by shop name, services, or specializations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:outline-none"
              />
            </div>

            {/* City Filter */}
            <div>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:outline-none"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            Found <span className="font-semibold text-[#1E88E5]">{filteredProfiles.length}</span> grooming shop(s)
          </div>
        </div>

        {/* Grooming Profiles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600"></div>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <FaCut className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No Grooming Shops Found
            </h3>
            <p className="text-gray-500">
              {searchTerm || cityFilter
                ? "Try adjusting your search filters"
                : "Be the first to add a grooming shop!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredProfiles.map((profile) => (
              <GroomingCard key={profile._id} grooming={profile} />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-[#E3F2FD] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1A237E] mb-4">
            Own a Grooming Shop?
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Join our platform and reach more pet owners in your area!
          </p>
          <a
            href="/grooming/add"
            className="inline-block bg-[#1E88E5] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1565C0] transition-colors duration-300"
          >
            Add Your Shop
          </a>
        </div>
      </div>
    </div>
  );
}
