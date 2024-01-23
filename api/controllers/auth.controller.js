import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (
      !username ||
      !email ||
      !password ||
      username === " " ||
      email === " " ||
      password === " "
    ) {
      next(errorHandler(400, "All fields are required!"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    //check existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      let existingUserErrMsg = null;

      if (existingUser.username === username) {
        existingUserErrMsg = "This username already existed!";
      } else if (existingUser.email === email) {
        existingUserErrMsg = "This email already existed!";
      }

      return res
        .status(400)
        .json({ success: false, message: existingUserErrMsg });
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully!" });
  } catch (error) {
    next(error);
  }
};
