import PropTypes from "prop-types";

import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[400px] rounded-lg sm:w-[430px] overflow-hidden transition-all">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post image"
          className="w-full h-[260px] object-cover group-hover:h-[200px] transition-all duration-200 z-20"
        />
      </Link>
      <div className="flex flex-col p-3 gap-2">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm lg:text-md">{post.category}</span>
        <Link
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] right-0 left-0 border border-teal-500 rounded-lg !rounded-tl-none text-teal-500 bg-white py-2 text-center hover:text-white hover:bg-teal-500 transition-all m-2"
          to={`/post/${post.slug}`}
        >
          Read Article
        </Link>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
  }),
};

export default PostCard;
