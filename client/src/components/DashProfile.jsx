import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto w-full p-3">
      <h1 className="text-center my-7 text-3xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center mb-5">
          <img
            src={currentUser.profilePicture}
            alt="Image"
            className="rounded-full w-full h-full border-4 border-[lightGray] object-cover"
          />
        </div>
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
