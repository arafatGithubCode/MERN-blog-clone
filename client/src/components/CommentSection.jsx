import { Alert, Button, Textarea } from "flowbite-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentErr, setCommentErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  console.log(comments);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentErr(null);
        setLoading(false);
        setComments([data, ...comments]);
      } else {
        setCommentErr(data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setComment(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  return (
    <div className="max-w-3xl mx-auto p-3 w-full">
      {currentUser ? (
        <div className="flex items-center gap-1 text-sm text-gray-500 my-5">
          <p>Signed in as:</p>
          <img
            className="w-6 h-6 rounded-full object-cover"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link
            className="text-teal-500 truncate hover:underline text-sm"
            to="/dashboard?tab=profile"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-teal-500 text-sm">
          You must be signed in to comment
          <Link
            className="hover:underline text-blue-500 hover:font-semibold ml-2"
            to="/signin"
          >
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="p-3 border border-teal-500 rounded-md"
        >
          <Textarea
            rows={3}
            maxLength={200}
            placeholder="Add a comment..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between mt-5 items-center">
            <p className="text-gray-500 text-xs lg:text-sm dark:text-gray-200">
              {200 - comment.length} characters remaining
            </p>
            <Button
              type="submit"
              disabled={loading}
              gradientDuoTone="purpleToBlue"
              outline
              pill
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
          {commentErr && (
            <Alert className="mt-7" color="failure">
              {commentErr}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p>No comments yet!</p>
      ) : (
        <>
          <div className="mt-7 flex items-center gap-2">
            <p>Comments</p>
            <p className="px-3 py-1 border-2 border-gray-400 rounded-xl">
              {comments.length}
            </p>
          </div>
          {comments &&
            comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
        </>
      )}
    </div>
  );
};
CommentSection.propTypes = {
  postId: PropTypes.string,
};
export default CommentSection;
