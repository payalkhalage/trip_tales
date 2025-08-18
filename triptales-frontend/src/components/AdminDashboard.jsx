// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Modal, Button } from "react-bootstrap";
// import "./AdminDashboard.css";

// function AdminDashboard() {
//   const [posts, setPosts] = useState([]);
//   const [commentsCount, setCommentsCount] = useState({});
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [selectedFeedback, setSelectedFeedback] = useState(null);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   /** ---------------------- FETCH POSTS ---------------------- **/
//   const fetchCommentsCount = useCallback(
//     async (postId) => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/comments/${postId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCommentsCount((prev) => ({ ...prev, [postId]: res.data.length }));
//       } catch (err) {
//         console.error("Error fetching comments:", err);
//       }
//     },
//     [token]
//   );

//   const fetchPosts = useCallback(async () => {
//     try {
//       if (!token) return toast.error("Unauthorized: Please login");

//       const res = await axios.get("http://localhost:5000/api/posts", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setPosts(res.data);

//       // fetch comments count for each post
//       res.data.forEach((post) => fetchCommentsCount(post.id));
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//       toast.error(err.response?.data?.message || "Failed to fetch posts");
//     }
//   }, [token, fetchCommentsCount]);

//   /** ---------------------- FETCH FEEDBACKS ---------------------- **/
//   const fetchFeedbacks = useCallback(async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/feedback/all");
//       setFeedbacks(res.data);
//     } catch (err) {
//       console.error("Error fetching feedbacks:", err);
//     }
//   }, []);

//   /** ---------------------- USEEFFECT ---------------------- **/
//   useEffect(() => {
//     fetchPosts();
//     fetchFeedbacks();
//   }, [fetchPosts, fetchFeedbacks]);

//   /** ---------------------- DELETE POST ---------------------- **/
//   // AdminDashboard.jsx
//   const handleDelete = async (id) => {
//   try {
//     await axios.delete(`http://localhost:5000/api/posts/${id}`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`, // or sessionStorage
//       },
//     });
//     alert("Post deleted successfully");
//   } catch (err) {
//     console.error("Error deleting post:", err);
//     alert("Failed to delete post");
//   }
// };

//   /** ---------------------- ADD FEEDBACK TO ABOUT ---------------------- **/
//   const handleAddToAbout = (feedback) => {
//     const savedFeedbacks = JSON.parse(localStorage.getItem("aboutFeedbacks")) || [];
//     const updatedFeedbacks = [...savedFeedbacks, feedback];
//     localStorage.setItem("aboutFeedbacks", JSON.stringify(updatedFeedbacks));
//     toast.success("Feedback added to About Section!");
//     setSelectedFeedback(null);
//   };

//   /** ---------------------- IMAGE HANDLER ---------------------- **/
//   const getImageSrc = (img) => {
//     if (!img) return "";
//     if (img.startsWith("/")) return `${window.location.origin}${img}`;
//     if (/^https?:\/\//i.test(img)) return img;
//     return `data:image/jpeg;base64,${img}`;
//   };

//   /** ---------------------- GROUP POSTS BY USER ---------------------- **/
//   const groupedPosts = posts.reduce((acc, post) => {
//     const userId = post.user_id;
//     if (!acc[userId]) acc[userId] = { user_name: post.user_name, posts: [] };
//     acc[userId].posts.push(post);
//     return acc;
//   }, {});

//   return (
//     <div className="container py-4">
//       <h2 className="mb-4">📊 Admin Dashboard</h2>

//       {/* ---------------------- ANNOUNCEMENT BUTTON ---------------------- */}
//       <div className="mb-4 d-flex justify-content-end">
//         <button
//           className="btn btn-warning"
//           onClick={() => navigate("/admin/announcements")}
//         >
//           📢 Manage Announcements
//         </button>
//       </div>

//       {/* ---------------------- POSTS TABLE ---------------------- */}
//       <table className="table table-striped table-bordered">
//         <thead className="table-dark">
//           <tr>
//             <th>User</th>
//             <th>Date</th>
//             <th>Title</th>
//             <th>Comments</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.values(groupedPosts).map((group) =>
//             group.posts.map((post, idx) => (
//               <tr key={post.id}>
//                 {idx === 0 && <td rowSpan={group.posts.length}>{group.user_name}</td>}
//                 <td>{new Date(post.created_at).toLocaleDateString()}</td>
//                 <td
//                   className="link-like"
//                   onClick={() => setSelectedPost(post)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {post.title}
//                 </td>
//                 <td>{commentsCount[post.id] || 0}</td>
//                 <td className="d-flex gap-2">
//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => handleDelete(post.id)}
//                   >
//                     🗑 Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* ---------------------- FEEDBACK TABLE ---------------------- */}
//       <h4 className="mt-5">User Website Feedbacks</h4>
//       <table className="table table-bordered">
//         <thead className="table-secondary">
//           <tr>
//             <th>User</th>
//             <th>Email</th>
//             <th>Date</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {feedbacks.map((fb) => (
//             <tr key={fb.id}>
//               <td>{fb.username}</td>
//               <td>{fb.email}</td>
//               <td>{new Date(fb.created_at).toLocaleDateString()}</td>
//               <td>
//                 <Button variant="primary" onClick={() => setSelectedFeedback(fb)}>
//                   View
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ---------------------- POST POPUP ---------------------- */}
//       {selectedPost && (
//         <div className="popup-overlay" onClick={() => setSelectedPost(null)}>
//           <div className="popup-card" onClick={(e) => e.stopPropagation()}>
//             <button
//               className="popup-close"
//               onClick={() => setSelectedPost(null)}
//               aria-label="Close"
//               title="Close"
//             >
//               ×
//             </button>
//             <h3 className="popup-title">{selectedPost.title}</h3>
//             <div className="popup-meta">
//               {selectedPost.location_name && <span>📍 {selectedPost.location_name}</span>}
//               {selectedPost.budget != null && (
//                 <span>💰 ₹{Number(selectedPost.budget).toLocaleString()}</span>
//               )}
//               {selectedPost.duration_days && <span>🕒 {selectedPost.duration_days} days</span>}
//               {selectedPost.best_season && <span>🌤️ {selectedPost.best_season}</span>}
//             </div>
//             <div className="popup-body">
//               <p className="popup-experience">{selectedPost.experience}</p>
//               {selectedPost.images?.map((img, idx) => (
//                 <img
//                   key={idx}
//                   className="popup-extra-img"
//                   src={getImageSrc(img)}
//                   alt={`Post ${idx + 1}`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ---------------------- FEEDBACK MODAL ---------------------- */}
//       {selectedFeedback && (
//         <Modal show={true} onHide={() => setSelectedFeedback(null)} centered>
//           <Modal.Header closeButton>
//             <Modal.Title>Feedback from {selectedFeedback.username}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <p>"{selectedFeedback.experience}"</p>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="success" onClick={() => handleAddToAbout(selectedFeedback)}>
//               Add to About Section
//             </Button>
//             <Button variant="secondary" onClick={() => setSelectedFeedback(null)}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;


// src/components/AdminDashboard.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "./AdminDashboard.css";

// function AdminDashboard() {
//   const [posts, setPosts] = useState([]);
//   const [commentsCount, setCommentsCount] = useState({});
//   const [selectedPost, setSelectedPost] = useState(null);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   /** ---------------------- FETCH COMMENTS COUNT ---------------------- **/
//   const fetchCommentsCount = useCallback(
//     async (postId) => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/comments/${postId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setCommentsCount((prev) => ({ ...prev, [postId]: res.data.length }));
//       } catch (err) {
//         console.error("Error fetching comments:", err);
//       }
//     },
//     [token]
//   );

//   /** ---------------------- FETCH POSTS ---------------------- **/
//   const fetchPosts = useCallback(async () => {
//     try {
//       if (!token) return toast.error("Unauthorized: Please login");

//       const res = await axios.get("http://localhost:5000/api/posts", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setPosts(res.data);

//       // fetch comments count for each post
//       res.data.forEach((post) => fetchCommentsCount(post.id));
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//       toast.error(err.response?.data?.message || "Failed to fetch posts");
//     }
//   }, [token, fetchCommentsCount]);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   /** ---------------------- DELETE POST ---------------------- **/
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/posts/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Post deleted successfully!");
//       fetchPosts();
//     } catch (err) {
//       console.error("Error deleting post:", err);
//       toast.error("Failed to delete post");
//     }
//   };

//   /** ---------------------- IMAGE HANDLER ---------------------- **/
//   const getImageSrc = (img) => {
//     if (!img) return "/fallback.png";
//     if (/^https?:\/\//i.test(img)) return img;
//     if (img.startsWith("data:image")) return img;
//     if (img.startsWith("/uploads")) return `http://localhost:5000${img}`;
//     return img;
//   };

//   /** ---------------------- GROUP POSTS BY USER ---------------------- **/
//   const groupedPosts = posts.reduce((acc, post) => {
//     const userId = post.user_id;
//     if (!acc[userId]) acc[userId] = { user_name: post.user_name, posts: [] };
//     acc[userId].posts.push(post);
//     return acc;
//   }, {});

//   return (
//     <div className="container py-4">
//       <h2 className="mb-4">📊 Admin Dashboard</h2>

//       {/* ---------------------- ACTION BUTTONS ---------------------- */}
//       <div className="mb-4 d-flex gap-3">
//         <button
//           className="btn btn-info"
//           onClick={() => navigate("/admin/view-feedbacks")}
//         >
//           👁 View Feedbacks
//         </button>
//         <button
//           className="btn btn-warning"
//           onClick={() => navigate("/admin/announcements")}
//         >
//           📢 Manage Announcements
//         </button>
//       </div>

//       {/* ---------------------- POSTS TABLE ---------------------- */}
//       <table className="table table-striped table-bordered">
//         <thead className="table-dark">
//           <tr>
//             <th>User</th>
//             <th>Date</th>
//             <th>Title</th>
//             <th>Comments</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.values(groupedPosts).map((group) =>
//             group.posts.map((post, idx) => (
//               <tr key={post.id}>
//                 {idx === 0 && (
//                   <td rowSpan={group.posts.length}>{group.user_name}</td>
//                 )}
//                 <td>{new Date(post.created_at).toLocaleDateString()}</td>
//                 <td
//                   className="link-like"
//                   onClick={() => setSelectedPost(post)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {post.title}
//                 </td>
//                 <td>{commentsCount[post.id] || 0}</td>
//                 <td className="d-flex gap-2">
//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => handleDelete(post.id)}
//                   >
//                     🗑 Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* ---------------------- POST POPUP WITH SLIDER ---------------------- */}
//       {selectedPost && (
//         <div className="popup-overlay" onClick={() => setSelectedPost(null)}>
//           <div className="popup-card" onClick={(e) => e.stopPropagation()}>
//             <button
//               className="popup-close"
//               onClick={() => setSelectedPost(null)}
//             >
//               ×
//             </button>

//             <h3 className="popup-title">{selectedPost.title}</h3>
//             <div className="popup-meta">
//               {selectedPost.location_name && (
//                 <span>📍 {selectedPost.location_name}</span>
//               )}
//               {selectedPost.budget != null && (
//                 <span>💰 ₹{Number(selectedPost.budget).toLocaleString()}</span>
//               )}
//               {selectedPost.duration_days && (
//                 <span>🕒 {selectedPost.duration_days} days</span>
//               )}
//               {selectedPost.best_season && (
//                 <span>🌤️ {selectedPost.best_season}</span>
//               )}
//             </div>

//             <div className="popup-body">
//               <p className="popup-experience">{selectedPost.experience}</p>

//               {selectedPost.images?.length > 0 && (
//                 <ImageSlider images={selectedPost.images} />
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;

// /** ---------------------- IMAGE SLIDER COMPONENT ---------------------- **/
// function ImageSlider({ images }) {
//   const [current, setCurrent] = useState(0);

//   const next = () => setCurrent((prev) => (prev + 1) % images.length);
//   const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

//   const getImageSrc = (img) => {
//     if (!img) return "/fallback.png";
//     if (/^https?:\/\//i.test(img)) return img;
//     if (img.startsWith("data:image")) return img;
//     if (img.startsWith("/uploads")) return `http://localhost:5000${img}`;
//     return img;
//   };

//   return (
//     <div className="popup-gallery">
//       <button className="popup-gallery-btn left" onClick={prev}>‹</button>
//       <img
//         className="popup-gallery-img"
//         src={getImageSrc(images[current])}
//         alt={`Image ${current + 1}`}
//       />
//       <button className="popup-gallery-btn right" onClick={next}>›</button>
//     </div>
//   );
// }


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
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted successfully!");
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post");
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
// AdminDashboard.jsx (only updated popup part)
function PostPopup({ post, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasImages = post.images && post.images.length > 0;

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % post.images.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + post.images.length) % post.images.length);

  const getImageSrc = (img) => {
    if (!img) return "/fallback.png";
    if (/^https?:\/\//i.test(img)) return img;
    if (img.startsWith("data:image")) return img;
    if (img.startsWith("/uploads")) return `http://localhost:5000${img}`;
    return img;
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>

        <h3 className="popup-title">{post.title}</h3>

        <div className="popup-meta">
          {post.location_name && <span>📍 {post.location_name}</span>}
          {post.budget != null && <span>💰 ₹{Number(post.budget).toLocaleString()}</span>}
          {post.duration_days && <span>🕒 {post.duration_days} days</span>}
          {post.best_season && <span>🌤️ {post.best_season}</span>}
        </div>

        {hasImages && (
          <>
            <div className="popup-gallery">
              <button className="popup-gallery-btn left" onClick={prev}>‹</button>
              <img
                className="popup-gallery-img"
                src={getImageSrc(post.images[currentIndex])}
                alt={`Image ${currentIndex + 1}`}
              />
              <button className="popup-gallery-btn right" onClick={next}>›</button>
            </div>

            {/* Thumbnails */}
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
          </>
        )}

        <div className="popup-body">
          <p className="popup-experience">{post.experience}</p>
        </div>
      </div>
    </div>
  );
}
