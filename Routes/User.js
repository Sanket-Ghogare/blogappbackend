import express from "express";
import bcryptjs from "bcryptjs";
import User from "../Module/Module.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "sjasfhuetheofujs";

const userRouter = express.Router();

userRouter.post("/Signup", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists with this email or username" });
  }

  //Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    });
  }

  try {
    const hashpassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashpassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message});
}});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    console.log("User exists");

    const validPassword = await bcryptjs.compareSync(password, user.password);
    if (validPassword) {
      const accessToken = jwt.sign(user.toJSON(), JWT_SECRET);
      const isAdmin = user.isAdmin
        ? jwt.sign({ isAdmin: true }, JWT_SECRET)
        : null;
      return res.status(200).json({
        accessToken: accessToken,
        // refreshToken: refreshToken,
        // name: user.name,
        isAdmin: isAdmin ? isAdmin : "",
        username: user.username,
      });
    } else {
      return res.status(400).json({ error: "Password does not match" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong", errorMessage: error.message });
  }
});
export default userRouter;
