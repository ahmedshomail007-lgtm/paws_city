import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaComment } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CommentSection({ petId }) {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUserId(user.id);
    }
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/api/comments/${petId}`);
        setComments(response.data.comments);
        setTotalComments(response.data.totalComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    
    fetchData();
  }, [petId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API}/api/comments/${petId}`);
      setComments(response.data.comments);
      setTotalComments(response.data.totalComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please login to leave a comment");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API}/api/comments`,
        { petId, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert(error.response?.data?.message || "Failed to submit comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API}/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaComment className="text-[#1E88E5] text-2xl" />
        <h2 className="text-2xl font-bold text-[#1A237E]">Comments ({totalComments})</h2>
      </div>

      {/* Add Comment Form */}
      {isLoggedIn && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-[#EEF7FE] rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave a Comment</h3>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent resize-none"
            rows="4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-[#1E88E5] text-white px-6 py-2 rounded-lg hover:bg-[#1565C0] transition disabled:bg-gray-400"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}

      {!isLoggedIn && (
        <div className="mb-8 p-6 bg-gray-100 rounded-xl text-center">
          <p className="text-gray-600">Please login to leave a comment</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#1E88E5] text-white flex items-center justify-center font-bold">
                    {comment.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{comment.user?.name || "Anonymous"}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {currentUserId === comment.user?._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <p className="text-gray-700 ml-13">{comment.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
