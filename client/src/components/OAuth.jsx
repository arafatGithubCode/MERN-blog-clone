import { useNavigate } from "react-router-dom";

import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";

import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

import { app } from "../config/firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const user = resultFromGoogle.user;
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googlePhotoUrl: user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Button
      onClick={handleGoogleClick}
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
    >
      <AiFillGoogleCircle className="text-2xl mr-1" />
      <span className="font-semibold text-lg">Continue with Google</span>
    </Button>
  );
};

export default OAuth;
