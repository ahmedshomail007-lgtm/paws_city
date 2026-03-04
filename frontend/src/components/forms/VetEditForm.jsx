import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getImageUrl } from "../../utils/imageUtils";
import Snackbar from "../ui/Snackbar";
import { useSnackbar } from "../../hooks/useSnackbar";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function VetEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    govtId: "",
    degree: "",
    licenseNo: "",
    issuingAuthority: "",
    expiryDate: "",
    profilePhoto: null,
    clinic: "",
    specialization: "",
    experience: "",
    services: "",
    workingHours: "",
  });

  const [preview, setPreview] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  // ✅ Check authentication and fetch vet profile data
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchVetProfile = async () => {
      try {
        const response = await axios.get(`${API}/api/vet-profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const vet = response.data.vet;
        
        // Format the date for input field
        const formattedDate = vet.expiryDate ? 
          new Date(vet.expiryDate).toISOString().split('T')[0] : '';

        setForm({
          fullName: vet.fullName || "",
          email: vet.email || "",
          phone: vet.phone || "",
          govtId: vet.govtId || "",
          degree: vet.degree || "",
          licenseNo: vet.licenseNo || "",
          issuingAuthority: vet.issuingAuthority || "",
          expiryDate: formattedDate,
          profilePhoto: null, // Don't prefill file input
          clinic: vet.clinic || "",
          specialization: vet.specialization || "",
          experience: vet.experience ? String(vet.experience) : "",
          services: Array.isArray(vet.services) ? vet.services.join(", ") : "",
          workingHours: vet.workingHours || "",
        });

        setCurrentPhoto(vet.profilePhoto || "");
        setFetching(false);
      } catch (error) {
        console.error("Error fetching vet profile:", error);
        setError("Failed to load vet profile");
        setFetching(false);
      }
    };

    fetchVetProfile();
  }, [navigate, id]);

  // ✅ Handle field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0])); // show preview
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/login");

      const formData = new FormData();

      for (let key in form) {
        if (key === "services") {
          const servicesArray = form.services
            ? form.services.split(",").map((s) => s.trim()).filter((s) => s)
            : [];
          formData.append(key, JSON.stringify(servicesArray));
        } else if (key === "profilePhoto" && form.profilePhoto) {
          // Only append if a new photo is selected
          console.log("Appending new profile photo:", form.profilePhoto.name);
          formData.append(key, form.profilePhoto);
        } else if (key !== "profilePhoto") {
          // Append all other fields except profilePhoto when no new photo
          formData.append(key, form[key] || "");
        }
      }

      // Log what's being sent
      console.log("FormData keys:");
      for (let [key, value] of formData.entries()) {
        if (key === "profilePhoto") {
          console.log(`${key}:`, value.name || "File object");
        } else {
          console.log(`${key}:`, value);
        }
      }

      await axios.put(
        `${API}/api/vet-profiles/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSnackbar("Profile updated successfully!", "success");
      setTimeout(() => navigate("/user-profile"), 1000);
    } catch (err) {
      console.error("Update error:", err);

      if (err?.response?.data?.code === 11000 && err.response.data.keyValue?.email) {
        setError("A profile with this email already exists!");
      } else {
        setError(err?.response?.data?.error || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">
            Edit Veterinarian Profile
          </h2>
          <button
            onClick={() => navigate("/user-profile")}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Profile
          </button>
        </div>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          autoComplete="off"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Dr. Umar Farooq"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="vet@email.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="+92 300 1234567"
              required
            />
          </div>

          {/* Govt ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Government ID</label>
            <input
              type="text"
              name="govtId"
              value={form.govtId}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="12345-6789012-3"
              required
            />
          </div>

          {/* Degree */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Degree</label>
            <input
              type="text"
              name="degree"
              value={form.degree}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="DVM / BVSc"
              required
            />
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">License No</label>
            <input
              type="text"
              name="licenseNo"
              value={form.licenseNo}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="PVMC-12345"
              required
            />
          </div>

          {/* Issuing Authority */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Issuing Authority</label>
            <input
              type="text"
              name="issuingAuthority"
              value={form.issuingAuthority}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Pakistan Veterinary Medical Council"
              required
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Profile Photo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to keep current photo</p>
            
            {/* Current photo or preview */}
            <div className="mt-2 flex items-center gap-4">
              {preview ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">New photo preview:</p>
                  <img
                    src={preview}
                    alt="New Preview"
                    className="h-24 w-24 rounded-full object-cover border-2 border-green-400"
                  />
                </div>
              ) : currentPhoto ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current photo:</p>
                  <img
                    src={getImageUrl(currentPhoto)}
                    alt="Current"
                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Clinic */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Clinic</label>
            <input
              type="text"
              name="clinic"
              value={form.clinic}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="PetCare Hospital, Lahore"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Pets / Livestock / Surgery"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience</label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="5"
              autoComplete="off"
              step="1"
              min="0"
            />
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Services</label>
            <textarea
              name="services"
              value={form.services}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Online consultation, vaccinations, surgery (comma separated)"
            />
          </div>

          {/* Working Hours */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Working Hours</label>
            <input
              type="text"
              name="workingHours"
              value={form.workingHours}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Mon-Fri, 9AM - 6PM"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/user-profile")}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />
    </div>
  );
}