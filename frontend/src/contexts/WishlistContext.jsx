import React, { useEffect, useState } from 'react';
import { WishlistContext } from './WishlistContextBase';

// Wishlist Provider Component
function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || null;
    } catch {
      return null;
    }
  };

  // Get user-specific wishlist key
  const getWishlistKey = (userId) => {
    return userId ? `wishlist_${userId}` : 'wishlist';
  };

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const userId = getCurrentUserId();
    setCurrentUserId(userId);
    
    const wishlistKey = getWishlistKey(userId);
    const savedWishlist = localStorage.getItem(wishlistKey);
    
    console.log('Loading wishlist:', { userId, wishlistKey, savedWishlist });
    
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        console.log('Loaded wishlist items:', parsedWishlist);
        setWishlistItems(parsedWishlist);
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        setWishlistItems([]);
      }
    } else {
      console.log('No saved wishlist found, starting with empty array');
      setWishlistItems([]);
    }
    
    setIsInitialized(true);
  }, []);

  // Save wishlist to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (!isInitialized) return;
    
    const userId = getCurrentUserId();
    const wishlistKey = getWishlistKey(userId);
    
    if (userId !== currentUserId) {
      // User changed, reload wishlist for new user
      setCurrentUserId(userId);
      const newWishlistKey = getWishlistKey(userId);
      const savedWishlist = localStorage.getItem(newWishlistKey);
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch {
          setWishlistItems([]);
        }
      } else {
        setWishlistItems([]);
      }
      return;
    }
    
    console.log('Saving wishlist:', { userId, wishlistKey, items: wishlistItems });
    localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, currentUserId, isInitialized]);

  const addToWishlist = (pet) => {
    setWishlistItems(prev => {
      // Check if pet is already in wishlist
      const exists = prev.find(item => item._id === pet._id);
      if (exists) {
        return prev; // Don't add duplicates
      }
      return [...prev, pet];
    });
  };

  const removeFromWishlist = (petId) => {
    setWishlistItems(prev => prev.filter(item => item._id !== petId));
  };

  const isInWishlist = (petId) => {
    return wishlistItems.some(item => item._id === petId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const clearCurrentUserWishlist = () => {
    const userId = getCurrentUserId();
    const wishlistKey = getWishlistKey(userId);
    localStorage.removeItem(wishlistKey);
    setWishlistItems([]);
  };

  const wishlistCount = wishlistItems.length;

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    clearCurrentUserWishlist,
    wishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export { WishlistProvider };