import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiBell, FiSearch, FiUsers, FiCheckCircle, FiXCircle, FiBarChart2 } from "react-icons/fi";
import { FaRegUserCircle, FaPaw, FaUserMd, FaCut } from "react-icons/fa";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import { useConfirmation } from "../hooks/useConfirmation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const { 
    isOpen: isConfirmOpen, 
    config: confirmConfig, 
    loading: confirmLoading, 
    showConfirmation, 
    hideConfirmation, 
    handleConfirm 
  } = useConfirmation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [vets, setVets] = useState([]);
  const [pets, setPets] = useState([]);
  const [groomers, setGroomers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  
  const [showVetModal, setShowVetModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [selectedVetDetails, setSelectedVetDetails] = useState(null);
  const [selectedPetDetails, setSelectedPetDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => {
      setSnackbar({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const hideSnackbar = () => {
    setSnackbar({ show: false, message: "", type: "success" });
  };

  const adminLogin = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API}/api/admin/login`, credentials, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const adminRegister = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API}/api/admin/register`, userData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/api/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setDashboardStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setUsers(response.data.users || response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchVets = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/api/admin/vet-profiles`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setVets(response.data.vetProfiles || response.data);
    } catch (error) {
      console.error("Error fetching vets:", error);
    }
  };

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/api/admin/pets`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setPets(response.data.pets || response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const fetchGroomers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/api/admin/grooming-profiles`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setGroomers(response.data.groomingProfiles || response.data);
    } catch (error) {
      console.error("Error fetching grooming profiles:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await adminLogin(loginData);
      setIsAuthenticated(true);
      localStorage.setItem("adminToken", result.token);
      localStorage.setItem("adminAuth", "true");
      await fetchDashboardStats();
    } catch (error) {
      showSnackbar(error.error || "Login failed", "error");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      showSnackbar("Passwords don't match", "error");
      return;
    }
    try {
      await adminRegister(signupData);
      showSnackbar("Admin account created successfully! Please login.", "success");
      setIsLogin(true);
    } catch (error) {
      showSnackbar(error.error || "Registration failed", "error");
    }
  };

  const handleLogout = () => {
    showConfirmation({
      title: "Admin Logout",
      message: "Are you sure you want to logout from the admin panel?",
      type: "logout",
      confirmText: "Logout",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await axios.post(`${API}/api/admin/logout`, {}, { withCredentials: true });
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          setIsAuthenticated(false);
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminToken");
        }
      }
    });
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth");
    const token = localStorage.getItem("adminToken");
    if (authStatus === "true" && token) {
      setIsAuthenticated(true);
      fetchDashboardStats();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    switch (activePage) {
      case "dashboard":
        fetchDashboardStats();
        break;
      case "users":
        fetchUsers();
        break;
      case "vet-approval":
        fetchVets();
        break;
      case "pet-approval":
        fetchPets();
        break;
      case "grooming-approval":
        fetchGroomers();
        break;
    }
  }, [activePage, isAuthenticated]);

  const removeUser = (userId) => {
    const user = users.find(u => u._id === userId);
    showConfirmation({
      title: "Remove User",
      message: `Are you sure you want to permanently remove user "${user?.name || 'this user'}"? This action cannot be undone and will delete all their data.`,
      type: "danger",
      confirmText: "Remove User",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("adminToken");
          await axios.delete(`${API}/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });
          setUsers(users.filter(user => user._id !== userId));
          showSnackbar("User removed successfully", "success");
        } catch (error) {
          console.error("Error removing user:", error);
          showSnackbar("Failed to remove user", "error");
        }
      }
    });
  };

  const approveVet = async (vetId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`${API}/api/admin/vet-profiles/${vetId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setVets(vets.map(vet => 
        vet._id === vetId ? { ...vet, isApproved: true } : vet
      ));
      showSnackbar("Vet profile approved successfully", "success");
    } catch (error) {
      console.error("Error approving vet:", error);
      showSnackbar("Failed to approve vet profile", "error");
    }
  };

  const rejectVet = (vetId) => {
    const vet = vets.find(v => v._id === vetId);
    showConfirmation({
      title: "Reject Vet Profile",
      message: `Are you sure you want to reject the veterinarian profile for "${vet?.fullName || 'this vet'}"? They will be notified of this decision.`,
      type: "warning",
      confirmText: "Reject Profile",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("adminToken");
          await axios.put(`${API}/api/admin/vet-profiles/${vetId}/reject`, {
            reason: "Did not meet requirements"
          }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });
      setVets(vets.map(vet => 
        vet._id === vetId ? { ...vet, isApproved: false } : vet
      ));
          showSnackbar("Vet profile rejected", "warning");
        } catch (error) {
          console.error("Error rejecting vet:", error);
          showSnackbar("Failed to reject vet profile", "error");
        }
      }
    });
  };

  const approvePet = async (petId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`${API}/api/admin/pets/${petId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setPets(pets.map(pet => 
        pet._id === petId ? { ...pet, isApproved: true } : pet
      ));
      showSnackbar("Pet listing approved successfully", "success");
    } catch (error) {
      console.error("Error approving pet:", error);
      showSnackbar("Failed to approve pet", "error");
    }
  };

  const rejectPet = (petId) => {
    const pet = pets.find(p => p._id === petId);
    showConfirmation({
      title: "Reject Pet Listing",
      message: `Are you sure you want to reject the pet listing for "${pet?.name || 'this pet'}"? The owner will be notified of this decision.`,
      type: "warning",
      confirmText: "Reject Listing",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("adminToken");
          await axios.put(`${API}/api/admin/pets/${petId}/reject`, {
            reason: "Did not meet requirements"
          }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
      });
      setPets(pets.map(pet => 
        pet._id === petId ? { ...pet, isApproved: false } : pet
      ));
          showSnackbar("Pet listing rejected", "warning");
        } catch (error) {
          console.error("Error rejecting pet:", error);
          showSnackbar("Failed to reject pet", "error");
        }
      }
    });
  };

  const approveGroomer = async (groomerId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`${API}/api/admin/grooming-profiles/${groomerId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setGroomers(groomers.map(groomer => 
        groomer._id === groomerId ? { ...groomer, isApproved: true } : groomer
      ));
      showSnackbar("Grooming profile approved successfully", "success");
    } catch (error) {
      console.error("Error approving grooming profile:", error);
      showSnackbar("Failed to approve grooming profile", "error");
    }
  };

  const rejectGroomer = (groomerId) => {
    const groomer = groomers.find(g => g._id === groomerId);
    showConfirmation({
      title: "Reject Grooming Profile",
      message: `Are you sure you want to reject the grooming shop "${groomer?.shopName || 'this shop'}"? The owner will be notified of this decision.`,
      type: "warning",
      confirmText: "Reject Profile",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("adminToken");
          await axios.put(`${API}/api/admin/grooming-profiles/${groomerId}/reject`, {
            reason: "Did not meet requirements"
          }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });
          setGroomers(groomers.map(groomer => 
            groomer._id === groomerId ? { ...groomer, isApproved: false } : groomer
          ));
          showSnackbar("Grooming profile rejected", "warning");
        } catch (error) {
          console.error("Error rejecting grooming profile:", error);
          showSnackbar("Failed to reject grooming profile", "error");
        }
      }
    });
  };

  const fetchVetDetails = async (vetId) => {
    try {
      setModalLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/api/admin/vet-profiles/${vetId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSelectedVetDetails(response.data.vetProfile);
      setShowVetModal(true);
    } catch (error) {
      console.error("Error fetching vet details:", error);
      showSnackbar("Failed to fetch vet details", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const fetchPetDetails = async (petId) => {
    try {
      setModalLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/api/admin/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setSelectedPetDetails(response.data.pet);
      setShowPetModal(true);
    } catch (error) {
      console.error("Error fetching pet details:", error);
      showSnackbar("Failed to fetch pet details", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleVetApprovalFromModal = async (vetId, action, reason = "") => {
    try {
      const token = localStorage.getItem("adminToken");
      if (action === "approve") {
        await axios.put(`${API}/api/admin/vet-profiles/${vetId}/approve`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
      } else {
        await axios.put(`${API}/api/admin/vet-profiles/${vetId}/reject`, {
          reason: reason || "Did not meet requirements"
        }, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
      }
      
      setVets(vets.map(vet => 
        vet._id === vetId ? { ...vet, isApproved: action === "approve" } : vet
      ));
      setShowVetModal(false);
      setSelectedVetDetails(null);
      showSnackbar(`Vet profile ${action}d successfully`, action === "approve" ? "success" : "warning");
    } catch (error) {
      console.error(`Error ${action}ing vet:`, error);
      showSnackbar(`Failed to ${action} vet profile`, "error");
    }
  };

  const handlePetApprovalFromModal = async (petId, action, reason = "") => {
    try {
      const token = localStorage.getItem("adminToken");
      if (action === "approve") {
        await axios.put(`${API}/api/admin/pets/${petId}/approve`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
      } else {
        await axios.put(`${API}/api/admin/pets/${petId}/reject`, {
          reason: reason || "Did not meet requirements"
        }, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
      }
      
      setPets(pets.map(pet => 
        pet._id === petId ? { ...pet, isApproved: action === "approve" } : pet
      ));
      setShowPetModal(false);
      setSelectedPetDetails(null);
      showSnackbar(`Pet listing ${action}d successfully`, action === "approve" ? "success" : "warning");
    } catch (error) {
      console.error(`Error ${action}ing pet:`, error);
      showSnackbar(`Failed to ${action} pet`, "error");
    }
  };

  const authFormJSX = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? "Admin Login" : "Create Admin Account"}
          </h2>
          <p className="mt-2 text-gray-600">PawCity Admin Panel</p>
        </div>
        
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={signupData.name}
              onChange={(e) => setSignupData({...signupData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email Address"
            value={isLogin ? loginData.email : signupData.email}
            onChange={(e) => isLogin 
              ? setLoginData({...loginData, email: e.target.value})
              : setSignupData({...signupData, email: e.target.value})
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={isLogin ? loginData.password : signupData.password}
            onChange={(e) => isLogin 
              ? setLoginData({...loginData, password: e.target.value})
              : setSignupData({...signupData, password: e.target.value})
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={signupData.confirmPassword}
              onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Need to create an account?" : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
  );

  const getUserGrowthData = () => {
    if (!dashboardStats?.userGrowth) return null;
    
    const labels = dashboardStats.userGrowth.map(item => 
      `${item._id.month}/${item._id.year}`
    );
    const data = dashboardStats.userGrowth.map(item => item.count);
    
    return {
      labels,
      datasets: [{
        label: 'User Growth',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }]
    };
  };

  const getApprovalStatusData = () => {
    if (!dashboardStats?.stats) return null;
    
    return {
      labels: ['Approved Vets', 'Pending Vets', 'Approved Pets', 'Pending Pets'],
      datasets: [{
        data: [
          dashboardStats.stats.approvedVets,
          dashboardStats.stats.pendingVets,
          dashboardStats.stats.approvedPets,
          dashboardStats.stats.pendingPets
        ],
        backgroundColor: [
          '#10b981',
          '#f59e0b',
          '#8b5cf6',
          '#ef4444'
        ],
      }]
    };
  };

  const DashboardContent = () => {
    const stats = dashboardStats?.stats;
    const userGrowthData = getUserGrowthData();
    const approvalStatusData = getApprovalStatusData();

    return (
      <>
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <FiUsers className="text-blue-500 text-2xl mr-3" />
              <div>
                <h3 className="text-gray-500">Total Users</h3>
                <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                <p className="text-green-500 text-sm mt-2">▲ 11.01%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <FaUserMd className="text-green-500 text-2xl mr-3" />
              <div>
                <h3 className="text-gray-500">Pending Vets</h3>
                <p className="text-3xl font-bold">{stats?.pendingVets || 0}</p>
                <p className="text-yellow-500 text-sm mt-2">Awaiting Approval</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <FaPaw className="text-purple-500 text-2xl mr-3" />
              <div>
                <h3 className="text-gray-500">Pending Pets</h3>
                <p className="text-3xl font-bold">{stats?.pendingPets || 0}</p>
                <p className="text-yellow-500 text-sm mt-2">Awaiting Approval</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <FaCut className="text-orange-500 text-2xl mr-3" />
              <div>
                <h3 className="text-gray-500">Pending Groomers</h3>
                <p className="text-3xl font-bold">{stats?.pendingGroomers || 0}</p>
                <p className="text-yellow-500 text-sm mt-2">Awaiting Approval</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-gray-700 font-semibold mb-4">User Growth (Last 6 Months)</h3>
            <div className="h-64">
              {userGrowthData ? (
                <Line 
                  data={userGrowthData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No user growth data available
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-gray-700 font-semibold mb-4">Approval Status Distribution</h3>
            <div className="h-64">
              {approvalStatusData ? (
                <Pie 
                  data={approvalStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No approval data available
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-700 font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardStats?.recentActivity?.users?.slice(0, 3).map((user, index) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded">
                <FiUsers className="text-blue-500 mr-3" />
                <span>New user registered: {user.email}</span>
              </div>
            ))}
            {dashboardStats?.recentActivity?.vets?.slice(0, 2).map((vet, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 rounded">
                <FaUserMd className="text-green-500 mr-3" />
                <span>Vet application: {vet.user?.name || 'Unknown'} - {vet.specialization}</span>
              </div>
            ))}
            {dashboardStats?.recentActivity?.pets?.slice(0, 2).map((pet, index) => (
              <div key={index} className="flex items-center p-3 bg-purple-50 rounded">
                <FaPaw className="text-purple-500 mr-3" />
                <span>Pet registered: {pet.name} ({pet.breed})</span>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  };

  const UsersContent = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">👥 User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Join Date</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b last:border-none">
                <td className="py-3">{user.name}</td>
                <td className="py-3">{user.email}</td>
                <td className="py-3">Pet Owner</td>
                <td className="py-3">
                  <span className="px-3 py-1 text-sm rounded bg-green-100 text-green-600">
                    Active
                  </span>
                </td>
                <td className="py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <button
                    onClick={() => removeUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const VetApprovalContent = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">🩺 Vet Profile Approval</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Specialization</th>
              <th className="pb-2">Experience</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vets.map((vet) => (
              <tr key={vet._id} className="border-b last:border-none">
                <td className="py-3">{vet.fullName}</td>
                <td className="py-3">{vet.email}</td>
                <td className="py-3">{vet.specialization || 'General Practice'}</td>
                <td className="py-3">{vet.experience || 'N/A'} years</td>
                <td className="py-3">
                  <span className={`px-3 py-1 text-sm rounded ${
                    vet.isApproved === true ? "bg-green-100 text-green-600" :
                    vet.isApproved === false ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>
                    {vet.isApproved === true ? "Approved" : 
                     vet.isApproved === false ? "Rejected" : 
                     "Pending"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => fetchVetDetails(vet._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center justify-center"
                    >
                      <FiSearch className="mr-1" /> View Details
                    </button>
                    {vet.isApproved === undefined && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveVet(vet._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center"
                        >
                          <FiCheckCircle className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => rejectVet(vet._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center"
                        >
                          <FiXCircle className="mr-1" /> Reject
                        </button>
                      </div>
                    )}
                    {vet.isApproved !== undefined && (
                      <span className="text-gray-500 text-sm">Decision made</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PetApprovalContent = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">🐾 Pet Profile Approval</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="pb-2">Pet Name</th>
              <th className="pb-2">Breed</th>
              <th className="pb-2">Age</th>
              <th className="pb-2">Owner</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet._id} className="border-b last:border-none">
                <td className="py-3">{pet.name}</td>
                <td className="py-3">{pet.breed}</td>
                <td className="py-3">
                    {pet.age ? `${pet.age} years` : 'N/A'}
                </td>
                <td className="py-3">{pet.owner?.name || 'Unknown'}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 text-sm rounded ${
                    pet.isApproved === true ? "bg-green-100 text-green-600" :
                    pet.isApproved === false ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>
                    {pet.isApproved === true ? "Approved" : 
                     pet.isApproved === false ? "Rejected" : 
                     "Pending"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => fetchPetDetails(pet._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center justify-center"
                    >
                      <FiSearch className="mr-1" /> View Details
                    </button>
                    {pet.isApproved === undefined && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approvePet(pet._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center"
                        >
                          <FiCheckCircle className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => rejectPet(pet._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center"
                        >
                          <FiXCircle className="mr-1" /> Reject
                        </button>
                      </div>
                    )}
                    {pet.isApproved !== undefined && (
                      <span className="text-gray-500 text-sm">Decision made</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const GroomingApprovalContent = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">✂️ Grooming Shop Approval</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="pb-2">Shop Name</th>
              <th className="pb-2">Owner</th>
              <th className="pb-2">City</th>
              <th className="pb-2">Phone</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groomers.map((groomer) => (
              <tr key={groomer._id} className="border-b last:border-none">
                <td className="py-3">{groomer.shopName}</td>
                <td className="py-3">{groomer.ownerName}</td>
                <td className="py-3">{groomer.city}</td>
                <td className="py-3">{groomer.phone}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 text-sm rounded ${
                    groomer.isApproved === true ? "bg-green-100 text-green-600" :
                    groomer.isApproved === false ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>
                    {groomer.isApproved === true ? "Approved" : 
                     groomer.isApproved === false ? "Rejected" : 
                     "Pending"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex flex-col space-y-2">
                    {groomer.isApproved === undefined && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveGroomer(groomer._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center"
                        >
                          <FiCheckCircle className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => rejectGroomer(groomer._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center"
                        >
                          <FiXCircle className="mr-1" /> Reject
                        </button>
                      </div>
                    )}
                    {groomer.isApproved !== undefined && (
                      <span className="text-gray-500 text-sm">Decision made</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {groomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No grooming profiles to review
          </div>
        )}
      </div>
    </div>
  );

  const VetDetailsModal = () => {
    const [rejectionReason, setRejectionReason] = useState("");
    
    if (!showVetModal || !selectedVetDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {modalLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Veterinarian Application Details</h2>
                <button
                  onClick={() => {
                    setShowVetModal(false);
                    setSelectedVetDetails(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                  {selectedVetDetails.profilePhoto && (
                    <img
                      src={selectedVetDetails.profilePhoto}
                      alt="Profile"
                      className="w-20 h-20 rounded-full mb-3 object-cover"
                    />
                  )}
                  <p><strong>Full Name:</strong> {selectedVetDetails.fullName}</p>
                  <p><strong>Email:</strong> {selectedVetDetails.email}</p>
                  <p><strong>Phone:</strong> {selectedVetDetails.phone}</p>
                  <p><strong>Government ID:</strong> {selectedVetDetails.govtId}</p>
                  <p><strong>Degree:</strong> {selectedVetDetails.degree}</p>
                  <p><strong>License Number:</strong> {selectedVetDetails.licenseNo}</p>
                  <p><strong>Issuing Authority:</strong> {selectedVetDetails.issuingAuthority}</p>
                  <p><strong>License Expiry:</strong> {selectedVetDetails.expiryDate ? new Date(selectedVetDetails.expiryDate).toLocaleDateString() : 'N/A'}</p>
                  {selectedVetDetails.user && (
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <h4 className="font-medium">User Account Info:</h4>
                      <p><strong>Account Name:</strong> {selectedVetDetails.user.name}</p>
                      <p><strong>Account Email:</strong> {selectedVetDetails.user.email}</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Professional Details</h3>
                  <p><strong>Specialization:</strong> {selectedVetDetails.specialization || 'General Practice'}</p>
                  <p><strong>Experience:</strong> {selectedVetDetails.experience ? `${selectedVetDetails.experience} years` : 'Not specified'}</p>
                  <p><strong>Clinic:</strong> {selectedVetDetails.clinic || 'Not specified'}</p>
                  <p><strong>Working Hours:</strong> {selectedVetDetails.workingHours || 'Not specified'}</p>
                  
                  {selectedVetDetails.services?.length > 0 && (
                    <div className="mt-3">
                      <strong>Services Offered:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {selectedVetDetails.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 p-3 bg-yellow-50 rounded">
                    <h4 className="font-medium">Application Status:</h4>
                    <p><strong>Status:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                        selectedVetDetails.isApproved === true ? 'bg-green-100 text-green-800' : 
                        selectedVetDetails.isApproved === false ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedVetDetails.isApproved === true ? 'Approved' : 
                         selectedVetDetails.isApproved === false ? 'Rejected' : 
                         'Pending Review'}
                      </span>
                    </p>
                    {selectedVetDetails.approvedAt && (
                      <p><strong>Approved At:</strong> {new Date(selectedVetDetails.approvedAt).toLocaleString()}</p>
                    )}
                    {selectedVetDetails.rejectedAt && (
                      <>
                        <p><strong>Rejected At:</strong> {new Date(selectedVetDetails.rejectedAt).toLocaleString()}</p>
                        {selectedVetDetails.rejectionReason && (
                          <p><strong>Rejection Reason:</strong> {selectedVetDetails.rejectionReason}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold mb-3">Application Timeline</h3>
                <p><strong>Profile Created:</strong> {new Date(selectedVetDetails.createdAt).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedVetDetails.updatedAt).toLocaleString()}</p>
              </div>

              {selectedVetDetails.isApproved === undefined && (
                <div className="mt-6 flex flex-col space-y-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleVetApprovalFromModal(selectedVetDetails._id, "approve")}
                      className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 flex items-center"
                    >
                      <FiCheckCircle className="mr-2" /> Approve Application
                    </button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2">Rejection Reason (optional):</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      rows="3"
                      placeholder="Enter reason for rejection..."
                    />
                    <button
                      onClick={() => handleVetApprovalFromModal(selectedVetDetails._id, "reject", rejectionReason)}
                      className="mt-2 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 flex items-center"
                    >
                      <FiXCircle className="mr-2" /> Reject Application
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const Snackbar = () => {
    if (!snackbar.show) return null;

    const bgColor = snackbar.type === "success" ? "bg-green-500" : 
                   snackbar.type === "error" ? "bg-red-500" : 
                   snackbar.type === "warning" ? "bg-yellow-500" : "bg-blue-500";

    return (
      <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300`}>
        <span>{snackbar.message}</span>
        <button
          onClick={hideSnackbar}
          className="ml-2 text-white hover:text-gray-200 font-bold"
        >
          ×
        </button>
      </div>
    );
  };

  const PetDetailsModal = () => {
    const [rejectionReason, setRejectionReason] = useState("");
    
    if (!showPetModal || !selectedPetDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {modalLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Pet Application Details</h2>
                <button
                  onClick={() => {
                    setShowPetModal(false);
                    setSelectedPetDetails(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Pet Information</h3>
                  {selectedPetDetails.images && selectedPetDetails.images.length > 0 && (
                    <img
                      src={selectedPetDetails.images[0]}
                      alt={selectedPetDetails.name}
                      className="w-32 h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <p><strong>Name:</strong> {selectedPetDetails.name}</p>
                  <p><strong>Breed:</strong> {selectedPetDetails.breed}</p>
                  <p><strong>Age:</strong> {selectedPetDetails.age} Years</p>
                  <p><strong>Gender:</strong> {selectedPetDetails.gender}</p>
                  <p><strong>Contact:</strong> {selectedPetDetails.contact}</p>
                  <p><strong>Price:</strong> Rs.{selectedPetDetails.price}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Owner Information</h3>
                  {selectedPetDetails.owner?.profilePicture && (
                    <img
                      src={selectedPetDetails.owner.profilePicture}
                      alt="Owner"
                      className="w-20 h-20 rounded-full mb-3"
                    />
                  )}
                  <p><strong>Name:</strong> {selectedPetDetails.owner?.name}</p>
                  <p><strong>Email:</strong> {selectedPetDetails.owner?.email}</p>
                  <p><strong>User Type:</strong> {selectedPetDetails.owner?.type}</p>
                  <p><strong>Account Status:</strong> {selectedPetDetails.owner?.status}</p>
                  <p><strong>Member Since:</strong> {new Date(selectedPetDetails.owner?.createdAt).toLocaleDateString()}</p>
                  
                  {selectedPetDetails.owner?.address && (
                    <div className="mt-2">
                      <strong>Address:</strong>
                      <p>{selectedPetDetails.owner.address.street}</p>
                      <p>{selectedPetDetails.owner.address.city}, {selectedPetDetails.owner.address.state} {selectedPetDetails.owner.address.zipCode}</p>
                      <p>{selectedPetDetails.owner.address.country}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold mb-3">Description & Additional Details</h3>
                <p><strong>Description:</strong> {selectedPetDetails.medicalHistory || 'No description provided'}</p>
                
                {selectedPetDetails.healthInfo && (
                  <div className="mt-3">
                    <p><strong>Health Information:</strong> {selectedPetDetails.healthInfo}</p>
                  </div>
                )}

                {selectedPetDetails.temperament && (
                  <div className="mt-3">
                    <p><strong>Temperament:</strong> {selectedPetDetails.temperament}</p>
                  </div>
                )}

                {selectedPetDetails.specialNeeds && (
                  <div className="mt-3">
                    <p><strong>Special Needs:</strong> {selectedPetDetails.specialNeeds}</p>
                  </div>
                )}
              </div>

              {selectedPetDetails.images && selectedPetDetails.images.length > 1 && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-3">Pet Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedPetDetails.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedPetDetails.name} ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedPetDetails.applicationHistory && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-3">Application History</h3>
                  <p><strong>Submitted:</strong> {new Date(selectedPetDetails.applicationHistory.submittedAt).toLocaleString()}</p>
                  {selectedPetDetails.applicationHistory.approvedAt && (
                    <p><strong>Approved:</strong> {new Date(selectedPetDetails.applicationHistory.approvedAt).toLocaleString()}</p>
                  )}
                  {selectedPetDetails.applicationHistory.rejectedAt && (
                    <>
                      <p><strong>Rejected:</strong> {new Date(selectedPetDetails.applicationHistory.rejectedAt).toLocaleString()}</p>
                      {selectedPetDetails.applicationHistory.rejectionReason && (
                        <p><strong>Reason:</strong> {selectedPetDetails.applicationHistory.rejectionReason}</p>
                      )}
                    </>
                  )}
                </div>
              )}

              {selectedPetDetails.isApproved === undefined && (
                <div className="mt-6 flex flex-col space-y-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handlePetApprovalFromModal(selectedPetDetails._id, "approve")}
                      className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 flex items-center"
                    >
                      <FiCheckCircle className="mr-2" /> Approve Pet Listing
                    </button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2">Rejection Reason (optional):</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      rows="3"
                      placeholder="Enter reason for rejection..."
                    />
                    <button
                      onClick={() => handlePetApprovalFromModal(selectedPetDetails._id, "reject", rejectionReason)}
                      className="mt-2 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 flex items-center"
                    >
                      <FiXCircle className="mr-2" /> Reject Pet Listing
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "users":
        return <UsersContent />;
      case "vet-approval":
        return <VetApprovalContent />;
      case "pet-approval":
        return <PetApprovalContent />;
      case "grooming-approval":
        return <GroomingApprovalContent />;
      case "profile":
        return <div className="bg-white shadow rounded-lg p-6"><h2 className="text-xl font-bold mb-4">👤 Admin Profile</h2><p>Admin profile settings will appear here.</p></div>;
      default:
        return <DashboardContent />;
    }
  };

  if (!isAuthenticated) {
    return authFormJSX;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 font-bold text-xl text-blue-600">PawCity Admin</div>
        <nav className="mt-6 space-y-2">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full text-left px-6 py-2 rounded flex items-center ${
              activePage === "dashboard"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <FiBarChart2 className="mr-2" /> Dashboard
          </button>
          <button
            onClick={() => setActivePage("users")}
            className={`w-full text-left px-6 py-2 rounded flex items-center ${
              activePage === "users"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <FiUsers className="mr-2" /> User Management
          </button>
          <button
            onClick={() => setActivePage("vet-approval")}
            className={`w-full text-left px-6 py-2 rounded flex items-center ${
              activePage === "vet-approval"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <FaUserMd className="mr-2" /> Vet Approval
          </button>
          <button
            onClick={() => setActivePage("pet-approval")}
            className={`w-full text-left px-6 py-2 rounded flex items-center ${
              activePage === "pet-approval"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <FaPaw className="mr-2" /> Pet Approval
          </button>
          <button
            onClick={() => setActivePage("grooming-approval")}
            className={`w-full text-left px-6 py-2 rounded flex items-center ${
              activePage === "grooming-approval"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <FaCut className="mr-2" /> Grooming Approval
          </button>
          <button
            onClick={() => setActivePage("profile")}
            className={`w-full text-left px-6 py-2 rounded flex items-center ${
              activePage === "profile"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <FaRegUserCircle className="mr-2" /> Profile
          </button>
        </nav>
        
        <div className="absolute bottom-4 left-4">
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-4">
            <FiBell className="text-gray-600 text-xl cursor-pointer" />
            <FaRegUserCircle className="text-gray-600 text-2xl cursor-pointer" />
            <span className="text-gray-700 font-medium">Admin</span>
          </div>
        </header>

        {renderContent()}
      </main>

      <VetDetailsModal />
      <PetDetailsModal />
      <Snackbar />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        loading={confirmLoading}
      />
    </div>
  );
};

export default AdminDashboard;
