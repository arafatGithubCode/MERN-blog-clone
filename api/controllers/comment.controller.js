import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (!content || content.trim() === "") {
      return next(errorHandler(400, "Comment content is required."));
    }
    if (req.user.id !== userId) {
      return next(
        errorHandler(403, "You are not allowed to create this comment!")
      );
    }
    const newComment = await Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(403, "No comments found!"));
    }
    const userIndex = comment.likes(indexOf(req.user.id));
    if (userIndex === -1) {
      comment.numberOfLike += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLike -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
