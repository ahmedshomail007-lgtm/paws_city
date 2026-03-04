import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { WishlistProvider } from "./contexts/WishlistContext";
import './index.css'

createRoot(document.getElementById("root")).render(<Main />);

function Main() {
  const router = createBrowserRouter(AppRoutes);

  return (
  <StrictMode>
    <WishlistProvider>
      <RouterProvider router={router} />
    </WishlistProvider>
  </StrictMode>
)}

export default Main;