import React, { useState } from "react";
import axios from "axios";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { Navigate } from "react-router-dom";
import Snackbar from "../components/ui/Snackbar";
import { useSnackbar } from "../hooks/useSnackbar";

// Simple Button component
const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  icon,
  iconOnly = false,
  className = "",
  ...props
}) => {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed",
    secondary:
      "bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-60 disabled:cursor-not-allowed",
    outline:
      "bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed",
    danger:
      "bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeClasses = sizes[size] || sizes.md;
  const variantClasses = variants[variant] || variants.primary;
  const widthClass = fullWidth ? "w-full" : "";
  const iconOnlyClass = iconOnly ? "p-3" : "";

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${iconOnlyClass} ${className}`}
      {...props}
    >
      {icon && !iconOnly && <span className="mr-2">{icon}</span>}
      {iconOnly ? icon : children}
    </button>
  );
};

// Auth component
axios.defaults.withCredentials = true;
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Auth() {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [redirect, setRedirect] = useState(false); // <-- new

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((s) => ({ ...s, [e.target.name]: "" }));
    setServerErr("");
  };

  const validate = () => {
    const errs = {};
    if (mode === "signup" && !form.name) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Min 6 characters required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

const submit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setLoading(true);
  try {
if (mode === "login") {
  const res = await axios.post(`${API}/api/auth/login`, {
    email: form.email,
    password: form.password,
  });


  if (res.data?.user) {
    // Save user in localStorage
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // Save the actual JWT token
    if (res.data.token) {
      localStorage.setItem("authToken", res.data.token);
    }
  }

  setRedirect(true);
} else {
  const res = await axios.post(`${API}/api/auth/register`, {
    name: form.name,
    email: form.email,
    password: form.password,
  });
  
  if (res.data?.user) {
    // Save user in localStorage
    localStorage.setItem("user", JSON.stringify(res.data.user));
    
    // Save the actual JWT token
    if (res.data.token) {
      localStorage.setItem("authToken", res.data.token);
    }
    setRedirect(true);
  } else {
    setMode("login");
    showSnackbar("Registration successful! Please login.", "success");
  }
}
  } catch (err) {
    setServerErr(err?.response?.data?.error || err.message);
  } finally {
    setLoading(false);
  }
};



  // Redirect if login successful
  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="px-8 py-8 text-center">
          <div className="mx-auto w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <FiUser size={24} />
          </div>
          <h1 className="text-2xl font-semibold mt-4 text-gray-800">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "login"
              ? "Sign in to your Paws City account"
              : "Sign up to start using Paws City"}
          </p>
        </div>

        <div className="px-8 pb-8">
          {serverErr && <div className="mb-4 text-red-600">{serverErr}</div>}

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiUser />
                  </span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiMail />
                </span>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
                  placeholder="info@pawscity.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiLock />
                </span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
                  placeholder="••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Signing In..."
                  : "Signing Up..."
                : mode === "login"
                ? "Sign In"
                : "Sign Up"}
            </Button>

            <div className="text-center pt-4 border-t mt-4">
              <p className="text-sm">
                {mode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="font-semibold text-blue-600 hover:underline"
                      onClick={() => setMode("signup")}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="font-semibold text-blue-600 hover:underline"
                      onClick={() => setMode("login")}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
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
