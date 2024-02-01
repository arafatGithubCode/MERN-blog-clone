import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
        const data = await res.json();
        setLoadingPosts(false);
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMorePosts = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      toast.error("something went wrong!");
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletePost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
        toast.success("Successfully deleted!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loadingPosts && (
        <div className="flex items-center justify-center gap-2 my-7">
          <Spinner />
          <span className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Loading...
          </span>
        </div>
      )}
      {currentUser.isAdmin && !loadingPosts && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>post image</Table.HeadCell>
              <Table.HeadCell>post title</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post, index) => (
              <Table.Body className="divide-y" key={index}>
                <Table.Row>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-24 h-10 object-cover bg-gray-200"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${post.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-semibold text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-teal-500 font-semibold hover:underline">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMorePosts}
              className="w-full text-center py-7 text-teal-500 hover:font-semibold"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal
        show={showModal}
        popup
        size="md"
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 mx-auto my-4 text-gray-400 dark:text-gray-200" />
            <h3 className="my-6 text-gray-400 dark:text-gray-200 text-lg">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex gap-10 justify-center my-5">
              <Button onClick={handleDeletePost} color="failure">
                Yes, I&apos;m sure
              </Button>
              <Button color="green" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPosts;
