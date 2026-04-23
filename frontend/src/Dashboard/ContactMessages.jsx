import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "../utils/api";

function ContactMessages() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      let url = apiUrl("/api/contacts?");
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);

      url += params.toString();

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleViewContact = async (id) => {
    try {
      const response = await fetch(apiUrl(`/api/contacts/${id}`));
      const data = await response.json();

      if (data.success) {
        setSelectedContact(data.data);
        fetchContacts(); // Refresh to update status
      }
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        apiUrl(`/api/contacts/${id}/status`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Status updated successfully!",
        });
        fetchContacts();
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error updating status",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/contacts/${id}`), {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Message deleted successfully!");
        fetchContacts();
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(null);
        }
      } else {
        alert(data.message || "Error deleting message");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-300";
      case "read":
        return "bg-yellow-500/20 text-yellow-300";
      case "replied":
        return "bg-green-500/20 text-green-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const newCount = contacts.filter((c) => c.status === "new").length;

  return (
    <div className="dashboard-page">
      <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Contact Messages
            </h1>
            <p className="text-gray-400">
              Manage and respond to contact messages ({contacts.length} total,{" "}
              {newCount} new)
            </p>
          </div>

          {/* Message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl ${
                message.type === "success"
                  ? "bg-green-500/20 border border-green-500/50 text-green-300"
                  : "bg-red-500/20 border border-red-500/50 text-red-300"
              }`}
            >
              <p>{message.text}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="w-full rounded-lg bg-[#020617]/70 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Status</option>
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="bg-[#070F24]/90 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : contacts.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No messages found
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {contacts.map((contact) => (
                      <div
                        key={contact._id}
                        className={`p-6 hover:bg-white/5 transition-colors cursor-pointer ${
                          selectedContact?._id === contact._id
                            ? "bg-indigo-500/10 border-l-4 border-indigo-500"
                            : ""
                        }`}
                        onClick={() => handleViewContact(contact._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-semibold">
                                {contact.name}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  contact.status
                                )}`}
                              >
                                {contact.status}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mb-1">
                              {contact.email}
                            </p>
                            <p className="text-gray-400 text-sm font-medium">
                              {contact.subject}
                            </p>
                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                              {contact.message}
                            </p>
                          </div>
                          <div className="text-gray-500 text-xs ml-4">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-1">
              {selectedContact ? (
                <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                      Message Details
                    </h2>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Name</p>
                      <p className="text-white">{selectedContact.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Email</p>
                      <p className="text-white">{selectedContact.email}</p>
                    </div>
                    {selectedContact.phone && (
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Phone</p>
                        <p className="text-white">{selectedContact.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Subject</p>
                      <p className="text-white font-medium">
                        {selectedContact.subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Message</p>
                      <p className="text-white text-sm leading-relaxed">
                        {selectedContact.message}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Date</p>
                      <p className="text-white text-sm">
                        {new Date(selectedContact.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-gray-400 text-sm mb-3">Status</p>
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() =>
                            handleUpdateStatus(selectedContact._id, "new")
                          }
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            selectedContact.status === "new"
                              ? "bg-blue-500 text-white"
                              : "bg-blue-500/20 text-blue-300"
                          }`}
                        >
                          New
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(selectedContact._id, "read")
                          }
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            selectedContact.status === "read"
                              ? "bg-yellow-500 text-white"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          Read
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(selectedContact._id, "replied")
                          }
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            selectedContact.status === "replied"
                              ? "bg-green-500 text-white"
                              : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          Replied
                        </button>
                      </div>
                      <button
                        onClick={() => handleDelete(selectedContact._id)}
                        className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm font-medium"
                      >
                        Delete Message
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#070F24]/90 border border-white/10 rounded-xl p-6 text-center text-gray-400">
                  Select a message to view details
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default ContactMessages;
