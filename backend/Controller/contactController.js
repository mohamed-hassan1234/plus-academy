const Contact = require("../model/contactModel");

// POST - Create a new contact message
const createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email, subject, and message are required"
            });
        }

        const newContact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });

        const savedContact = await newContact.save();

        res.status(201).json({
            success: true,
            message: "Message sent successfully! We will get back to you soon.",
            data: savedContact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error sending message",
            error: error.message
        });
    }
};

// GET - Get all contact messages with filters
const getAllContacts = async (req, res) => {
    try {
        const { status, search } = req.query;
        
        let query = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } },
                { message: { $regex: search, $options: "i" } }
            ];
        }

        const contacts = await Contact.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching contacts",
            error: error.message
        });
    }
};

// GET - Get single contact by ID
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        // Mark as read if it's new
        if (contact.status === "new") {
            contact.status = "read";
            await contact.save();
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching contact",
            error: error.message
        });
    }
};

// PUT - Update contact status
const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !["new", "read", "replied"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid status is required (new, read, or replied)"
            });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact status updated successfully",
            data: updatedContact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating contact",
            error: error.message
        });
    }
};

// DELETE - Delete contact by ID
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact message deleted successfully",
            data: deletedContact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting contact",
            error: error.message
        });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact
};
