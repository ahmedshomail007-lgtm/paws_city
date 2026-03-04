/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Heart,
  User,
  LogOut,
  Home,
  Store,
  Stethoscope,
  Scissors,
  HandHeart,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";
import ConfirmationModal from "./ui/ConfirmationModal";
import { useConfirmation } from "../hooks/useConfirmation";

export default function Header({ currentPage, onPageChange, onLogout }) {
  const { 
    isOpen: isConfirmOpen, 
    config: confirmConfig, 
    loading: confirmLoading, 
    showConfirmation, 
    hideConfirmation, 
    handleConfirm 
  } = useConfirmation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { wishlistCount } = useWishlist();

  const navItems = [
    { id: "home", label: "Home", icon: Home, route: "/" },
    { id: "marketplace", label: "Pet Marketplace", icon: Store, route: "/marketplace" },
    { id: "volunteer", label: "Volunteer Adoption", icon: HandHeart, route: "/volunteer" },
    { id: "veterinary", label: "Veterinary Services", icon: Stethoscope, route: "/veterinary" },
    { id: "grooming", label: "Grooming Services", icon: Scissors, route: "/grooming" },
  ];

  const handleNavClick = (route, id) => {
    navigate(route);
    if (onPageChange) onPageChange(id);
    setIsMobileMenuOpen(false);
  };

  // 🔹 Helper to load user from localStorage
  const loadUser = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUserName(storedUser.name || "User");
      setUserProfilePicture(
        storedUser.profilePictureUrl || storedUser.profilePicture || ""
      );
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setUserProfilePicture("");
    }
  };

  // ✅ Check for token whenever route changes
  useEffect(() => {
    loadUser();
  }, [location.pathname]);

  // ✅ Listen for localStorage changes (profile pic update)
  useEffect(() => {
    const handleStorageChange = () => {
      loadUser();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    showConfirmation({
      title: "Logout",
      message: "Are you sure you want to logout from your account?",
      type: "logout",
      confirmText: "Logout",
      cancelText: "Cancel",
      onConfirm: () => {
        try {
          const user = JSON.parse(localStorage.getItem("user") || '{}');
          if (user.id) {
            localStorage.removeItem(`wishlist_${user.id}`);
          }
        } catch (error) {
          console.error('Error clearing wishlist:', error);
        }
        
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("wishlist");
        setIsLoggedIn(false);
        setUserName("");
        setUserProfilePicture("");
        if (onLogout) onLogout();
        navigate("/login");
      }
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleNavClick("/", "home")}
          >
            <div className="bg-blue-600 p-2 rounded-full">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white"
              >
                <path d="M12 2C10.896 2 10 2.896 10 4s.896 2 2 2 2-.896 2-2-.896-2-2-2zM7 4c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM4 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm16 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM12 9c-3.86 0-7 3.14-7 7 0 2.21 1.03 4.18 2.64 5.45.18.15.42.22.65.18.24-.04.45-.18.58-.39l2.13-3.55c.13-.22.2-.47.2-.73 0-.83-.67-1.5-1.5-1.5S8.2 15.13 8.2 15.96c0 .26.07.51.2.73l-1.65 2.75C5.63 18.24 5 17.18 5 16c0-2.76 2.24-5 5-5h4c2.76 0 5 2.24 5 5 0 1.18-.63 2.24-1.75 3.44l-1.65-2.75c.13-.22.2-.47.2-.73 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5c0 .26.07.51.2.73l2.13 3.55c.13.21.34.35.58.39.23.04.47-.03.65-.18C18.97 20.18 20 18.21 20 16c0-3.86-3.14-7-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-900">Paws City</h1>
              <p className="text-xs text-blue-600">Your Pet Paradise</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ id, label, icon: Icon, route }) => (
              <button
                key={id}
                onClick={() => handleNavClick(route, id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/wishlist')}
              className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Heart className={`w-5 h-5 transition-colors ${
                wishlistCount > 0 ? 'text-red-500 fill-current' : 'text-gray-500'
              }`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

     

            {/* Desktop Auth */}
            <div className="hidden md:flex">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100"
                  >
                    {userProfilePicture ? (
                      <img
                        src={
                          userProfilePicture.startsWith("/")
                            ? `http://localhost:5000${userProfilePicture}`
                            : userProfilePicture
                        }
                        alt={userName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                        {userName.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {userName}
                    </span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={() => navigate("/user-profile")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm flex items-center gap-2"
                      >
                        <User className="w-4 h-4" /> Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 text-sm"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map(({ id, label, icon: Icon, route }) => (
              <button
                key={id}
                onClick={() => handleNavClick(route, id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  currentPage === id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}

            {/* Mobile Auth */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-base text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5" /> Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-base text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 text-base"
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
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
    </header>
  );
}
