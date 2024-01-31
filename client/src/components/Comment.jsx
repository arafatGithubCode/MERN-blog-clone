import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, [comment]);

  const handleEditComment = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSaveComment = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="flex items-start gap-2 p-3 max-w-3xl mx-auto mt-7 border-b dark:border-gray-600">
      <img
        className="w-10 h-10 object-cover rounded-full"
        src={user && user.profilePicture}
        alt={user && user.username}
      />
      <div>
        <div className="flex justify-center items-center gap-2">
          <span className="text-slate-900 font-medium text-sm truncate dark:text-slate-300">
            @{user && user.email}
          </span>
          <span className="text-sm text-gray-400">
            {user && moment(comment.updatedAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mt-5"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-5 mt-3 text-xs">
              <Button
                type="button"
                onClick={handleSaveComment}
                gradientDuoTone="purpleToBlue"
                size="sm"
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                gradientDuoTone="purpleToBlue"
                size="sm"
                outline
                type="button"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-md p-1 text-gray-400">
              {comment && comment.content}
            </p>
            <div className="flex items-center gap-2 my-2">
              <button
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400 text-sm dark:text-gray-200">
                {comment.numberOfLike > 0 &&
                  comment.numberOfLike +
                    " " +
                    (comment.numberOfLike === 1 ? "Like" : "Likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEditComment}
                      className="text-gray-400 text-sm hover:text-teal-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 text-sm hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape(),
  onLike: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Comment;
