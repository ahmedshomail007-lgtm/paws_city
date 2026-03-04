import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getImageUrl } from "../utils/imageUtils";
import { FaMapMarkerAlt, FaPhone, FaCalendar, FaHeart, FaPaw, FaSyringe, FaUser, FaShieldAlt } from "react-icons/fa";
import CommentSection from "../components/ui/CommentSection";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        console.log("Fetching pet with ID:", id);
        const response = await axios.get(`${API}/api/pets/${id}`);
        console.log("Fetched pet detail:", response.data.pet);
        setPet(response.data.pet);
      } catch (err) {
        console.error("Error fetching pet:", err);
        console.error("API URL:", `${API}/api/pets/${id}`);
        console.error("Response:", err.response?.data);
        setError(err.response?.data?.message || "Pet not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPet();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1E88E5] mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading pet details...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-500">{error || "Pet not found."}</p>
        <button
          onClick={() => navigate("/marketplace")}
          className="mt-4 bg-[#1E88E5] text-white py-2 px-6 rounded-lg hover:bg-[#1565C0] transition"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const petType = pet.price === 0 ? "adoption" : "sale";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 md:px-16">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-[#1E88E5] font-semibold hover:text-[#1565C0] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to {petType === "adoption" ? "Volunteer Pets" : "Marketplace"}
      </button>

      {/* Main Profile Card */}
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="relative h-64 bg-gradient-to-r from-[#1E88E5] to-[#1565C0]">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{pet.name}</h1>
              <p className="text-white/90 text-lg flex items-center gap-2">
                <FaPaw className="text-2xl" />
                {pet.breed && pet.species ? `${pet.breed} • ${pet.species}` : pet.species || "Unknown breed"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
              <div className="w-full h-80 mb-4">
                <img
                  src={getImageUrl(pet.image)}
                  alt={pet.name}
                  className="w-full h-full object-cover rounded-xl shadow-md"
                  onError={(e) => {
                    e.target.src = "/src/assets/husky.jpg";
                  }}
                />
              </div>
              
              {/* Adoption/Sale Badge */}
              <div className={`${petType === "adoption" ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-[#1E88E5] to-[#1565C0]"} text-white text-center py-3 px-4 rounded-xl shadow-md`}>
                <p className="text-sm font-medium flex items-center justify-center gap-2">
                  <FaHeart />
                  {petType === "adoption" ? "Available for Adoption" : "Available for Purchase"}
                </p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#1A237E] mb-4 flex items-center gap-2">
                <FaPhone className="text-[#1E88E5]" />
                Contact Information
              </h2>
              <div className="space-y-4">
                {pet.sellerName && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-[#E3F2FD] p-3 rounded-lg">
                      <FaUser className="text-[#1E88E5]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Seller</p>
                      <p className="font-semibold">{pet.sellerName}</p>
                    </div>
                  </div>
                )}
                {pet.contact && (
                  <a href={`tel:${pet.contact}`} className="flex items-center gap-3 text-gray-700 hover:text-[#1E88E5] transition-colors group">
                    <div className="bg-[#E3F2FD] p-3 rounded-lg group-hover:bg-[#1E88E5] transition-colors">
                      <FaPhone className="text-[#1E88E5] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold">{pet.contact}</p>
                    </div>
                  </a>
                )}
                {pet.location && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <div className="bg-[#E3F2FD] p-3 rounded-lg">
                      <FaMapMarkerAlt className="text-[#1E88E5]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-semibold">{pet.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mt-6 bg-gradient-to-br from-[#E3F2FD] to-white p-6 rounded-xl text-center border border-[#E3F2FD]">
                <p className="text-4xl font-bold text-[#1A237E]">
                  {pet.price === 0 ? "Free" : `Rs.${pet.price}`}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {petType === "adoption" ? "Adoption Fee" : "Purchase Price"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <a
                  href={`tel:${pet.contact}`}
                  className="bg-[#1E88E5] text-white py-3 px-6 rounded-xl text-center font-semibold hover:bg-[#1565C0] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  📞 Call Now
                </a>
                
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#E3F2FD] p-3 rounded-lg">
                  <FaPaw className="text-[#1E88E5] text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-[#1A237E]">About {pet.name}</h2>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {pet.age && (
                  <div className="bg-gradient-to-br from-[#E3F2FD] to-white p-4 rounded-xl text-center border border-[#E3F2FD]">
                    <FaCalendar className="text-[#1E88E5] text-3xl mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#1A237E]">{pet.age}</p>
                    <p className="text-sm text-gray-600">{pet.age === 1 ? 'Year Old' : 'Years Old'}</p>
                  </div>
                )}
                {pet.species && (
                  <div className="bg-gradient-to-br from-[#E3F2FD] to-white p-4 rounded-xl text-center border border-[#E3F2FD]">
                    <FaPaw className="text-[#1E88E5] text-3xl mx-auto mb-2" />
                    <p className="text-lg font-semibold text-[#1A237E]">{pet.species}</p>
                    <p className="text-sm text-gray-600">Species</p>
                  </div>
                )}
                {pet.breed && (
                  <div className="bg-gradient-to-br from-[#E3F2FD] to-white p-4 rounded-xl text-center border border-[#E3F2FD]">
                    <FaPaw className="text-[#1E88E5] text-3xl mx-auto mb-2" />
                    <p className="text-lg font-semibold text-[#1A237E]">{pet.breed}</p>
                    <p className="text-sm text-gray-600">Breed</p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E3F2FD] p-3 rounded-lg">
                  <FaShieldAlt className="text-[#1E88E5] text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-[#1A237E]">Medical Information</h2>
              </div>
              
              <div className="space-y-4">
                {pet.vaccination && (
                  <div className="flex items-start gap-4 p-4 bg-[#E3F2FD] rounded-xl">
                    <FaSyringe className="text-[#1E88E5] text-xl mt-1" />
                    <div>
                      <p className="font-semibold text-[#1A237E] mb-1">Vaccination Status</p>
                      <p className="text-gray-700">{pet.vaccination}</p>
                    </div>
                  </div>
                )}
                {pet.medicalHistory && (
                  <div className="flex items-start gap-4 p-4 bg-[#E3F2FD] rounded-xl">
                    <FaShieldAlt className="text-[#1E88E5] text-xl mt-1" />
                    <div>
                      <p className="font-semibold text-[#1A237E] mb-1">Medical History</p>
                      <p className="text-gray-700">{pet.medicalHistory}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <CommentSection petId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
