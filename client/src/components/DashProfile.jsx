import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Alert, Button, TextInput } from "flowbite-react";

import { app } from "../config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadErr, setImageFileUploadErr] = useState(null);
  const [imageUploadProgress, setIMageUploadProgress] = useState(null);
  const filePickerRef = useRef();

  const handleChange = (e) => {
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
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, `profilePic/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setIMageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadErr(
            "Couldn't upload image(Image must be less then 2 mb)"
          );
          setImageFile(null);
          setIMageUploadProgress(null);
          setImageFileUrl(null);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageFileUrl(downloadUrl);
          });
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(imageUploadProgress);
  return (
    <div className="max-w-lg mx-auto w-full p-3">
      <h1 className="text-center my-7 text-3xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
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
        />
        <TextInput
          type="email"
          id="email"
          placeholder="You may update your email"
          defaultValue={currentUser.email}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="You may update your password"
        />
        <Button gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="flex justify-between text-red-700 my-5">
        <button className="hover:font-semibold">Delete Account</button>
        <button className="hover:font-semibold">Sign out</button>
      </div>
    </div>
  );
};

export default DashProfile;
