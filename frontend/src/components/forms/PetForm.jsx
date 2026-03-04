import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "../ui/Snackbar";
import { useSnackbar } from "../../hooks/useSnackbar";

export default function PetForm() {
  const navigate = useNavigate();
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
    isVolunteer: false,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      showSnackbar("Please login to add a pet", "warning");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) {
          // Capitalize species and gender to match backend enum
          if (key === 'species' || key === 'gender') {
            data.append(key, value.charAt(0).toUpperCase() + value.slice(1));
          } else {
            data.append(key, value);
          }
        }
      });
      
      if (image) {
        data.append("image", image);
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/pets`,
        data,
        { 
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          } 
        }
      );
      
      showSnackbar("Pet added successfully!", "success");
      setTimeout(() => navigate("/user-profile"), 1000);
    } catch (err) {
      console.error("Error adding pet:", err);
      showSnackbar(err.response?.data?.message || "Failed to add pet", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add Your Pet</h2>
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {/* Pet Name */}
        <input 
          name="name" 
          placeholder="Pet Name" 
          value={form.name} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
          required
        />
        
        {/* Species */}
        <select 
          name="species" 
          required 
          value={form.species} 
          onChange={handleChange} 
          className="w-full border p-2 rounded"
        >
          <option value="">Select Species</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
          <option value="rabbit">Rabbit</option>
          <option value="other">Other</option>
        </select>
        
        {/* Breed */}
        <input 
          name="breed" 
          placeholder="Breed" 
          value={form.breed} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        
        {/* Age */}
        <input 
          name="age" 
          type="number"
          placeholder="Age (in years)" 
          value={form.age} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        
        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Optional)</label>
          <input 
            type="date" 
            name="dateOfBirth" 
            value={form.dateOfBirth} 
            onChange={handleChange} 
            className="w-full border p-2 rounded" 
          />
        </div>
        
        {/* Gender */}
        <select 
          name="gender" 
          value={form.gender} 
          onChange={handleChange} 
          className="w-full border p-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        
        {/* Medical History */}
        <textarea 
          name="medicalHistory" 
          placeholder="Medical History (Optional)" 
          value={form.medicalHistory} 
          onChange={handleChange} 
          rows="3"
          className="w-full border p-2 rounded" 
        />
        
        {/* Vaccination */}
        <input 
          name="vaccination" 
          placeholder="Vaccination Status" 
          value={form.vaccination} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        
        {/* Price */}
        <input 
          type="number" 
          name="price" 
          placeholder="Price (PKR)" 
          value={form.price} 
          onChange={handleChange} 
          className="w-full border p-2 rounded"
          disabled={form.isVolunteer}
        />
        
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
        <input 
          name="location" 
          placeholder="City + Area" 
          value={form.location} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        
        {/* Seller Name */}
        <input 
          name="sellerName" 
          placeholder="Your Name" 
          value={form.sellerName} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        
        {/* Contact */}
        <input 
          name="contact" 
          placeholder="Phone or Email" 
          value={form.contact} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        
        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pet Photo</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="w-full border p-2 rounded" 
          />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? "Submitting..." : "Submit Pet"}
        </button>
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
