import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import PetCard from "../components/ui/PetCard";
import { useNavigate } from "react-router-dom";

export default function PetMarketplace() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [breedFilter, setBreedFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [vaccinationFilter, setVaccinationFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch pets from backend
  useEffect(() => {
    const fetchPets = async () => {
      try {
        console.log("Fetching marketplace pets from:", `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/pets/marketplace`);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/pets/marketplace`
        );
        console.log("Marketplace pets response:", res.data);
        console.log("Number of pets:", res.data.pets?.length);
        setPets(res.data.pets || []);
      } catch (err) {
        console.error("Error fetching pets:", err);
        console.error("Error details:", err.response?.data);
        setError("Failed to load pets");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  // Apply filters
  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.species?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecies =
      speciesFilter === "all" ||
      pet.species?.toLowerCase() === speciesFilter.toLowerCase();

    const matchesBreed =
      breedFilter === "" ||
      pet.breed?.toLowerCase().includes(breedFilter.toLowerCase());

    const matchesGender =
      genderFilter === "all" ||
      pet.gender?.toLowerCase() === genderFilter.toLowerCase();

    const matchesVaccination =
      vaccinationFilter === "all" ||
      pet.vaccination?.toLowerCase() === vaccinationFilter.toLowerCase();

    const matchesLocation =
      locationFilter === "" ||
      pet.location?.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesPrice =
      (minPrice === "" || pet.price >= Number(minPrice)) &&
      (maxPrice === "" || pet.price <= Number(maxPrice));

    return (
      matchesSearch &&
      matchesSpecies &&
      matchesBreed &&
      matchesGender &&
      matchesVaccination &&
      matchesLocation &&
      matchesPrice
    );
  });

  const handleAddPet = () => {
    if (token) navigate("/pet-form");
    else navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pet Marketplace</h1>
            <p className="text-gray-500">
              Find your perfect companion from our trusted sellers and shelters
            </p>
          </div>
          <button
            onClick={handleAddPet}
            className={`py-2 px-4 rounded-md font-medium transition ${
              token
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-700 cursor-not-allowed"
            }`}
            title={token ? "Add Pet" : "Login to add a pet"}
          >
            Add Your Pet
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white rounded-xl shadow p-6 space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Species
                </label>
                <select
                  value={speciesFilter}
                  onChange={(e) => setSpeciesFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                >
                  <option value="all">All Species</option>
                  <option value="dog">Dogs</option>
                  <option value="cat">Cats</option>
                  <option value="bird">Birds</option>
                  <option value="rabbit">Rabbits</option>
                  <option value="other">Other</option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed
                </label>
                <input
                  type="text"
                  placeholder="Enter breed..."
                  value={breedFilter}
                  onChange={(e) => setBreedFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                >
                  <option value="all">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vaccination
                </label>
                <select
                  value={vaccinationFilter}
                  onChange={(e) => setVaccinationFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                >
                  <option value="all">All</option>
                  <option value="vaccinated">Vaccinated</option>
                  <option value="not vaccinated">Not Vaccinated</option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>


          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-24">Loading pets...</div>
            ) : error ? (
              <div className="col-span-full text-center py-24 text-red-500">{error}</div>
            ) : filteredPets.length > 0 ? (
              filteredPets.map((pet) => <PetCard key={pet._id} pet={pet} />)
            ) : (
              <div className="text-center py-24 text-gray-400 col-span-full">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
                <p>Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
