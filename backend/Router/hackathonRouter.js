const express = require("express");
const router = express.Router();
const {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
} = require("../Controller/hackathonController");

// POST - Create new hackathon
router.post("/hackathons", createHackathon);

// GET - Get all hackathons
router.get("/hackathons", getAllHackathons);

// GET - Get single hackathon by ID
router.get("/hackathons/:id", getHackathonById);

// PUT - Update hackathon by ID
router.put("/hackathons/:id", updateHackathon);

// DELETE - Delete hackathon by ID
router.delete("/hackathons/:id", deleteHackathon);

module.exports = router;

