require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models"); // Grabbing the Sequelize instance

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Let's make sure we can actually talk to the database
    await sequelize.authenticate();
    console.log("📦 Database connection established successfully.");

    // I'll use sync for dev, but I should switch to migrations for prod later
    // await sequelize.sync({ alter: true });

    // Finally, boot up the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is up and running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
  }
}

startServer();
