
// AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /** ---------------------- FETCH COMMENTS COUNT ---------------------- **/
  const fetchCommentsCount = useCallback(
    async (postId) => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/comments/${postId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCommentsCount((prev) => ({ ...prev, [postId]: res.data.length }));
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    },
    [token]
  );

  /** ---------------------- FETCH POSTS ---------------------- **/
  const fetchPosts = useCallback(async () => {
    try {
      if (!token) return toast.error("Unauthorized: Please login");

      const res = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(res.data);
      res.data.forEach((post) => fetchCommentsCount(post.id));
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error(err.response?.data?.message || "Failed to fetch posts");
    }
  }, [token, fetchCommentsCount]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /** ---------------------- DELETE POST ---------------------- **/


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // ✅ Debug: Confirm token exists

      const response = await axios.delete(
        `http://localhost:5000/api/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete success:", response.data);
      toast.success("Post deleted!");
      fetchPosts();
    } catch (err) {
      console.error("DELETE Error:", {
        status: err.response?.status,
        data: err.response?.data,
        config: err.config, // ✅ Full request details
      });
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/auth");
      }
    }
  };
  /** ---------------------- GROUP POSTS BY USER ---------------------- **/
  const groupedPosts = posts.reduce((acc, post) => {
    const userId = post.user_id;
    if (!acc[userId]) acc[userId] = { user_name: post.user_name, posts: [] };
    acc[userId].posts.push(post);
    return acc;
  }, {});

  return (
    <div className="container py-4">
      <h2 className="mb-4">📊 Admin Dashboard</h2>

      <div className="mb-4 d-flex gap-3">
        <button
          className="btn btn-info"
          onClick={() => navigate("/admin/view-feedbacks")}
        >
          👁 View Feedbacks
        </button>
        <button
          className="btn btn-warning"
          onClick={() => navigate("/admin/announcements")}
        >
          📢 Manage Announcements
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>User</th>
            <th>Date</th>
            <th>Title</th>
            <th>Comments</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedPosts).map((group) =>
            group.posts.map((post, idx) => (
              <tr key={post.id}>
                {idx === 0 && (
                  <td rowSpan={group.posts.length}>{group.user_name}</td>
                )}
                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                <td
                  className="link-like"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.title}
                </td>
                <td>{commentsCount[post.id] || 0}</td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ---------------------- POST POPUP ---------------------- */}
      {selectedPost && (
        <PostPopup
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;

/** ---------------------- POST POPUP COMPONENT ---------------------- **/
function PostPopup({ post, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasImages = post.images && post.images.length > 0;

  const next = () => setCurrentIndex((prev) => (prev + 1) % post.images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + post.images.length) % post.images.length);

  const getImageSrc = (img) => {
    if (!img) return "/fallback.png";
    if (/^https?:\/\//i.test(img)) return img;
    if (img.startsWith("data:image")) return img;
    if (img.startsWith("/uploads")) return `http://localhost:5000${img}`;
    return img;
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button className="popup-close" onClick={onClose}>&times;</button>

        <div className="popup-header">
          <h2 className="popup-title">{post.title}</h2>
          <div className="popup-meta">
            {post.location_name && (
              <span className="meta-item">
                <span role="img" aria-label="location">📍</span> {post.location_name}
              </span>
            )}
            {post.budget != null && (
              <span className="meta-item">
                <span role="img" aria-label="budget">💰</span> ₹{Number(post.budget).toLocaleString()}
              </span>
            )}
            {post.duration_days && (
              <span className="meta-item">
                <span role="img" aria-label="duration">🕒</span> {post.duration_days} days
              </span>
            )}
            {post.best_season && (
              <span className="meta-item">
                <span role="img" aria-label="season">🌤️</span> {post.best_season}
              </span>
            )}
          </div>
        </div>


        <div className="popup-content">
          {hasImages && (
            // <div className="popup-gallery-container">
            //   <button className="popup-gallery-btn left" onClick={prev}>&lsaquo;</button>
            //   <img
            //     className="popup-gallery-img"
            //     src={getImageSrc(post.images[currentIndex])}
            //     alt={`Image ${currentIndex + 1}`}
            //   />
            //   <button className="popup-gallery-btn right" onClick={next}>&rsaquo;</button>

            //   <div className="popup-thumbnails">
            //     {post.images.map((img, idx) => (
            //       <img
            //         key={idx}
            //         src={getImageSrc(img)}
            //         alt={`Thumb ${idx + 1}`}
            //         className={`popup-thumb ${currentIndex === idx ? "active-thumb" : ""}`}
            //         onClick={() => setCurrentIndex(idx)}
            //       />
            //     ))}
            //   </div>
            // </div>

            <div className="popup-gallery-container">
              <button className="popup-gallery-btn left" onClick={prev}>&lsaquo;</button>
              <img
                className="popup-gallery-img"
                src={getImageSrc(post.images[currentIndex])}
                alt={`Image ${currentIndex + 1}`}
              />
              <button className="popup-gallery-btn right" onClick={next}>&rsaquo;</button>

              {/* Thumbnails below main image */}
              <div className="popup-thumbnails">
                {post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={getImageSrc(img)}
                    alt={`Thumb ${idx + 1}`}
                    className={`popup-thumb ${currentIndex === idx ? "active-thumb" : ""}`}
                    onClick={() => setCurrentIndex(idx)}
                  />
                ))}
              </div>
            </div>

          )}

          <div className="popup-experience-container">
            <h3>Travel Experience</h3>
            <p className="popup-experience">{post.experience}</p>
          </div>
        </div>
      </div>
    </div>
  );
}