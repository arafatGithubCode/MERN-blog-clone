import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";

const Comment = ({ comment, onLike }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);

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
  console.log(comment);
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
        <p className="text-md p-1 text-gray-400">
          {comment && comment.content}
        </p>
        <div className="flex items-center gap-2 my-2">
          <button
            onClick={() => onLike(comment._id)}
            className={`text-gray-400 hover:text-blue-500 ${
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
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape(),
  onLike: PropTypes.func,
};

export default Comment;
