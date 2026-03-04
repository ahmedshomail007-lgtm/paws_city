
import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiCalendar, FiMapPin } from "react-icons/fi";
import Button from "../ui/Button";
import { useWishlist } from "../../hooks/useWishlist";
import { getImageUrl } from "../../utils/imageUtils";

const PetCard = ({ pet }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const petType = pet.price === 0 ? "adoption" : "sale";
  const imageUrl = getImageUrl(pet.image);




  const inWishlist = isInWishlist(pet._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(pet._id);
    } else {
      addToWishlist(pet);
    }
  };

  return (
    <Link to={`/marketplace/${pet._id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">

        <div className="relative h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={pet.name || `${pet.species || ""} ${pet.breed || ""}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = "/src/assets/husky.jpg";
            }}
          />


          <span
            className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold text-white rounded-full ${
              petType === "adoption" ? "bg-green-500" : "bg-blue-600"
            }`}
          >
            {petType === "adoption" ? "Adoption" : "For Sale"}
          </span>


          <button
            className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full shadow-md bg-white transition-all duration-200 hover:scale-110 ${
              inWishlist ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
            onClick={handleWishlistToggle}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FiHeart
              size={18}
              className={inWishlist ? "fill-current" : "fill-none"}
            />
          </button>
        </div>


        <div className="p-6">
          <h3 className="text-xl font-semibold mb-1">
            {pet.name || `${pet.species || ""} ${pet.breed || ""}`}
          </h3>
          <p className="text-gray-500 mb-4">
            {pet.breed && pet.species
              ? `${pet.breed} • ${pet.species}`
              : pet.species || "Unknown species"}
          </p>


          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <FiCalendar size={14} />
              <span>
                {pet.age
                  ? `${pet.age} year${pet.age > 1 ? "s" : ""}`
                  : "Age unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin size={14} />
              <span>{pet.location || "Location not specified"}</span>
            </div>
          </div>


          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-blue-600">
              {pet.price === 0 ? "Free" : `Rs.${pet.price}`}
            </span>
            <Button
              as="span"
              size="sm"
              variant={petType === "adoption" ? "secondary" : "primary"}
            >
              {petType === "adoption" ? "Adopt" : "Buy Now"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;
