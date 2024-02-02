import { useState } from "react";
import {
  Alert,
  Button,
  FileInput,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { app } from "../config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [imageUploadErr, setImageUploadErr] = useState(null);
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [publishErr, setPublishErr] = useState(null);
  const [publishLoading, setPublishLoading] = useState(false);

  const handlePostImageUpload = async () => {
    try {
      if (!file) {
        return setImageUploadErr("Please, select an image!");
      }
      setImageUploadErr(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, `postImage/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadingProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadErr(
            "Image upload failed(Image length must be less then 2 mb)!"
          );
          setImageUploadingProgress(null);
          console.log(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadErr(null);
            setImageUploadingProgress(null);
            setFormData({ ...formData, image: downloadUrl });
          });
        }
      );
    } catch (error) {
      setImageUploadErr(
        "Image upload failed(Image length must be less then 2 mb)!"
      );
      setImageUploadingProgress(null);
      toast.error("something went wrong!");
      console.log(error.message);
    }
  };

  const handlePublishPost = async (e) => {
    e.preventDefault();
    try {
      setPublishErr(null);
      setPublishLoading(true);
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setPublishLoading(false);
      if (!res.ok) {
        setPublishErr(data.message);
        toast.error("something went wrong!");
        console.log(data.message);
      } else {
        setPublishErr(null);
        navigate(`/post/${data.slug}`);
        toast.success("A post is published!");
      }
    } catch (error) {
      toast.error("something went wrong!");
      console.log(error.message);
      setPublishErr(error.message);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nodejs">Node.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            accept="image/*"
          />
          <Button
            type="button"
            onClick={handlePostImageUpload}
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            {imageUploadingProgress ? (
              <div className="w-10 h-10 sm:w-16 sm:h-16">
                <CircularProgressbar
                  value={imageUploadingProgress}
                  text={`${imageUploadingProgress} %`}
                />
              </div>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          onChange={(value) => setFormData({ ...formData, content: value })}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
        />
        {formData.image && !imageUploadErr && (
          <img
            src={formData.image}
            className="w-full h-72 object-cover"
            alt="Image"
          />
        )}
        <Button
          onClick={handlePublishPost}
          type="submit"
          gradientDuoTone="purpleToPink"
        >
          {publishLoading ? (
            <div>
              <Spinner />
              <span>Loading...</span>
            </div>
          ) : (
            "Publish"
          )}
        </Button>
        {imageUploadErr && <Alert color="warning">{imageUploadErr}</Alert>}
        {publishErr && <Alert color="failure">{publishErr}</Alert>}
      </form>
    </div>
  );
};

export default CreatePost;
