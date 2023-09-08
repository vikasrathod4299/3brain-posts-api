const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { bodyValidation } = require("../../middleware/validation");
const { loginSchema, registerSchema } = require("../../validators/auth");

router.post("/register", bodyValidation(registerSchema), async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOne({ username });
    if (!user) {
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(200).json("User has been registered!");
    } else {
      res.status(409).json("Username is already taken!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Somthing went wrong!");
  }
});

router.post("/login", bodyValidation(loginSchema), async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (await bcrypt.compare(password, user.password)) {
      const { id } = user;
      const accessToken = jwt.sign(
        { id, username },
        process.env.TOKEN_SECRETE,
        { expiresIn: "1d" }
      );
      const { password, ...rest } = user._doc;
      res.status(200).json({
        message: "You are logged in successfully!",
        data: { ...rest, accessToken },
      });
    } else {
      res.status(401).json("Wrong combination of username and password!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Somthing went wrong!");
  }
});

module.exports = router;
