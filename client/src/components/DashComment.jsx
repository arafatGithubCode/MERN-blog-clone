import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashComment = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [showModal, setShowModal] = useState(false);
  console.log(comments);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingComments(true);
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();
        setLoadingComments(false);
        if (res.ok) {
          setComments(data.allComments);
          if (data.allComments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMoreComments = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/user/getUsers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, data.allComments]);
        if (data.allComments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      toast.error("something went wrong!");
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        toast.success("This comment deleted successfully");
        setShowModal(false);
      } else {
        toast.error("something went wrong!");
        console.log(data.message);
      }
    } catch (error) {
      toast.error("something went wrong!");
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loadingComments && (
        <div className="my-9 flex items-center gap-2">
          <Spinner />
          <span className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Loading...
          </span>
        </div>
      )}
      {currentUser.isAdmin && !loadingComments && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>date updated</Table.HeadCell>
              <Table.HeadCell>comment content</Table.HeadCell>
              <Table.HeadCell>number of likes</Table.HeadCell>
              <Table.HeadCell>post id</Table.HeadCell>
              <Table.HeadCell>user id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row>
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLike}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="font-semibold text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMoreComments}
              className="w-full text-center py-7 text-teal-500 hover:font-semibold"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex gap-10 justify-center my-5">
              <Button onClick={handleDeleteUser} color="failure">
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

export default DashComment;
