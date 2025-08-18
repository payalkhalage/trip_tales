import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "./ViewFeedbacks.css"; // optional: for popup styles

function ViewFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  /** ---------------------- FETCH FEEDBACKS ---------------------- **/
  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback/all");
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      toast.error("Failed to fetch feedbacks");
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  /** ---------------------- ADD FEEDBACK TO ABOUT ---------------------- **/
  const handleAddToAbout = (feedback) => {
    const savedFeedbacks = JSON.parse(localStorage.getItem("aboutFeedbacks")) || [];
    const updatedFeedbacks = [...savedFeedbacks, feedback];
    localStorage.setItem("aboutFeedbacks", JSON.stringify(updatedFeedbacks));
    toast.success("Feedback added to About Section!");
    setSelectedFeedback(null);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">👁 User Feedbacks</h2>

      <table className="table table-bordered">
        <thead className="table-secondary">
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb.id}>
              <td>{fb.username}</td>
              <td>{fb.email}</td>
              <td>{new Date(fb.created_at).toLocaleDateString()}</td>
              <td>
                <Button variant="primary" onClick={() => setSelectedFeedback(fb)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------------------- FEEDBACK POPUP ---------------------- */}
      {selectedFeedback && (
        <div className="popup-overlay" onClick={() => setSelectedFeedback(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="popup-close"
              onClick={() => setSelectedFeedback(null)}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
            <h3 className="popup-title">
              Feedback from {selectedFeedback.username}
            </h3>
            <div className="popup-body">
              <p>"{selectedFeedback.experience}"</p>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="success"
                onClick={() => handleAddToAbout(selectedFeedback)}
              >
                Add to About Section
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedFeedback(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewFeedbacks;
