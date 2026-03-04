import React from "react";

import { getImageUrl } from "../../utils/imageUtils";

export default function VetCard({ vet }) {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  // Normalize services into a clean array
  let servicesArray = [];

  if (Array.isArray(vet.services)) {
    // Case: array contains valid strings
    if (vet.services.length === 1 && typeof vet.services[0] === "string") {
      try {
        // Try parsing the first item as JSON
        const parsed = JSON.parse(vet.services[0]);
        if (Array.isArray(parsed)) {
          servicesArray = parsed;
        } else {
          servicesArray = vet.services[0]
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s);
        }
      } catch {
        servicesArray = vet.services
          .map((s) => s.split(","))
          .flat()
          .map((s) => s.trim())
          .filter((s) => s);
      }
    } else {
      servicesArray = vet.services
        .map((s) =>
          typeof s === "string" ? s.split(",").map((x) => x.trim()) : []
        )
        .flat()
        .filter((s) => s);
    }
  } else if (typeof vet.services === "string") {
    try {
      const parsed = JSON.parse(vet.services);
      servicesArray = Array.isArray(parsed)
        ? parsed
        : vet.services
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s);
    } catch {
      servicesArray = vet.services
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col items-center text-center p-6 border border-gray-100">
      {/* Profile Image */}
      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-100 shadow-sm">
        <img
          src={getImageUrl(vet.profilePhoto, "/default-vet.jpg")}
          alt={vet.fullName}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "/default-vet.jpg")}
        />
      </div>

      {/* Name */}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {vet.fullName}
      </h3>

      {/* Specialization */}
      {vet.specialization && (
        <p className="text-sm text-gray-600 mt-1">{vet.specialization}</p>
      )}

      {/* Services */}
      {servicesArray.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-800 mb-2">Services</p>
          <div className="flex flex-wrap justify-center gap-2">
            {servicesArray.map((service, index) => (
              <span
                key={index}
                className="bg-gray-50 text-gray-700 px-3 py-1 rounded-lg text-xs border border-gray-200"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-6 w-full">
        <button
          className="border border-gray-300 py-2.5 px-5 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          onClick={() => (window.location.href = `/vet-profile/${vet._id}`)}
        >
          View Profile
        </button>
        {vet.phone && (
          <a
            href={`tel:${vet.phone}`}
            className="border border-blue-200 text-blue-600 py-2.5 px-5 rounded-lg font-medium hover:bg-blue-50 transition text-center"
          >
            Call Now
          </a>
        )}
      </div>
    </div>
  );
}
