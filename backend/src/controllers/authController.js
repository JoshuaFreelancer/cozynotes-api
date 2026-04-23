const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // I'm delegating the creation logic to the service layer
    const newUser = await authService.registerUser(email, password);

    res.status(201).json({
      message: "Admin user created successfully.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    
    // Quick check to send a 400 if it's my custom business logic error
    if (error.message === "User already exists in the database.") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error while registering." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Let the service handle the DB checks and token generation
    const { user, token } = await authService.loginUser(email, password);

    // I'm not sending the password back to the frontend, just the safe data
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    
    if (error.message === "Invalid credentials.") {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error during login." });
  }
};

module.exports = { register, login };