const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// I'll handle the business logic and database interactions in this service layer
const registerUser = async (email, password) => {
  // I need to check if the user already exists to avoid duplicates
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists in the database.");
  }

  // Hashing the password for security before saving it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  return newUser;
};

const loginUser = async (email, password) => {
  // First, let's find the user by their email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials.");
  }

  // Checking if the provided password matches the hashed one in the DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  // Generating the JWT token so the frontend can authenticate future requests
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return { user, token };
};

module.exports = { registerUser, loginUser };