import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getPosts");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-5 py-28 p-3 max-w-6xl mx-auto">
        <h1 className="text-3xl text-slate-800 dark:text-slate-400 font-bold lg:text-6xl">
          Welcome to my Blog
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Here you&apos;ll find a variety of articles and tutorials on topics
          such as web development, software engineering, and programming
          languages.
        </p>
        <Link
          to="/search"
          className="text-teal-600 font-medium hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="bg-amber-100 dark:bg-slate-700 p-3 z-50">
        <CallToAction />
      </div>
      {posts && posts.length > 0 && (
        <div className="flex flex-col">
          <h1 className="text-2xl text-slate-800 dark:text-slate-300 text-center font-semibold py-7">
            Recent Posts
          </h1>
          <div className="p-3 flex flex-wrap gap-5 justify-center items-center">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          <Link
            to="/search"
            className="text-xl text-teal-600 hover:underline font-medium text-center py-5"
          >
            View all posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
