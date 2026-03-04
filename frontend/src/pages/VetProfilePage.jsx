import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getImageUrl } from "../utils/imageUtils";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaAward, FaCertificate, FaUserMd } from "react-icons/fa";
import ReviewSection from "../components/ui/ReviewSection";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function VetProfilePage() {
  const { id } = useParams(); // Get vet ID from URL
  const navigate = useNavigate();
  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVet = async () => {
      try {
        console.log("Fetching vet with ID:", id);
        const res = await axios.get(`${API}/api/vet-profiles/${id}`);
        console.log("API response:", res.data);
        setVet(res.data.vet);
      } catch (err) {
        console.error("Error fetching vet:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVet();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!vet) return <div className="text-center py-20 text-red-500">Vet not found</div>;

  // Convert services to array safely
  let servicesArray = [];
  if (vet.services) {
    if (Array.isArray(vet.services)) {
      servicesArray = vet.services;
    } else {
      try {
        // Try parsing JSON string first
        servicesArray = JSON.parse(vet.services);
        if (!Array.isArray(servicesArray)) {
          servicesArray = vet.services.split(",").map(s => s.trim());
        }
      } catch {
        // Fallback to comma-separated string
        servicesArray = vet.services.split(",").map(s => s.trim());
      }
    }
  }

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
        Back to Veterinary Services
      </button>

      {/* Main Profile Card */}
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="relative h-64 bg-gradient-to-r from-[#1E88E5] to-[#1565C0]">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{vet.fullName}</h1>
              <p className="text-white/90 text-lg flex items-center gap-2">
                <FaUserMd className="text-2xl" />
                {vet.specialization}
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
                  src={getImageUrl(vet.profilePhoto, "/default-vet.jpg")}
                  alt={vet.fullName}
                  className="w-full h-full object-cover rounded-xl shadow-md"
                />
              </div>
              
              {/* Emergency Badge */}
              {vet.emergency && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-3 px-4 rounded-xl shadow-md">
                  <p className="text-sm font-medium">🚨 EMERGENCY AVAILABLE</p>
                  <p className="text-xs mt-1 opacity-90">24/7 Emergency Services</p>
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#1A237E] mb-4 flex items-center gap-2">
                <FaPhone className="text-[#1E88E5]" />
                Contact Information
              </h2>
              <div className="space-y-4">
                {vet.phone && (
                  <a href={`tel:${vet.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-[#1E88E5] transition-colors group">
                    <div className="bg-[#E3F2FD] p-3 rounded-lg group-hover:bg-[#1E88E5] transition-colors">
                      <FaPhone className="text-[#1E88E5] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold">{vet.phone}</p>
                    </div>
                  </a>
                )}
                {vet.email && (
                  <a href={`mailto:${vet.email}`} className="flex items-center gap-3 text-gray-700 hover:text-[#1E88E5] transition-colors group">
                    <div className="bg-[#E3F2FD] p-3 rounded-lg group-hover:bg-[#1E88E5] transition-colors">
                      <FaEnvelope className="text-[#1E88E5] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold break-all">{vet.email}</p>
                    </div>
                  </a>
                )}
                {vet.clinic && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <div className="bg-[#E3F2FD] p-3 rounded-lg">
                      <FaMapMarkerAlt className="text-[#1E88E5]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clinic</p>
                      <p className="font-semibold">{vet.clinic}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <a
                  href={`tel:${vet.phone}`}
                  className="bg-[#1E88E5] text-white py-3 px-6 rounded-xl text-center font-semibold hover:bg-[#1565C0] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <FaPhone /> Call Now
                </a>
                <a
                  href={`mailto:${vet.email}`}
                  className="bg-[#1A237E] text-white py-3 px-6 rounded-xl text-center font-semibold hover:bg-[#0D1642] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <FaEnvelope /> Send Email
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
                  <FaUserMd className="text-[#1E88E5] text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-[#1A237E]">About Dr. {vet.fullName}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                <span className="font-semibold text-[#1E88E5]">{vet.specialization}</span> specialist with extensive experience in veterinary care.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {vet.experience && (
                  <div className="bg-gradient-to-br from-[#E3F2FD] to-white p-4 rounded-xl text-center border border-[#E3F2FD]">
                    <FaAward className="text-[#1E88E5] text-3xl mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#1A237E]">{vet.experience}</p>
                    <p className="text-sm text-gray-600">Years Experience</p>
                  </div>
                )}
                {vet.licenseNumber && (
                  <div className="bg-gradient-to-br from-[#E3F2FD] to-white p-4 rounded-xl text-center border border-[#E3F2FD]">
                    <FaCertificate className="text-[#1E88E5] text-3xl mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#1A237E] break-all">{vet.licenseNumber}</p>
                    <p className="text-sm text-gray-600">Licensed</p>
                  </div>
                )}
                {vet.workingHours && (
                  <div className="bg-gradient-to-br from-[#E3F2FD] to-white p-4 rounded-xl text-center border border-[#E3F2FD] md:col-span-1 col-span-2">
                    <FaClock className="text-[#1E88E5] text-3xl mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#1A237E]">{vet.workingHours}</p>
                    <p className="text-sm text-gray-600">Working Hours</p>
                  </div>
                )}
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E3F2FD] p-3 rounded-lg">
                  <svg className="w-6 h-6 text-[#1E88E5]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#1A237E]">Services Offered</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {servicesArray.length > 0 ? (
                  servicesArray.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-gradient-to-r from-[#E3F2FD] to-white p-4 rounded-xl border border-[#E3F2FD] hover:shadow-md transition-shadow"
                    >
                      <div className="bg-[#1E88E5] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-gray-800 font-semibold">{service}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-2">No services listed</p>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection targetType="VetProfile" targetId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
