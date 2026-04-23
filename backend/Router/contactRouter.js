const express = require("express");
const router = express.Router();
const {
    createContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact
} = require("../Controller/contactController");

// POST - Create a new contact message
router.post("/contact", createContact);

// GET - Get all contact messages
router.get("/contacts", getAllContacts);

// GET - Get single contact by ID
router.get("/contacts/:id", getContactById);

// PUT - Update contact status
router.put("/contacts/:id/status", updateContactStatus);

// DELETE - Delete contact by ID
router.delete("/contacts/:id", deleteContact);

module.exports = router;
