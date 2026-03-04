import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VetCard from "../components/ui/VetCard";

export default function VeterinaryServices() {
  const [vets, setVets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/vet-profiles`
        );
        console.log("Fetched vets:", res.data);
        setVets(res.data.vets || []);
      } catch (err) {
        console.error("Error fetching vets:", err);
        setError("Failed to load veterinarians");
      } finally {
        setLoading(false);
      }
    };
    fetchVets();
  }, []);

  const filteredVets = vets.filter((vet) =>
    (vet.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (vet.specialization?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (vet.clinic?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleAddVet = () => {
    if (token) navigate("/veterinary-form");
    else navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Veterinary Services</h1>
            <p className="text-gray-500">Connect with certified veterinarians and pet care specialists</p>
          </div>

          <button
            onClick={handleAddVet}
            className={`py-2 px-4 rounded-md font-medium transition ${
              token ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-700 cursor-not-allowed"
            }`}
            title={token ? "Add Veterinarian" : "Login to add a veterinarian"}
          >
            Add Veterinarian
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 lg:max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search vets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md py-2 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Vet Cards */}
        {loading ? (
          <p className="text-center text-gray-500">Loading veterinarians...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : filteredVets.length === 0 ? (
          <div className="text-center py-24">
            <Search className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mt-4">No veterinarians found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters to see more results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVets.map((vet) => (
              <VetCard key={vet._id} vet={vet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
