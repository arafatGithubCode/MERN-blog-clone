import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

const SignUp = () => {
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
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your username" />
              <TextInput type="text" placeholder="Devid" />
            </div>
            <div>
              <Label value="Email" />
              <TextInput type="email" placeholder="example@gmail.com" />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="password" />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Sign up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
