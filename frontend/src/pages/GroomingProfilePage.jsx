import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getImageUrl } from "../utils/imageUtils";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaAward, FaCertificate } from "react-icons/fa";
import ReviewSection from "../components/ui/ReviewSection";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function GroomingProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grooming, setGrooming] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrooming = async () => {
      try {
        console.log("Fetching grooming profile with ID:", id);
        const res = await axios.get(`${API}/api/grooming-profiles/${id}`);
        console.log("API response:", res.data);
        setGrooming(res.data.groomingProfile);
      } catch (err) {
        console.error("Error fetching grooming profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrooming();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!grooming) return <div className="text-center py-20 text-red-500">Grooming shop not found</div>;

  // Convert services and specializations to array safely
  let servicesArray = [];
  if (grooming.services) {
    if (Array.isArray(grooming.services)) {
      servicesArray = grooming.services;
    } else {
      try {
        servicesArray = JSON.parse(grooming.services);
        if (!Array.isArray(servicesArray)) {
          servicesArray = grooming.services.split(",").map(s => s.trim());
        }
      } catch {
        servicesArray = grooming.services.split(",").map(s => s.trim());
      }
    }
  }

  let specializationsArray = [];
  if (grooming.specializations) {
    if (Array.isArray(grooming.specializations)) {
      specializationsArray = grooming.specializations;
    } else {
      try {
        specializationsArray = JSON.parse(grooming.specializations);
        if (!Array.isArray(specializationsArray)) {
          specializationsArray = grooming.specializations.split(",").map(s => s.trim());
        }
      } catch {
        specializationsArray = grooming.specializations.split(",").map(s => s.trim());
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
        Back to Grooming Services
      </button>

      {/* Main Profile Card */}
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="relative h-64 bg-gradient-to-r from-[#1E88E5] to-[#1565C0]">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{grooming.shopName}</h1>
              <p className="text-white/90 text-lg">Professional Pet Grooming Services</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shop Image Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
              <div className="w-full h-80 mb-4">
                {grooming.shopImage ? (
                  <img
                    src={getImageUrl(grooming.shopImage, "/default-shop.jpg")}
                    alt={grooming.shopName}
                    className="w-full h-full object-cover rounded-xl shadow-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1E88E5] to-[#1565C0] rounded-xl flex items-center justify-center">
                    <span className="text-white text-8xl font-bold">
                      {grooming.shopName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Price Range Badge */}
              {grooming.priceRange && (
                <div className="bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white text-center py-3 px-4 rounded-xl shadow-md">
                  <p className="text-sm font-medium opacity-90">Price Range</p>
                  <p className="text-2xl font-bold">PKR {grooming.priceRange}</p>
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
                {grooming.phone && (
                  <a href={`tel:${grooming.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-[#1E88E5] transition-colors group">
                    <div className="bg-[#E3F2FD] p-3 rounded-lg group-hover:bg-[#1E88E5] transition-colors">
                      <FaPhone className="text-[#1E88E5] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold">{grooming.phone}</p>
                    </div>
                  </a>
                )}
                {grooming.email && (
                  <a href={`mailto:${grooming.email}`} className="flex items-center gap-3 text-gray-700 hover:text-[#1E88E5] transition-colors group">
                    <div className="bg-[#E3F2FD] p-3 rounded-lg group-hover:bg-[#1E88E5] transition-colors">
                      <FaEnvelope className="text-[#1E88E5] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold break-all">{grooming.email}</p>
                    </div>
                  </a>
                )}
                {grooming.address && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <div className="bg-[#E3F2FD] p-3 rounded-lg">
                      <FaMapMarkerAlt className="text-[#1E88E5]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-semibold">{grooming.address}, {grooming.city}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <a
                  href={`tel:${grooming.phone}`}
                  className="bg-[#1E88E5] text-white py-3 px-6 rounded-xl text-center font-semibold hover:bg-[#1565C0] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <FaPhone /> Call Now
                </a>
                <a
                  href={`mailto:${grooming.email}`}
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
                  <svg className="w-6 h-6 text-[#1E88E5]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#1A237E]">About {grooming.shopName}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">{grooming.ownerName}</p>
              {grooming.description && (
                <p className="text-gray-700 leading-relaxed">{grooming.description}</p>
              )}
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {grooming.experience && (
                  <div className="bg-gradient-to-br from-[#E3F2FD] to-white p-4 rounded-xl text-center border border-[#E3F2FD]">
                    <FaAward className="text-[#1E88E5] text-3xl mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#1A237E]">{grooming.experience}</p>
                    <p className="text-sm text-gray-600">Years Experience</p>
                  </div>
                )}
                {grooming.businessLicense && (
                  <div className="bg-gradient-to-br from-[#E3F2FD] to-white p-4 rounded-xl text-center border border-[#E3F2FD]">
                    <FaCertificate className="text-[#1E88E5] text-3xl mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#1A237E] break-all">{grooming.businessLicense}</p>
                    <p className="text-sm text-gray-600">Licensed</p>
                  </div>
                )}
                {grooming.workingHours && (
                  <div className="bg-gradient-to-br from-[#E3F2FD] to-white p-4 rounded-xl text-center border border-[#E3F2FD] md:col-span-1 col-span-2">
                    <FaClock className="text-[#1E88E5] text-3xl mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#1A237E]">{grooming.workingHours}</p>
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

            {/* Specializations Section */}
            {specializationsArray.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#E3F2FD] p-3 rounded-lg">
                    <svg className="w-6 h-6 text-[#1E88E5]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#1A237E]">Specializations</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {specializationsArray.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-6 py-3 bg-gradient-to-r from-[#E8EAF6] to-white text-[#3F51B5] rounded-full font-semibold border-2 border-[#E8EAF6] hover:border-[#3F51B5] transition-colors"
                    >
                      ⭐ {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <ReviewSection targetType="GroomingProfile" targetId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
