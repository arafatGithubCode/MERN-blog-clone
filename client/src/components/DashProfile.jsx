import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Alert, Button, Modal, TextInput } from "flowbite-react";

import { app } from "../config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadErr, setImageFileUploadErr] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const filePickerRef = useRef();
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserErr, setUpdateUserErr] = useState(null);
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    try {
      setImageFileUploadErr(null);
      setImageFileUploading(true);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, `profilePic/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadErr(
            "Couldn't upload image(Image must be less then 2 mb)"
          );
          setImageFile(null);
          setImageUploadProgress(null);
          setImageFileUrl(null);
          setImageFileUploading(false);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageFileUrl(downloadUrl);
            setFormData({ ...formData, profilePicture: downloadUrl });
            setImageFileUploading(false);
          });
        }
      );
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateUserErr(error.message);
      setImageFileUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateProfileSuccess(null);
    setUpdateUserErr(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserErr("No changes made!");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserErr("Please, wait for image to upload!");
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        setUpdateUserErr(data.message);
      } else {
        dispatch(updateUserSuccess(data));
        setUpdateProfileSuccess("User's profile updated successfully!");
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateUserErr(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
      } else {
        dispatch(deleteUserSuccess(data));
        toast.success("This account has been deleted!");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full p-3">
      <h1 className="text-center my-7 text-3xl font-semibold">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center mb-5"
          onClick={() => filePickerRef.current.click()}
        >
          {imageUploadProgress && (
            <CircularProgressbar
              value={imageUploadProgress || 0}
              text={`${imageUploadProgress} %`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100}`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="Image"
            className={`rounded-full w-full h-full border-4 border-[lightGray] object-cover cursor-pointer ${
              imageUploadProgress && imageUploadProgress < 100 && "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadErr && (
          <Alert color="failure">{imageFileUploadErr}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="You may update your username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="You may update your email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="You may update your password"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="flex justify-between text-red-700 my-5">
        <button
          onClick={() => setShowModal(true)}
          className="hover:font-semibold"
        >
          Delete Account
        </button>
        <button className="hover:font-semibold">Sign out</button>
      </div>
      {updateProfileSuccess && (
        <Alert color="success" className="mt-5">
          {updateProfileSuccess}
        </Alert>
      )}
      {updateUserErr && (
        <Alert color="failure" className="mt-5">
          {updateUserErr}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClick={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mx-auto mt-4" />
            <h3 className="text-gray-500 dark:text-gray-400 text-lg mt-5">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center mt-5 gap-10">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
