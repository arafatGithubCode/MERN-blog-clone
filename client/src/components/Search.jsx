import { useEffect, useState } from "react";
import { Alert, Button, Select, Spinner, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getPosts?${searchQuery}`);
        const data = await res.json();

        if (!res.ok) {
          setError("Something went  wrong!");
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPosts(data.posts);
          setLoading(false);
          setError(false);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        setError("Something went wrong!");
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }

    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("searchTerm", sidebarData.searchTerm);
      urlParams.set("sort", sidebarData.sort);
      urlParams.set("category", sidebarData.category);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowMore = async () => {
    try {
      const numberOfPosts = posts.length;
      const startIndex = numberOfPosts;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getPosts?${searchQuery}`);
      if (!res.ok) {
        setError("something went wrong!");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="border-b border-gray-500 md:border-r md:border-b-0 md:min-h-screen py-7">
        <form onSubmit={handleSubmit} className="space-y-8 px-5">
          <div className="flex items-center gap-3">
            <label
              className="text-lg text-slate-800 dark:text-slate-300 font-semibold whitespace-nowrap"
              htmlFor="searchTerm"
            >
              Search Term:{" "}
            </label>
            <TextInput
              placeholder="Search..."
              type="text"
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-3">
            <label
              className="text-lg text-slate-800 dark:text-slate-300 font-semibold"
              htmlFor="sort"
            >
              Sort:{" "}
            </label>
            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <label
              className="text-lg text-slate-800 dark:text-slate-300 font-semibold"
              htmlFor="category"
            >
              Sort:{" "}
            </label>
            <Select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="nodejs">Node.js</option>
              <option value="javascript">Javascript</option>
            </Select>
          </div>
          <Button
            className="w-full"
            type="submit"
            gradientDuoTone="purpleToPink"
            outline
          >
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full p-3">
        {loading && (
          <div className="flex items-center justify-center gap-2 my-7">
            <Spinner />
            <span className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              Loading...
            </span>
          </div>
        )}

        <h1 className="text-3xl text-slate-700 font-semibold dark:text-slate-300 p-7 border-b border-gray-500">
          Posts results:
        </h1>
        <div className="mt-5 flex flex-wrap gap-5 justify-center items-center">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        {!loading && !error && posts.length === 0 && (
          <Alert color="info">No posts found</Alert>
        )}
        {!loading && error && <Alert color="failure">{error}</Alert>}
        {showMore && (
          <button
            onClick={handleShowMore}
            className="w-full text-teal-500 hover:underline py-5"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
