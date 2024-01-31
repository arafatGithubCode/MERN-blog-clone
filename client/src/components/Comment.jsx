import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import moment from "moment";

const Comment = ({ comment }) => {
  const [user, setUser] = useState({});

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
  return (
    <div className="flex items-center gap-2 p-3 max-w-3xl mx-auto mt-7">
      <img
        className="w-10 h-10 object-cover rounded-full"
        src={user && user.profilePicture}
        alt={user && user.username}
      />
      <div className="">
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
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape(),
};

export default Comment;
