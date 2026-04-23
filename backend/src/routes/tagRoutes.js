const express = require("express");
const router = express.Router();
const { getTags, createTag } = require("../controllers/tagController");
const authenticateToken = require("../middlewares/authMiddleware");

router.use(authenticateToken);

router.get("/", getTags);
router.post("/", createTag);

module.exports = router;
