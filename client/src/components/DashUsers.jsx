import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch(`/api/user/getUsers`);
        const data = await res.json();
        setLoadingUsers(false);
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
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

  const handleShowMorePosts = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getUsers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      toast.error("something went wrong!");
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {};

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loadingUsers && (
        <div className="my-9 flex items-center gap-2">
          <Spinner />
          <span className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Loading...
          </span>
        </div>
      )}
      {currentUser.isAdmin && !loadingUsers && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>date created</Table.HeadCell>
              <Table.HeadCell>user image</Table.HeadCell>
              <Table.HeadCell>username</Table.HeadCell>
              <Table.HeadCell>user email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover rounded-full bg-gray-200"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-600" />
                    ) : (
                      <FaTimes className="text-red-600" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(user._id);
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
              onClick={handleShowMorePosts}
              className="w-full text-center py-7 text-teal-500 hover:font-semibold"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
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

export default DashUsers;
