import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth";
import Layout from "./pages/Layout";
import PetMarketplace from "./pages/PetMarketplace";
import PetDetailPage from "./pages/PetDetail";
import VeterinaryServices from "./pages/VeterinaryServices";
import GroomingServices from "./pages/GroomingServices";
import VolunteerPage from "./pages/VolunteerPage";
import WishlistPage from "./pages/WishlistPage";
import AdminDashboard from "./pages/AdminDashboard";
import VeterinaryForm from "./components/forms/VetAddForm";
import VetEditForm from "./components/forms/VetEditForm";
import GroomingAddForm from "./components/forms/GroomingAddForm";
import VetProfilePage from "./pages/VetProfilePage";
import GroomingProfilePage from "./pages/GroomingProfilePage";
import UserProfile from "./pages/UserProfile";
import PetForm from "./components/forms/PetForm";
import PetEditForm from "./components/forms/PetEditForm";

export const AppRoutes = [
  { 
    path: "/", 
    element: <Layout />, 
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/marketplace", element: <PetMarketplace /> },
      { path: "/marketplace/:id", element: <PetDetailPage /> },
      { path: "/volunteer", element: <VolunteerPage /> },
      { path: "/veterinary", element: <VeterinaryServices /> },
      { path: "/grooming", element: <GroomingServices /> },
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/veterinary-form", element: <VeterinaryForm/> },
      { path: "/grooming/add", element: <GroomingAddForm /> },
      { path: "/vet-profile/:id", element: <VetProfilePage /> },
      { path: "/grooming-profile/:id", element: <GroomingProfilePage /> },
      { path: "/vet-edit/:id", element: <VetEditForm /> },
      { path: "/user-profile", element: <UserProfile /> },
      { path: "/pet-form", element: <PetForm /> },
      { path: "/pet-edit/:id", element: <PetEditForm /> }
    ]
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/auth", element: <LoginPage /> },
  { path: "/admin", element: <AdminDashboard /> },
];
