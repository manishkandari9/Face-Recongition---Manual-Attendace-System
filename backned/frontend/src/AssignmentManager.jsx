import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import uuid
import { FaBook, FaFilePdf, FaPlus, FaTimes } from "react-icons/fa";
import { Document, Page, Text, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// PDF styles for generating assignment PDFs
const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
});

// PDF Document component for generated PDFs
const AssignmentPDF = ({ assignment }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{assignment.subject} Assignment</Text>
      <Text style={styles.text}>Title: {assignment.title}</Text>
      <Text style={styles.text}>Description: {assignment.description}</Text>
      <Text style={styles.text}>Due Date: {assignment.dueDate}</Text>
    </Page>
  </Document>
);

const subjects = ["Software Engineering", "Android Development","Java Programming"];

function AssignmentManager() {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    id: "", // Add id field
    subject: "",
    title: "",
    description: "",
    dueDate: "",
    pdfFile: null,
  });
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch assignments from the backend
  const fetchAssignments = async () => {
    setMessage("Fetching assignments...");
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/assignments");
      if (Array.isArray(response.data)) {
        setAssignments(response.data);
        setMessage("Assignments fetched successfully!");
      } else {
        setAssignments([]);  // If not an array, set empty array
        setMessage("Error: Received invalid data.");
      }
    } catch (error) {
      setMessage("Error fetching assignments: " + (error.response?.data?.message || error.message));
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchAssignments(); // Initial load of assignments
  }, []);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };

  // Handle PDF file upload
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAssignment((prev) => ({ ...prev, pdfFile: reader.result }));
      };
      reader.readAsDataURL(file); // Convert PDF to base64
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Submit assignment to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting assignment..."); // Set submitting message
    setLoading(true); // Start loading
    // Generate a new unique ID for the assignment
    const newId = uuidv4();
    
    try {
      const assignmentWithId = { ...newAssignment, id: newId }; // Add id to the new assignment
      await axios.post("http://localhost:3000/api/assignments", assignmentWithId);
      setMessage("Assignment submitted successfully!");
      // Reset form state
      setNewAssignment({ id: "", subject: "", title: "", description: "", dueDate: "", pdfFile: null });
      fetchAssignments(); // Fetch assignments after submission
    } catch (error) {
      setMessage("Error submitting assignment: " + (error.response?.data?.message || error.message));
      console.error("Error submitting assignment:", error);
    } finally {
      setLoading(false); // Stop loading
      setTimeout(() => setMessage(""), 3000); // Hide message after 3 seconds
    }
  };

  // Delete an assignment
  const handleDelete = async (id) => {
    console.log("Attempting to delete assignment with ID:", id); // Log the ID
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await axios.delete(`http://localhost:3000/api/assignments/${id}`); // Ensure the URL is correct
        setAssignments((prev) => prev.filter((assignment) => assignment.id !== id)); // Update state
        setMessage("Assignment deleted successfully!"); // Feedback message
      } catch (error) {
        console.error("Error deleting assignment:", error);
        setMessage("Error deleting assignment: " + (error.response?.data?.message || error.message));
      } finally {
        setTimeout(() => setMessage(""), 3000); // Hide message after 3 seconds
      }
    }
  };

  const filteredAssignments =
    selectedSubject === "All"
      ? assignments
      : assignments.filter((assignment) => assignment.subject === selectedSubject);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      <nav className="w-full md:w-64 bg-gray-800 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-neon-pink">Subjects</h2>
        <ul>
          <li className="mb-2">
            <button
              onClick={() => setSelectedSubject("All")}
              className={`flex items-center w-full text-left p-2 rounded ${
                selectedSubject === "All" ? "bg-neon-blue text-gray-900" : "text-neon-blue hover:bg-gray-700"
              }`}
            >
              <FaBook className="mr-2" />
              All Subjects
            </button>
          </li>
          {subjects.map((subject) => (
            <li key={subject} className="mb-2">
              <button
                onClick={() => setSelectedSubject(subject)}
                className={`flex items-center w-full text-left p-2 rounded ${
                  selectedSubject === subject ? "bg-neon-green text-gray-900" : "text-neon-green hover:bg-gray-700"
                }`}
              >
                <FaBook className="mr-2" />
                {subject}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-neon-purple">Student Assignment Dashboard</h1>

        {/* Success Message */}
        {message && (
          <p className="mb-4 text-center text-neon-green font-bold">{message}</p>
        )}

        {/* Add Assignment Form */}
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-neon-yellow">Add New Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="subject"
              value={newAssignment.subject}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newAssignment.title}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newAssignment.description}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded col-span-2"
              required
            />
            <input
              type="date"
              name="dueDate"
              value={newAssignment.dueDate}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded"
              required
            />
            {/* File input for PDF upload */}
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="bg-gray-700 text-white p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-neon-green text-gray-900 px-4 py-2 rounded hover:bg-neon-blue transition-colors"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Submitting..." : <><FaPlus className="inline mr-2" /> Add Assignment</>}
          </button>
        </form>

        {/* Fetch Assignments Button */}
        <button
          onClick={fetchAssignments}
          className="mb-6 bg-neon-yellow text-gray-900 px-4 py-2 rounded hover:bg-neon-green transition-colors"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Fetching..." : "Fetch Assignments"}
        </button>

        {/* Display Assignments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-gray-800 p-6 rounded-lg relative">
              <button
                onClick={() => handleDelete(assignment.id)} // Use id here
                className="absolute top-2 right-2 text-neon-pink hover:text-neon-yellow"
              >
                <FaTimes />
              </button>
              <h3 className="text-xl font-bold text-neon-blue">{assignment.title}</h3>
              <p className="text-neon-purple">Subject: {assignment.subject}</p>
              <p className="text-neon-green">Due Date: {assignment.dueDate}</p>
              <p className="text-neon-gray">Description: {assignment.description}</p>

              {/* PDF Download Link */}
              {assignment.pdfFile && (
                <PDFDownloadLink
                  document={<AssignmentPDF assignment={assignment} />}
                  fileName={`${assignment.title}.pdf`}
                >
                  {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
                </PDFDownloadLink>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AssignmentManager;
