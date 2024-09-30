import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DeleteSessionModal from "../../components/DeleteSessionModal/DeleteSessionModal";
import "./SessionsOverviewPage.scss";

const API_URL = import.meta.env.VITE_API_URL; 

export default function SessionsOverviewPage() {
  const [sessions, setSessions] = useState([]);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${API_URL}/session`); 
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const handleDeleteClick = (sessionId) => {
    setSessionToDelete(sessionId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${API_URL}/session/${sessionToDelete}`); 
      if (response.status === 200) {
        setSessions(sessions.filter((session) => session.id !== sessionToDelete)); 
        setSessionToDelete(null);
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

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
              <button onClick={() => handleDeleteClick(session.id)} className="delete-button">
                <i className="fas fa-trash"></i> 
              </button>
            </div>
          ))
        ) : (
          <p>No sessions available</p>
        )}
      </div>

      <DeleteSessionModal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </main>
  );
}
