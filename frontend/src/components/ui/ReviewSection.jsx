import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaTrash } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ReviewSection({ targetType, targetId }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/api/reviews/${targetId}`);
      setReviews(response.data.reviews);
      setAvgRating(response.data.avgRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUserId(user.id);
    }
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/api/reviews/${targetId}`);
        setReviews(response.data.reviews);
        setAvgRating(response.data.avgRating);
        setTotalReviews(response.data.totalReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    
    fetchData();
  }, [targetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please login to leave a review");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API}/api/reviews`,
        { targetType, targetId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      setRating(5);
      fetchReviews();
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header with Average Rating */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A237E]">Reviews & Ratings</h2>
        <div className="text-center">
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-500 text-2xl" />
            <span className="text-3xl font-bold text-[#1A237E]">{avgRating}</span>
          </div>
          <p className="text-sm text-gray-600">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
        </div>
      </div>

      {/* Add Review Form */}
      {isLoggedIn && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-[#EEF7FE] rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave a Review</h3>
          
          {/* Rating Stars */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          {/* Comment Textarea */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent resize-none"
            rows="4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-[#1E88E5] text-white px-6 py-2 rounded-lg hover:bg-[#1565C0] transition disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#1E88E5] text-white flex items-center justify-center font-bold">
                    {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{review.user?.name || "Anonymous"}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < review.rating ? "text-yellow-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {currentUserId === review.user?._id && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <p className="text-gray-700 ml-13">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
