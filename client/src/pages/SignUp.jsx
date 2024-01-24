import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import { signUpSchema } from "../validator";

import { FaEye } from "react-icons/fa";
import { BiSolidHide } from "react-icons/bi";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (_, actions) => {
      actions.resetForm();
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formik.values),
        });
        const data = await res.json();
        if (data.success === false) {
          setErrorMessage(data.message);
          setLoading(false);
          toast.error(data.message);
          return;
        }
        setLoading(false);
        navigate("/signin");
      } catch (error) {
        setLoading(false);
        toast.error("something went wrong!");
        console.log(error.message);
      }
    },
  });

  return (
    <div className="min-h-screen mt-20">
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
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Devid"
                id="username"
                {...formik.getFieldProps("username")}
              />
              {formik.errors.username && formik.touched.username && (
                <p className="text-red-600 text-sm">{formik.errors.username}</p>
              )}
            </div>
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
                placeholder="password"
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
            <div>
              <Label value="Confirm password" />
              <TextInput
                type="password"
                placeholder="password"
                id="confirmPassword"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <p className="text-red-600 text-sm">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              {loading ? (
                <div className="flex items-center gap-1">
                  <Spinner size="sm" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Sign up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="mt-5">
            <span>Have an account?</span>
            <Link
              to="/signin"
              className="text-blue-700 ml-2 hover:font-semibold transition duration-150"
            >
              Sign in
            </Link>
          </div>
          {errorMessage && <Alert className="mt-5">{errorMessage}</Alert>}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
