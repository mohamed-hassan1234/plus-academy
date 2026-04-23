const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const {
  createAlumni,
  getAllAlumni,
  getAlumniById,
  updateAlumni,
  deleteAlumni,
} = require("../Controller/alumniController");

const router = express.Router();

const uploadDirectory = path.join(__dirname, "..", "uploads", "alumni");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const safeBaseName = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    cb(
      null,
      `${Date.now()}-${safeBaseName}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  return cb(new Error("Only image files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/alumni", upload.single("image"), createAlumni);
router.get("/alumni", getAllAlumni);
router.get("/alumni/:id", getAlumniById);
router.put("/alumni/:id", upload.single("image"), updateAlumni);
router.delete("/alumni/:id", deleteAlumni);

module.exports = router;
