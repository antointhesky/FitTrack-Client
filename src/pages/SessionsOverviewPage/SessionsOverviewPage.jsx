import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DeleteSessionModal from "../../components/DeleteSessionModal/DeleteSessionModal";
import "./SessionsOverviewPage.scss";

export default function SessionsOverviewPage() {
  const [sessions, setSessions] = useState([]);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("http://localhost:5050/session");
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  // Handle opening delete confirmation modal
  const handleDeleteClick = (sessionId) => {
    setSessionToDelete(sessionId);
    setIsDeleteModalOpen(true);
  };

  // Handle confirming delete
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5050/session/${sessionToDelete}`);
      if (response.status === 200) {
        setSessions(sessions.filter((session) => session.id !== sessionToDelete)); // Remove the deleted session
        setSessionToDelete(null);
        setIsDeleteModalOpen(false); // Close the modal
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  // Handle canceling delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <main className="sessions-overview-page">
      <h1>Your Sessions</h1>

      <div className="sessions-container">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session.id} className="session-card">
              <Link to={`/session/${session.id}`} className="session-link">
                <h3>Session {session.id}</h3>
                <p>Date: {new Date(session.date).toLocaleDateString()}</p>
              </Link>
              {/* Delete Button with White Trash Icon */}
              <button onClick={() => handleDeleteClick(session.id)} className="delete-button">
                <i className="fas fa-trash"></i> {/* White Trash Icon */}
              </button>
            </div>
          ))
        ) : (
          <p>No sessions available</p>
        )}
      </div>

      {/* DeleteSessionModal */}
      <DeleteSessionModal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </main>
  );
}
