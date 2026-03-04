import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1447E6] text-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-full">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-white">
                <path d="M12 2C10.896 2 10 2.896 10 4s.896 2 2 2 2-.896 2-2-.896-2-2-2zM7 4c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM4 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm16 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM12 9c-3.86 0-7 3.14-7 7 0 2.21 1.03 4.18 2.64 5.45.18.15.42.22.65.18.24-.04.45-.18.58-.39l2.13-3.55c.13-.22.2-.47.2-.73 0-.83-.67-1.5-1.5-1.5S8.2 15.13 8.2 15.96c0 .26.07.51.2.73l-1.65 2.75C5.63 18.24 5 17.18 5 16c0-2.76 2.24-5 5-5h4c2.76 0 5 2.24 5 5 0 1.18-.63 2.24-1.75 3.44l-1.65-2.75c.13-.22.2-.47.2-.73 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5c0 .26.07.51.2.73l2.13 3.55c.13.21.34.35.58.39.23.04.47-.03.65-.18C18.97 20.18 20 18.21 20 16c0-3.86-3.14-7-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Paws City</h3>
              <p className="text-blue-300 text-sm">Your Pet Paradise</p>
            </div>
          </div>
          <p className="mt-4 text-gray-300 text-sm leading-relaxed">
            Connecting pet lovers with their perfect companions and providing
            comprehensive pet care services.
          </p>
          <div className="flex space-x-3 mt-4">
            <a href="#" className="bg-blue-800 hover:bg-blue-700 p-2 rounded-md">
              <Facebook size={18} />
            </a>
            <a href="#" className="bg-blue-800 hover:bg-blue-700 p-2 rounded-md">
              <Twitter size={18} />
            </a>
            <a href="#" className="bg-blue-800 hover:bg-blue-700 p-2 rounded-md">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3 border-b border-blue-700 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-2 text-blue-300 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/marketplace" className="hover:text-white transition-colors">Pet Marketplace</Link></li>
            <li><Link to="/volunteer" className="hover:text-white transition-colors">Volunteer Adoption</Link></li>
            <li><Link to="/veterinary" className="hover:text-white transition-colors">Veterinary Services</Link></li>
            <li><Link to="/grooming" className="hover:text-white transition-colors">Grooming Services</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold mb-3 border-b border-blue-700 pb-2">
            Our Services
          </h4>
          <ul className="space-y-2 text-blue-300 text-sm">
            <li><Link to="/volunteer" className="hover:text-white transition-colors">Free Pet Adoption</Link></li>
            <li><Link to="/marketplace" className="hover:text-white transition-colors">Buy/Sell Pets</Link></li>
            <li><Link to="/veterinary" className="hover:text-white transition-colors">Veterinary Care</Link></li>
            <li><Link to="/grooming" className="hover:text-white transition-colors">Pet Grooming</Link></li>
            <li><Link to="/veterinary-form" className="hover:text-white transition-colors">Register as Vet</Link></li>
            <li><Link to="/grooming/add" className="hover:text-white transition-colors">Register Grooming</Link></li>
            <li><Link to="/pet-form" className="hover:text-white transition-colors">Add Your Pet</Link></li>
          </ul>
        </div>

        {/* User Section */}
        <div>
          <h4 className="text-lg font-semibold mb-3 border-b border-blue-700 pb-2">
            User Area
          </h4>
          <ul className="space-y-2 text-blue-300 text-sm mb-6">
            <li><Link to="/user-profile" className="hover:text-white transition-colors">My Profile</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Login / Register</Link></li>
            <li><Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
          </ul>

          <h4 className="text-lg font-semibold mb-3 border-b border-blue-700 pb-2">
            Contact Us
          </h4>
          <div className="space-y-3 text-gray-300 text-sm">
            <a href="tel:5551234PAWS" className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
              <Phone size={16} /> <span>(555) 123-PAWS</span>
            </a>
            <a href="mailto:info@pawscity.com" className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
              <Mail size={16} /> <span>info@pawscity.com</span>
            </a>
            <p className="flex items-center space-x-2">
              <MapPin size={16} /> <span>123 Pet Street, Animal City</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-blue-800 mt-10 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Paws City. All rights reserved. Made with ❤️ for pet lovers.
      </div>
    </footer>
  );
};

export default Footer;
