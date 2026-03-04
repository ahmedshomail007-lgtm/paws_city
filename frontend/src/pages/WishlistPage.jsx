import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import PetCard from '../components/ui/PetCard';
import Button from '../components/ui/Button';
import Snackbar from '../components/ui/Snackbar';
import { useSnackbar } from '../hooks/useSnackbar';

function WishlistPage() {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { wishlistItems, clearWishlist, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing pets and add your favorites to your wishlist. You can save pets for later and keep track of the ones you love!
            </p>
            <Button 
              onClick={() => window.location.href = '/marketplace'}
              variant="primary"
              size="lg"
            >
              Browse Pets
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600 mt-1">
                  {wishlistCount} {wishlistCount === 1 ? 'pet' : 'pets'} in your wishlist
                </p>
              </div>
            </div>
            
            {wishlistCount > 0 && (
              <Button
                onClick={clearWishlist}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((pet) => (
            <div key={pet._id} className="relative">
              <PetCard pet={pet} />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <div className="space-x-4">
            <Button
              onClick={() => window.location.href = '/marketplace'}
              variant="secondary"
              size="lg"
            >
              Continue Browsing
            </Button>
            
            <Button
              onClick={() => {
                showSnackbar('Contact functionality coming soon!', 'info');
              }}
              variant="primary"
              size="lg"
            >
              Contact for Adoption
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Found your perfect pet? Get in touch to start the adoption process!
          </p>
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

export default WishlistPage;