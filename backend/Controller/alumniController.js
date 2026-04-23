const fs = require("fs");
const path = require("path");
const Alumni = require("../model/alumniModel");

const uploadsRoot = path.join(__dirname, "..", "uploads");

const normalizeImagePath = (imagePath = "") => {
  if (!imagePath) {
    return "";
  }

  const normalizedPath = String(imagePath).replace(/\\/g, "/").trim();

  if (/^(https?:\/\/|data:|blob:)/i.test(normalizedPath)) {
    return normalizedPath;
  }

  if (normalizedPath.startsWith("/uploads/")) {
    return normalizedPath;
  }

  if (normalizedPath.startsWith("uploads/")) {
    return `/${normalizedPath}`;
  }

  const fileName = path.basename(normalizedPath);
  return `/uploads/alumni/${fileName}`;
};

const serializeAlumni = (alumniDocument) => {
  if (!alumniDocument) {
    return alumniDocument;
  }

  const plainDocument =
    typeof alumniDocument.toObject === "function"
      ? alumniDocument.toObject()
      : { ...alumniDocument };

  plainDocument.image = normalizeImagePath(plainDocument.image);

  return plainDocument;
};

const removeUploadedFile = (imagePath) => {
  const normalizedImagePath = normalizeImagePath(imagePath);

  if (!normalizedImagePath || !normalizedImagePath.startsWith("/uploads/")) {
    return;
  }

  const normalizedPath = normalizedImagePath.replace(/^\/+/, "");
  const absolutePath = path.join(__dirname, "..", normalizedPath);

  if (absolutePath.startsWith(uploadsRoot) && fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const buildImagePath = (file) => {
  return file ? `/uploads/alumni/${file.filename}` : "";
};

const createAlumni = async (req, res) => {
  try {
    const { name, role, course } = req.body;

    if (!name || !role || !course) {
      if (req.file) {
        removeUploadedFile(buildImagePath(req.file));
      }

      return res.status(400).json({
        success: false,
        message: "name, role, and course are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const alumni = new Alumni({
      name,
      role,
      course,
      image: normalizeImagePath(buildImagePath(req.file)),
    });

    const savedAlumni = await alumni.save();

    res.status(201).json({
      success: true,
      message: "Alumni created successfully",
      data: serializeAlumni(savedAlumni),
    });
  } catch (error) {
    if (req.file) {
      removeUploadedFile(buildImagePath(req.file));
    }

    res.status(500).json({
      success: false,
      message: "Error creating alumni",
      error: error.message,
    });
  }
};

const getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alumni.length,
      data: alumni.map((item) => serializeAlumni(item)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching alumni",
      error: error.message,
    });
  }
};

const getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    res.status(200).json({
      success: true,
      data: serializeAlumni(alumni),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching alumni",
      error: error.message,
    });
  }
};

const updateAlumni = async (req, res) => {
  try {
    const { name, role, course } = req.body;

    if (!name || !role || !course) {
      if (req.file) {
        removeUploadedFile(buildImagePath(req.file));
      }

      return res.status(400).json({
        success: false,
        message: "name, role, and course are required",
      });
    }

    const existingAlumni = await Alumni.findById(req.params.id);

    if (!existingAlumni) {
      if (req.file) {
        removeUploadedFile(buildImagePath(req.file));
      }

      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    const previousImage = existingAlumni.image;
    const nextImagePath = req.file
      ? normalizeImagePath(buildImagePath(req.file))
      : normalizeImagePath(existingAlumni.image);

    existingAlumni.name = name;
    existingAlumni.role = role;
    existingAlumni.course = course;
    existingAlumni.image = nextImagePath;

    const updatedAlumni = await existingAlumni.save();

    if (req.file && previousImage !== nextImagePath) {
      removeUploadedFile(previousImage);
    }

    res.status(200).json({
      success: true,
      message: "Alumni updated successfully",
      data: serializeAlumni(updatedAlumni),
    });
  } catch (error) {
    if (req.file) {
      removeUploadedFile(buildImagePath(req.file));
    }

    res.status(500).json({
      success: false,
      message: "Error updating alumni",
      error: error.message,
    });
  }
};

const deleteAlumni = async (req, res) => {
  try {
    const deletedAlumni = await Alumni.findByIdAndDelete(req.params.id);

    if (!deletedAlumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    removeUploadedFile(deletedAlumni.image);

    res.status(200).json({
      success: true,
      message: "Alumni deleted successfully",
      data: serializeAlumni(deletedAlumni),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting alumni",
      error: error.message,
    });
  }
};

module.exports = {
  createAlumni,
  getAllAlumni,
  getAlumniById,
  updateAlumni,
  deleteAlumni,
  normalizeImagePath,
};
