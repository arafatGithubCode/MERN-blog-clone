import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import { signInSchema } from "../validator";

import { FaEye } from "react-icons/fa";
import { BiSolidHide } from "react-icons/bi";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signInSchema,
    onSubmit: async (_, actions) => {
      actions.resetForm();
      try {
        dispatch(signInStart());
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formik.values),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(signInFailure(data.message));
          toast.error(data.message);
          return;
        }
        if (res.ok) {
          dispatch(signInSuccess(data));
          navigate("/");
        }
      } catch (error) {
        dispatch(signInFailure(error.message));
        toast.error("something went wrong!");
        console.log(error.message);
      }
    },
  });

  return (
    <div className="min-h-screen mt-20 relative">
      <div className="absolute top-[-75px] right-10">
        <p className="text-yellow-500 font-semibold">
          Sign in with admin account to see admin functionality
        </p>
        <p className="text-sm">Email: admin01@gmail.com</p>

        <p className="text-sm">Admin Password: Admin01</p>
      </div>

      <div className="flex flex-col md:flex-row max-w-3xl mx-auto p-3 md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="text-4xl dark:text-white font-bold">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Arafat&apos;s
            </span>
            Blog
          </Link>
          <p className="text-slate-600 text-sm md:text-md mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="example@gmail.com"
                id="email"
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-red-600 text-sm">{formik.errors.email}</p>
              )}
            </div>
            <div className="relative">
              <Label value="Your password" />
              <TextInput
                type={showPassword ? "text" : "password"}
                placeholder="***"
                id="password"
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-600 text-sm">{formik.errors.password}</p>
              )}
              {showPassword ? (
                <FaEye
                  className="absolute top-8 right-3 text-xl"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <BiSolidHide
                  className="absolute top-8 right-3 text-xl"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              {loading ? (
                <div className="flex items-center gap-1">
                  <Spinner size="sm" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="mt-5">
            <span>Don&apos;t Have an account?</span>
            <Link
              to="/signup"
              className="text-blue-700 ml-2 hover:font-semibold transition duration-150"
            >
              Sign up
            </Link>
          </div>
          {errorMessage && (
            <Alert color="failure" className="mt-5">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
