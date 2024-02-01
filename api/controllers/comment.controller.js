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
    const userIndex = comment.likes.indexOf(req.user.id);
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

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(403, "Comment not found!"));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment!")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(403, "Not found comment!"));
    }
    if (req.user.id !== comment.userId && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment!")
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment deleted successfully!");
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allow to get all comments!"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit || 9);
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const allComments = await Comment.find()
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: sortDirection });

    const totalComments = await Comment.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonth = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ allComments, totalComments, lastMonth });
  } catch (error) {
    next(error);
  }
};
