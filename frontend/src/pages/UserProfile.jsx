/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";
import { getImageUrl } from "../utils/imageUtils";
import Snackbar from "../components/ui/Snackbar";
import { useSnackbar } from "../hooks/useSnackbar";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import { useConfirmation } from "../hooks/useConfirmation"; 

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserProfile = () => {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { 
    isOpen: isConfirmOpen, 
    config: confirmConfig, 
    loading: confirmLoading, 
    showConfirmation, 
    hideConfirmation, 
    handleConfirm 
  } = useConfirmation();
  const [user, setUser] = useState(null);
  const [vets, setVets] = useState([]);
  const [pets, setPets] = useState([]);
  const [groomers, setGroomers] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        console.error("Error fetching profile:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
      });
  }, [navigate, token]);


  useEffect(() => {
    if (user?._id && token) {
      axios
        .get(`${API}/api/vet-profiles/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setVets(res.data.vets || []))
        .catch((err) =>
          console.error("Error fetching user vets:", err.response?.data || err)
        );
    }
  }, [user, token]);


  useEffect(() => {
    if (user?._id && token) {
      axios
        .get(`${API}/api/pets/user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPets(res.data.pets || []))
        .catch((err) =>
          console.error("Error fetching user pets:", err.response?.data || err)
        );
    }
  }, [user, token]);

  useEffect(() => {
    if (user?._id && token) {
      axios
        .get(`${API}/api/grooming-profiles/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setGroomers(res.data.groomingProfiles || []))
        .catch((err) =>
          console.error("Error fetching user grooming profiles:", err.response?.data || err)
        );
    }
  }, [user, token]);


  const handleLogout = async () => {
    try {
      await axios.post(`${API}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    

    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
      if (currentUser.id) {
        localStorage.removeItem(`wishlist_${currentUser.id}`);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
    
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("wishlist");
    navigate("/login");
  };


  const handleDeleteAccount = () => {
    showConfirmation({
      title: "Delete Account",
      message: "Are you sure you want to permanently delete your account? This action cannot be undone and you will lose all your data.",
      type: "deleteAccount",
      confirmText: "Delete Account",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await axios.delete(`${API}/api/auth/delete`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          try {
            const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
            if (currentUser.id) {
              localStorage.removeItem(`wishlist_${currentUser.id}`);
            }
          } catch (error) {
            console.error('Error clearing wishlist:', error);
          }
          
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          localStorage.removeItem("wishlist");
          navigate("/login");
        } catch (err) {
          console.error("Delete failed:", err);
        }
      }
    });
  };

  const handleDeleteVet = (vetId) => {
    showConfirmation({
      title: "Delete Vet Profile",
      message: "Are you sure you want to delete this veterinarian profile? This action cannot be undone.",
      type: "delete",
      confirmText: "Delete Profile",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          console.log("Deleting vet with ID:", vetId);
          await axios.delete(`${API}/api/vet-profiles/${vetId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setVets((prev) => prev.filter((v) => v._id !== vetId));
          showSnackbar("Vet profile deleted successfully!", "success");
        } catch (err) {
          console.error("Error deleting vet:", err.response?.data || err);
          console.error("API URL:", `${API}/api/vet-profiles/${vetId}`);
          const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to delete vet profile. Please try again.";
          showSnackbar(errorMessage, "error");
        }
      }
    });
  };

  const handleDeletePet = (petId) => {
    showConfirmation({
      title: "Delete Pet Listing",
      message: "Are you sure you want to remove this pet from the marketplace? This action cannot be undone.",
      type: "delete",
      confirmText: "Delete Listing",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          console.log("Deleting pet with ID:", petId);
          await axios.delete(`${API}/api/pets/${petId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPets((prev) => prev.filter((p) => p._id !== petId));
          showSnackbar("Pet listing deleted successfully!", "success");
        } catch (err) {
          console.error("Error deleting pet:", err.response?.data || err);
          console.error("API URL:", `${API}/api/pets/${petId}`);
          const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to delete pet. Please try again.";
          showSnackbar(errorMessage, "error");
        }
      }
    });
  };

  const handleViewPet = (petId) => navigate(`/marketplace/${petId}`);
  const handleEditPet = (petId) => {
    navigate(`/pet-edit/${petId}`);
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("profilePicture", file);
    if (user.profilePicture) formData.append("oldPicture", user.profilePicture);

    try {
      setUploading(true);
      const res = await axios.post(`${API}/api/auth/upload-profile-picture`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });

      setUser((prev) => ({ ...prev, ...res.data.user }));
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Error uploading profile photo:", err.response?.data || err);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">

      <aside className="w-full md:w-64 bg-white border-b md:border-r shadow-sm p-6 flex flex-col">
        <div className="text-center mb-6 md:mb-8">
          <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto">
            <img
              src={getImageUrl(user.profilePicture || user.profilePictureUrl, "https://via.placeholder.com/150")}
              alt={user.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto object-cover border-4 border-gray-200 shadow"
            />
            <label htmlFor="profilePicInput" className="absolute bottom-2 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700" title="Change photo">
              <Edit size={16} />
            </label>
            <input id="profilePicInput" type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
          </div>
          <h2 className="text-base md:text-lg font-semibold mt-3 text-gray-800">{user.name}</h2>
          <p className="text-xs md:text-sm text-gray-500">{user.email}</p>
          {uploading && <p className="text-xs text-blue-600 mt-2">Updating photo...</p>}
        </div>

        <nav className="flex md:flex-col justify-center md:justify-start gap-2 md:space-y-2">
          <button onClick={() => setActiveTab("profile")} className={`px-3 md:px-4 py-2 rounded-lg font-medium ${activeTab === "profile" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>Profile</button>
          <button onClick={() => setActiveTab("services")} className={`px-3 md:px-4 py-2 rounded-lg font-medium ${activeTab === "services" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>Vet Services</button>
          <button onClick={() => setActiveTab("pets")} className={`px-3 md:px-4 py-2 rounded-lg font-medium ${activeTab === "pets" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>My Pets</button>
          <button onClick={() => setActiveTab("grooming")} className={`px-3 md:px-4 py-2 rounded-lg font-medium ${activeTab === "grooming" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>Grooming</button>
        </nav>
      </aside>


      <main className="flex-1 p-4 md:p-8">

        {activeTab === "profile" && (
          <div className="bg-white shadow rounded-lg p-4 md:p-6 space-y-4">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Profile Information</h3>
            <div className="space-y-2 text-sm md:text-base">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role || "N/A"}</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium w-full sm:w-auto">Logout</button>
              <button onClick={handleDeleteAccount} className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium w-full sm:w-auto">Delete Account</button>
            </div>
          </div>
        )}


        {activeTab === "services" && (
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Your Vet Profiles</h3>
            {vets.length === 0 ? (
              <p className="text-gray-500">You haven’t uploaded any vet profiles.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {vets.map((vet) => (
                  <div key={vet._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50">
                    <div className="flex flex-col items-center text-center">
                      <img 
                        src={getImageUrl(vet.profilePhoto, "https://via.placeholder.com/150")} 
                        alt={vet.fullName} 
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-200" 
                      />
                      <h4 className="text-base md:text-lg font-medium mt-3 text-gray-800">{vet.fullName}</h4>
                      <p className="text-xs md:text-sm text-gray-600">{vet.specialization || "Not specified"}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        vet.isApproved === true ? "bg-green-100 text-green-800" : 
                        vet.isApproved === false ? "bg-red-100 text-red-800" : 
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {vet.isApproved === true ? "Approved" : 
                         vet.isApproved === false ? "Rejected" : 
                         "Waiting for Approval"}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <button className="px-3 py-1 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 text-xs font-medium" onClick={() => navigate(`/vet-profile/${vet._id}`)}>View</button>
                      <button className="px-3 py-1 rounded-lg border border-green-500 text-green-600 hover:bg-green-50 text-xs font-medium" onClick={() => navigate(`/vet-edit/${vet._id}`)}>Edit</button>
                      <button className="px-3 py-1 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 text-xs font-medium" onClick={() => handleDeleteVet(vet._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {activeTab === "pets" && (
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Your Pets</h3>
            {pets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't listed any pets yet.</p>
                <button onClick={() => navigate("/pet-form")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Add Your First Pet</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {pets.map((pet) => (
                  <div key={pet._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50">
                    <div className="flex flex-col items-center text-center">
                      <img 
                        src={getImageUrl(pet.image, "https://via.placeholder.com/150")} 
                        alt={pet.name || "Pet"} 
                        className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border-2 border-gray-200" 
                      />
                      <h4 className="text-base md:text-lg font-medium mt-3 text-gray-800">{pet.name || "Unnamed Pet"}</h4>
                      <p className="text-xs md:text-sm text-gray-600">{pet.species || "species"} • {pet.breed || "Unknown breed"}</p>
                      <p className="text-sm font-medium text-green-600 mt-1">{pet.price === 0 ? "Free" : `Rs.${pet.price}`}</p>
                      <div className="flex flex-wrap justify-center gap-1 mt-2">

                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pet.isApproved === true ? "bg-green-100 text-green-800" : 
                          pet.isApproved === false ? "bg-red-100 text-red-800" : 
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {pet.isApproved === true ? "Approved" : 
                           pet.isApproved === false ? "Rejected" : 
                           "Waiting for Approval"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{pet.description || `Healthy ${pet.species?.toLowerCase() || "pet"}`}</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <button className="px-3 py-1 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 text-xs font-medium" onClick={() => navigate(`/marketplace/${pet._id}`)}>View</button>
                      <button className="px-3 py-1 rounded-lg border border-green-500 text-green-600 hover:bg-green-50 text-xs font-medium" onClick={() => handleEditPet(pet._id)}>Edit</button>
                      <button className="px-3 py-1 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 text-xs font-medium" onClick={() => handleDeletePet(pet._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === "grooming" && (
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Your Grooming Shops</h3>
            {groomers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't added any grooming shop profiles yet.</p>
                <button onClick={() => navigate("/grooming/add")} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">Add Your Grooming Shop</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {groomers.map((groomer) => (
                  <div key={groomer._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50">
                    <div className="flex flex-col items-center text-center">
                      {groomer.shopImage ? (
                        <img 
                          src={groomer.shopImage} 
                          alt={groomer.shopName} 
                          className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border-2 border-gray-200" 
                        />
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                          {groomer.shopName?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <h4 className="text-base md:text-lg font-medium mt-3 text-gray-800">{groomer.shopName}</h4>
                      <p className="text-xs md:text-sm text-gray-600">{groomer.city}</p>
                      <p className="text-xs text-gray-500 mt-1">{groomer.phone}</p>
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          groomer.isApproved === true ? "bg-green-100 text-green-800" : 
                          groomer.isApproved === false ? "bg-red-100 text-red-800" : 
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {groomer.isApproved === true ? "Approved" : 
                           groomer.isApproved === false ? "Rejected" : 
                           "Waiting for Approval"}
                        </span>
                      </div>
                      {groomer.services && groomer.services.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                          {groomer.services.slice(0, 3).map((service, idx) => (
                            <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                              {service}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
      </main>
      
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        loading={confirmLoading}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        type={confirmConfig.type}
      />
      
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />
    </div>
  );
};

export default UserProfile;
