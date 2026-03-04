import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getImageUrl } from "../../utils/imageUtils";
import Snackbar from "../ui/Snackbar";
import { useSnackbar } from "../../hooks/useSnackbar";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PetEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    medicalHistory: "",
    vaccination: "",
    price: "",
    location: "",
    sellerName: "",
    contact: "",
    status: "available",
    isVolunteer: false,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  // Check authentication and fetch pet data
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPetData = async () => {
      try {
        const response = await axios.get(`${API}/api/pets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pet = response.data.pet;
        console.log("Fetched pet data:", pet); // Debug log
        
        // Format the date for input field
        const formattedDate = pet.dateOfBirth ? 
          new Date(pet.dateOfBirth).toISOString().split('T')[0] : "";

        setForm({
          name: pet.name || "",
          species: pet.species?.toLowerCase() || "",
          breed: pet.breed || "",
          age: pet.age || "",
          dateOfBirth: formattedDate,
          gender: pet.gender?.toLowerCase() || "",
          medicalHistory: pet.medicalHistory || "",
          vaccination: pet.vaccination || "",
          price: pet.price || "",
          location: pet.location || "",
          sellerName: pet.sellerName || "",
          contact: pet.contact || "",
          status: pet.status || "available",
          isVolunteer: pet.isVolunteer || false,
        });

        if (pet.image) {
          setCurrentImage(getImageUrl(pet.image));
        }

        setFetching(false);
      } catch (err) {
        console.error("Error fetching pet:", err);
        console.error("API URL:", `${API}/api/pets/${id}`);
        console.error("Response:", err.response?.data);
        setError(err.response?.data?.message || "Failed to load pet data");
        setFetching(false);
      }
    };

    fetchPetData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const data = new FormData();
      
      // Add all form fields to FormData
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Capitalize species and gender to match backend enum
          if (key === 'species' || key === 'gender') {
            data.append(key, value.charAt(0).toUpperCase() + value.slice(1));
          } else {
            data.append(key, value);
          }
        }
      });
      
      // Add new image if selected
      if (image) {
        data.append("image", image);
      }

      await axios.put(`${API}/api/pets/${id}`, data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      
      showSnackbar("Pet updated successfully!", "success");
      setTimeout(() => navigate("/user-profile"), 1000);
    } catch (err) {
      console.error("Error updating pet:", err);
      setError(err.response?.data?.message || "Failed to update pet");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/user-profile");
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading pet data...</p>
      </div>
    );
  }

  if (error && fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Pet Information</h2>
        <button 
          onClick={handleCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {/* Pet Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name *</label>
          <input 
            name="name" 
            placeholder="Pet Name" 
            value={form.name} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            required
          />
        </div>
        
        {/* Species */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Species *</label>
          <select 
            name="species" 
            required 
            value={form.species} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Species</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="rabbit">Rabbit</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {/* Breed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <input 
            name="breed" 
            placeholder="Breed" 
            value={form.breed} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age (in years)</label>
          <input 
            name="age" 
            type="number"
            min="0"
            placeholder="Age (in years)" 
            value={form.age} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Optional)</label>
          <input 
            type="date" 
            name="dateOfBirth" 
            value={form.dateOfBirth} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select 
            name="gender" 
            value={form.gender} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            name="status" 
            value={form.status} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        
        {/* Medical History */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Medical History (Optional)</label>
          <textarea 
            name="medicalHistory" 
            placeholder="Medical History" 
            value={form.medicalHistory} 
            onChange={handleChange} 
            rows="3"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        {/* Vaccination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination Status</label>
          <input 
            name="vaccination" 
            placeholder="Vaccination Status" 
            value={form.vaccination} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
          <input 
            type="number" 
            min="0"
            name="price" 
            placeholder="Price (PKR)" 
            value={form.price} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={form.isVolunteer}
          />
        </div>
        
        {/* Volunteer Checkbox */}
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <input 
            type="checkbox"
            id="isVolunteer"
            checked={form.isVolunteer}
            onChange={(e) => {
              const checked = e.target.checked;
              setForm({ ...form, isVolunteer: checked, price: checked ? "0" : form.price });
            }}
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="isVolunteer" className="text-sm font-medium text-green-800 cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="text-xl">💚</span>
              <span>Free Adoption - List this pet for volunteer adoption (no price)</span>
            </span>
          </label>
        </div>
        
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input 
            name="location" 
            placeholder="City + Area" 
            value={form.location} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        {/* Seller Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input 
            name="sellerName" 
            placeholder="Your Name" 
            value={form.sellerName} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
          <input 
            name="contact" 
            placeholder="Phone or Email" 
            value={form.contact} 
            onChange={handleChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pet Photo</label>
          
          {/* Current Image Display */}
          {(currentImage || preview) && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">
                {preview ? "New image preview:" : "Current image:"}
              </p>
              <img 
                src={preview || currentImage} 
                alt="Pet" 
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
          )}
          
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to keep current image
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Updating..." : "Update Pet"}
          </button>
          <button 
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />
    </div>
  );
}