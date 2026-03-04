import Comment from "../models/Comment.js";
import Pet from "../models/Pet.js";

// Add comment to a pet
export const addComment = async (req, res) => {
  try {
    const { petId, comment } = req.body;
    const userId = req.user._id;

    // Check if pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const newComment = new Comment({
      user: userId,
      pet: petId,
      comment,
    });

    await newComment.save();
    await newComment.populate("user", "name profilePicture");

    res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get comments for a pet
export const getComments = async (req, res) => {
  try {
    const { petId } = req.params;

    const comments = await Comment.find({ pet: petId })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.json({ comments, totalComments: comments.length });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns this comment
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
