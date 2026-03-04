import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading";
import PetCard from "../ui/PetCard";
import Button from "../ui/Button";
import axios from "axios";

const FeaturedPets = () => {
  const navigate = useNavigate();
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/pets/marketplace`
        );
        setFeaturedPets(res.data.pets?.slice(0, 4) || []);
      } catch (err) {
        console.error("Error fetching featured pets:", err);
        setError("Failed to load featured pets");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPets();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          title="Featured Pets"
          subtitle="Meet some of our adorable pets looking for their forever homes"
          centered
        />

        {loading ? (
          <div className="text-center py-12">Loading featured pets...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredPets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate("/marketplace")}
          >
            View All Pets
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPets;
