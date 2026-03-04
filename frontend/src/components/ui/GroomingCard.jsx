import React from "react";
import { useNavigate } from "react-router-dom";

export default function GroomingCard({ grooming }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Shop Image */}
      <div className="h-48 overflow-hidden bg-gray-200">
        {grooming.shopImage ? (
          <img
            src={grooming.shopImage}
            alt={grooming.shopName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1E88E5] to-[#1565C0]">
            <span className="text-white text-6xl font-bold">
              {grooming.shopName?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Shop Name */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {grooming.shopName}
        </h3>

        {/* Price Range */}
        {grooming.priceRange && (
          <div className="flex items-center text-gray-700 mb-4">
            <span className="mr-2 text-[#1E88E5] text-lg font-bold">PKR</span>
            <span className="text-lg font-semibold">{grooming.priceRange}</span>
          </div>
        )}

        {/* Services */}
        {grooming.services && grooming.services.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Services:</p>
            <div className="flex flex-wrap gap-2">
              {grooming.services.slice(0, 3).map((service, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#E3F2FD] text-[#1565C0] text-xs rounded-full"
                >
                  {service}
                </span>
              ))}
              {grooming.services.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  +{grooming.services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate(`/grooming-profile/${grooming._id}`)}
            className="flex-1 bg-[#1E88E5] text-white py-2 rounded-lg hover:bg-[#1565C0] transition-colors duration-300 font-semibold"
          >
            View Profile
          </button>
          <button
            onClick={() => window.location.href = `tel:${grooming.phone}`}
            className="flex-1 bg-[#1A237E] text-white py-2 rounded-lg hover:bg-[#0D1642] transition-colors duration-300 font-semibold"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}
