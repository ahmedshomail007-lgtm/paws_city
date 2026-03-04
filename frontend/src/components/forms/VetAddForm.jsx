import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "../ui/Snackbar";
import { useSnackbar } from "../../hooks/useSnackbar";

export default function VetProfileForm() {
  const navigate = useNavigate();
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
        if (key === "services") {
          const servicesArray = form.services
            ? form.services.split(",").map((s) => s.trim()).filter((s) => s)
            : [];
          formData.append(key, JSON.stringify(servicesArray));
        } else if (key === "profilePhoto" && form.profilePhoto) {
          formData.append(key, form.profilePhoto);
        } else {
          formData.append(key, form[key] || "");
        }
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/vet-profiles/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSnackbar("Profile submitted successfully!", "success");
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
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          Veterinarian Profile Registration
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          autoComplete="off"
        >

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


          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2"
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 h-24 w-24 rounded-full object-cover"
              />
            )}
          </div>


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


          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Services</label>
            <textarea
              name="services"
              value={form.services}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Online consultation, vaccinations, surgery"
            />
          </div>


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


          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Profile"}
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
