const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // I need to check if the user already exists to avoid duplicates
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists in the database." });
    }

    // Hashing the password for security before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({
        message: "Admin user created successfully.",
        userId: newUser.id,
      });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res
      .status(500)
      .json({ message: "Internal server error while registering." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First, let's find the user by their email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Checking if the provided password matches the hashed one in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generating the JWT token so the frontend can authenticate future requests
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // I'm not sending the password back to the frontend, just the safe data
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error during login." });
  }
};

module.exports = { register, login };
