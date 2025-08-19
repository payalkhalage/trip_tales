import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SummaryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/summary/${id}`);
        setSummary(res.data);
      } catch (err) {
        setError("Summary not found or failed to load");
        console.error("Error loading summary", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [id]);

  if (loading) return <p>Loading summary...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container py-5">
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate('/postdashboard')} // Replace '/dashboard' with your actual dashboard route
      >
        ← Back to Dashboard
      </button>

      <h2>{summary.title}</h2>
      <p><strong>Location:</strong> {summary.location_name}</p>
      <p><strong>Duration:</strong> {summary.duration_days} days</p>
      <p><strong>Budget:</strong> ₹{summary.budget}</p>
      <hr />
      <p>{summary.summary_text}</p>
    </div>
  );
};

export default SummaryPage;
