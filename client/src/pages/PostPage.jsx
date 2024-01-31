import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const { postSlug } = useParams();
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error.message);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch("/api/post/getPosts?limit=3");
        if (res.ok) {
          const data = await res.json();
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return toast.error("something went wrong!");
  }

  return (
    <main className="flex flex-col min-h-screen max-w-6xl mx-auto">
      <h1 className="text-3xl lg:text-4xl text-slate-700 max-w-2xl mx-auto dark:text-slate-300 mt-10 p-3 text-center">
        {post && post.title}
      </h1>
      <Link
        className="self-center mt-5"
        to={`/search?category=${post && post.category}`}
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="max-h-[600px] w-full p-3 mt-10 object-cover"
      />
      <div className="flex justify-between border-b border-slate-500 p-3 text-xs lg:text-sm w-full max-w-2xl mx-auto">
        <span>{post && new Date(post.updatedAt).toLocaleDateString()}</span>
        <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full p-3">
        <CallToAction />
      </div>
      <CommentSection postId={post && post._id} />
      <div className="">
        <h1 className="text-slate-800 text-lg text-center my-5 font-medium">
          Recent articles
        </h1>
        <div className="flex flex-wrap gap-5 p-3 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
