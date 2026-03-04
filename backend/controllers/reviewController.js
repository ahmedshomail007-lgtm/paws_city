import Review from "../models/Review.js";
import VetProfile from "../models/VetProfile.js";
import GroomingProfile from "../models/GroomingProfile.js";

// Add or update review
export const addReview = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;
    const userId = req.user._id;

    // Validate target type
    if (!["VetProfile", "GroomingProfile"].includes(targetType)) {
      return res.status(400).json({ message: "Invalid target type" });
    }

    // Check if target exists
    const Model = targetType === "VetProfile" ? VetProfile : GroomingProfile;
    const target = await Model.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` });
    }

    // Check if user already reviewed this target
    const existingReview = await Review.findOne({ user: userId, targetId });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
      await existingReview.populate("user", "name profilePicture");
      return res.json({ message: "Review updated successfully", review: existingReview });
    }

    // Create new review
    const review = new Review({
      user: userId,
      targetType,
      targetId,
      rating,
      comment,
    });

    await review.save();
    await review.populate("user", "name profilePicture");

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get reviews for a target
export const getReviews = async (req, res) => {
  try {
    const { targetId } = req.params;

    const reviews = await Review.find({ targetId })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, avgRating: avgRating.toFixed(1), totalReviews: reviews.length });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
