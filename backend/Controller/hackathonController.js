const Hackathon = require("../model/hackathonModel");

const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return undefined;
};

const normalizeImages = (images) => {
  if (typeof images === "string") {
    return images
      .split(/[,\n]/)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return images;
};

// POST - Create new hackathon
const createHackathon = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      details,
      images,
      registrationOpen,
    } = req.body;

    if (!title || !description || !date || !location || !details) {
      return res.status(400).json({
        success: false,
        message: "title, description, date, location and details are required",
      });
    }

    const imagesArray = normalizeImages(images);
    const normalizedRegistrationOpen = parseBoolean(registrationOpen);

    const newHackathon = new Hackathon({
      title,
      description,
      date,
      location,
      details,
      registrationOpen: normalizedRegistrationOpen ?? true,
      registrationClosedAt:
        normalizedRegistrationOpen === false ? new Date() : null,
      images: imagesArray,
    });

    const savedHackathon = await newHackathon.save();

    res.status(201).json({
      success: true,
      message: "Hackathon created successfully",
      data: savedHackathon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating hackathon",
      error: error.message,
    });
  }
};

// GET - Get all hackathons
const getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hackathons",
      error: error.message,
    });
  }
};

// GET - Get single hackathon by ID
const getHackathonById = async (req, res) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    res.status(200).json({
      success: true,
      data: hackathon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hackathon",
      error: error.message,
    });
  }
};

// PUT - Update hackathon by ID
const updateHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.images !== undefined) {
      updateData.images = normalizeImages(updateData.images);
    }

    if (updateData.registrationOpen !== undefined) {
      const normalizedRegistrationOpen = parseBoolean(
        updateData.registrationOpen
      );

      if (normalizedRegistrationOpen === undefined) {
        return res.status(400).json({
          success: false,
          message: "registrationOpen must be true or false",
        });
      }

      updateData.registrationOpen = normalizedRegistrationOpen;
      updateData.registrationClosedAt = normalizedRegistrationOpen
        ? null
        : new Date();
    }

    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedHackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hackathon updated successfully",
      data: updatedHackathon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating hackathon",
      error: error.message,
    });
  }
};

// DELETE - Delete hackathon by ID
const deleteHackathon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHackathon = await Hackathon.findByIdAndDelete(id);

    if (!deletedHackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hackathon deleted successfully",
      data: deletedHackathon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting hackathon",
      error: error.message,
    });
  }
};

module.exports = {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
};

