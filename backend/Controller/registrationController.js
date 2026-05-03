const Registration = require("../model/registrationModel");
const Hackathon = require("../model/hackathonModel");

const EVENT_TYPES = Hackathon.EVENT_TYPES || [
  "event",
  "workshop",
  "hackathon",
  "graduation",
];

const normalizeEventType = (eventType = "") => {
  const normalized = String(eventType).trim().toLowerCase();

  return EVENT_TYPES.includes(normalized) ? normalized : "";
};

const normalizeBoolean = (value) => {
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

const serializeRegistration = (registration) => {
  const plainRegistration =
    typeof registration.toObject === "function"
      ? registration.toObject()
      : { ...registration };

  const populatedHackathon =
    plainRegistration.hackathonId &&
    typeof plainRegistration.hackathonId === "object"
      ? plainRegistration.hackathonId
      : null;

  return {
    ...plainRegistration,
    hackathonId: populatedHackathon?._id || plainRegistration.hackathonId,
    hackathonTitle:
      plainRegistration.hackathonTitle || populatedHackathon?.title || "-",
    eventType:
      plainRegistration.eventType || populatedHackathon?.eventType || "hackathon",
  };
};

// POST - Create new registration
const createRegistration = async (req, res) => {
  try {
    const {
      hackathonId,
      hackathonTitle,
      fullName,
      email,
      whatsappNumber,
      city,
      studyRiseAcademy,
      gender,
      highestEducation,
      mernStackExperience,
      hasComputer,
      hasLaptop,
    } = req.body;

    const normalizedStudyRiseAcademy = normalizeBoolean(studyRiseAcademy);
    const normalizedHasComputer = normalizeBoolean(
      hasComputer !== undefined ? hasComputer : hasLaptop
    );
    const missingFields = [];

    if (!hackathonId && !hackathonTitle?.trim()) {
      missingFields.push("hackathonId");
    }
    if (!fullName?.trim()) missingFields.push("fullName");
    if (!email?.trim()) missingFields.push("email");
    if (!whatsappNumber?.trim()) missingFields.push("whatsappNumber");
    if (!city?.trim()) missingFields.push("city");
    if (normalizedStudyRiseAcademy === undefined) {
      missingFields.push("studyRiseAcademy");
    }
    if (!gender?.trim()) missingFields.push("gender");
    if (!highestEducation?.trim()) missingFields.push("highestEducation");
    if (!mernStackExperience?.trim()) {
      missingFields.push("mernStackExperience");
    }
    if (normalizedHasComputer === undefined) {
      missingFields.push("hasComputer");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    let hackathon = null;

    if (hackathonId) {
      hackathon = await Hackathon.findById(hackathonId);
    }

    if (!hackathon && hackathonTitle?.trim()) {
      hackathon = await Hackathon.findOne({
        title: hackathonTitle.trim(),
      });
    }

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (hackathon.registrationOpen === false) {
      return res.status(400).json({
        success: false,
        message: "Registration for this event has ended",
      });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await Registration.findOne({
      hackathonId: hackathon._id,
      email: normalizedEmail,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "You have already submitted a registration for this event with this email",
      });
    }

    const registration = new Registration({
      hackathonId: hackathon._id,
      hackathonTitle: hackathon.title,
      eventType: EVENT_TYPES.includes(hackathon.eventType)
        ? hackathon.eventType
        : "hackathon",
      fullName: fullName.trim(),
      email: normalizedEmail,
      whatsappNumber: whatsappNumber.trim(),
      city: city.trim(),
      studyRiseAcademy: normalizedStudyRiseAcademy,
      gender,
      highestEducation,
      mernStackExperience,
      hasComputer: normalizedHasComputer,
    });

    const saved = await registration.save();

    res.status(201).json({
      success: true,
      message: "Registration submitted successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating registration",
      error: error.message,
    });
  }
};

// GET - Get all registrations with filters
const getAllRegistrations = async (req, res) => {
  try {
    const {
      search,
      gender,
      highestEducation,
      mernStackExperience,
      hasComputer,
      studyRiseAcademy,
      hackathonId,
      eventType,
    } = req.query;

    const query = {};
    const andFilters = [];

    if (search) {
      andFilters.push({
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { whatsappNumber: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { hackathonTitle: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (gender) {
      query.gender = gender;
    }

    if (highestEducation) {
      query.highestEducation = highestEducation;
    }

    if (mernStackExperience) {
      query.mernStackExperience = mernStackExperience;
    }

    if (hasComputer === "true" || hasComputer === "false") {
      query.hasComputer = hasComputer === "true";
    }

    if (studyRiseAcademy === "true" || studyRiseAcademy === "false") {
      query.studyRiseAcademy = studyRiseAcademy === "true";
    }

    if (hackathonId) {
      query.hackathonId = hackathonId;
    }

    if (eventType) {
      const normalizedEventType = normalizeEventType(eventType);

      if (!normalizedEventType) {
        return res.status(400).json({
          success: false,
          message: `eventType must be one of: ${EVENT_TYPES.join(", ")}`,
        });
      }

      const matchingHackathonIds = await Hackathon.find({
        eventType: normalizedEventType,
      }).distinct("_id");

      andFilters.push({
        $or: [
          { eventType: normalizedEventType },
          { hackathonId: { $in: matchingHackathonIds } },
        ],
      });
    }

    if (andFilters.length > 0) {
      query.$and = andFilters;
    }

    const registrations = await Registration.find(query)
      .populate("hackathonId", "title eventType")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations.map(serializeRegistration),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching registrations",
      error: error.message,
    });
  }
};

// GET - Single registration
const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await Registration.findById(id).populate(
      "hackathonId",
      "title eventType"
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      data: serializeRegistration(registration),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching registration",
      error: error.message,
    });
  }
};

// PUT - Attach or update hackathon on an existing registration
const updateRegistrationHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const { hackathonId } = req.body;

    if (!hackathonId) {
      return res.status(400).json({
        success: false,
        message: "hackathonId is required",
      });
    }

    const hackathon = await Hackathon.findById(hackathonId);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const updatedRegistration = await Registration.findByIdAndUpdate(
      id,
      {
        hackathonId: hackathon._id,
        hackathonTitle: hackathon.title,
        eventType: EVENT_TYPES.includes(hackathon.eventType)
          ? hackathon.eventType
          : "hackathon",
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("hackathonId", "title eventType");

    if (!updatedRegistration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration event updated successfully",
      data: serializeRegistration(updatedRegistration),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating registration event",
      error: error.message,
    });
  }
};

// DELETE - Registration
const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Registration.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting registration",
      error: error.message,
    });
  }
};

module.exports = {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationHackathon,
  deleteRegistration,
};

