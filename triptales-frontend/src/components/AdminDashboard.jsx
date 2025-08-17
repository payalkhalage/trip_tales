
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();
  // 

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Fetch all posts from backend
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: Please login");
        return;
      }

      const res = await axios.get("/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(res.data);
      res.data.forEach((post) => fetchCommentsCount(post.id));
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error(err.response?.data?.message || "Failed to fetch posts");
    }
  };

  // ✅ Fetch comments count per post
  const fetchCommentsCount = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/comments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentsCount((prev) => ({ ...prev, [postId]: res.data.length }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // ✅ Handle post deletion
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: Token missing");
        return;
      }

      const res = await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Post deleted successfully");
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        toast.error(res.data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  const getImageSrc = (img) => {
    if (!img) return "";
    if (img.startsWith("/")) return `${window.location.origin}${img}`;
    if (/^https?:\/\//i.test(img)) return img;
    return `data:image/jpeg;base64,${img}`;
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📊 Admin Dashboard</h2>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Comments</th>
            <th>Experience</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{new Date(post.created_at).toLocaleDateString()}</td>
              <td className="link-like" onClick={() => setSelectedPost(post)}>
                {post.title}
              </td>
              <td>{commentsCount[post.id] || 0}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`/viewExperiences/${post.id}`)}
                >
                  View
                </button>
              </td>
              <td className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(post.id)}
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPost && (
        <div className="popup-overlay" onClick={() => setSelectedPost(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="popup-close"
              onClick={() => setSelectedPost(null)}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
            <h3 className="popup-title">{selectedPost.title}</h3>
            <div className="popup-meta">
              {selectedPost.location_name && <span>📍 {selectedPost.location_name}</span>}
              {selectedPost.budget != null && <span>💰 ₹{Number(selectedPost.budget).toLocaleString()}</span>}
              {selectedPost.duration_days && <span>🕒 {selectedPost.duration_days} days</span>}
              {selectedPost.best_season && <span>🌤️ {selectedPost.best_season}</span>}
            </div>
            {/* {selectedPost.images?.length > 0 && (
              <div className="popup-hero">
                <img src={getImageSrc(selectedPost.images[0])} alt="Post" />
              </div>
            )} */}
            <div className="popup-body">
              <p className="popup-experience">{selectedPost.experience}</p>
              {selectedPost.images?.slice(1).map((img, idx) => (
                <img key={idx} className="popup-extra-img" src={getImageSrc(img)} alt={`Post ${idx + 2}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

