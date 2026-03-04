import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "../ui/Snackbar";
import { useSnackbar } from "../../hooks/useSnackbar";

export default function GroomingAddForm() {
  const navigate = useNavigate();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    businessLicense: "",
    taxId: "",
    shopImage: null,
    description: "",
    services: "",
    workingHours: "",
    experience: "",
    priceRange: "",
    specializations: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/login");

      const formData = new FormData();

      for (let key in form) {
        if (key === "services" || key === "specializations") {
          const array = form[key]
            ? form[key].split(",").map((s) => s.trim()).filter((s) => s)
            : [];
          formData.append(key, JSON.stringify(array));
        } else if (key === "shopImage" && form.shopImage) {
          formData.append(key, form.shopImage);
        } else {
          formData.append(key, form[key] || "");
        }
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/grooming-profiles/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSnackbar("Grooming profile submitted successfully!", "success");
      setTimeout(() => navigate("/user-profile"), 1000);
    } catch (err) {
      console.error("Submission error:", err);

      if (err?.response?.data?.code === 11000 && err.response.data.keyValue?.email) {
        setError("A profile with this email already exists!");
      } else {
        setError(err?.response?.data?.error || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#1A237E]">
          Add Grooming Shop Profile
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Submit your grooming shop details for approval by admin
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Information */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Shop Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Shop Name *</label>
                <input
                  type="text"
                  name="shopName"
                  value={form.shopName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Owner Name *</label>
                <input
                  type="text"
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Business Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Business License No. *</label>
                <input
                  type="text"
                  name="businessLicense"
                  value={form.businessLicense}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tax ID (Optional)</label>
                <input
                  type="text"
                  name="taxId"
                  value={form.taxId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price Range</label>
                <input
                  type="text"
                  name="priceRange"
                  value={form.priceRange}
                  onChange={handleChange}
                  placeholder="e.g., PKR 2,000 - PKR 10,000"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>
            </div>
          </div>

          {/* Services & Specializations */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Services & Specializations</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Services (comma-separated)
                </label>
                <input
                  type="text"
                  name="services"
                  value={form.services}
                  onChange={handleChange}
                  placeholder="e.g., Bath, Haircut, Nail Trimming, Ear Cleaning"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Specializations (comma-separated)
                </label>
                <input
                  type="text"
                  name="specializations"
                  value={form.specializations}
                  onChange={handleChange}
                  placeholder="e.g., Dogs, Cats, Long-haired breeds"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Working Hours</label>
                <input
                  type="text"
                  name="workingHours"
                  value={form.workingHours}
                  onChange={handleChange}
                  placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>
            </div>
          </div>

          {/* Description & Image */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Additional Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about your grooming shop..."
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Shop Image</label>
                <input
                  type="file"
                  name="shopImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#1E88E5]"
                />
                {preview && (
                  <div className="mt-2">
                    <img src={preview} alt="Preview" className="h-32 w-auto rounded" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1E88E5] text-white py-3 rounded-lg hover:bg-[#1565C0] transition disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Profile"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/user-profile")}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {snackbar.show && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={hideSnackbar}
        />
      )}
    </div>
  );
}
