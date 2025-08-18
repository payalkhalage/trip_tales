// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaArrowLeft, FaIdCard , FaEnvelope, FaStar, FaEdit, FaPlus } from 'react-icons/fa';
// import { toast } from "react-toastify";
// import { Modal, Button } from 'react-bootstrap';
// import { useNavigate } from "react-router-dom";
// import './MyAccount.css';

// function MyAccount() {
//   const [user, setUser] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [likesMap, setLikesMap] = useState({});
//   const [helpfulsMap, setHelpfulsMap] = useState({});
//   const [commentsMap, setCommentsMap] = useState({});
//   const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
//   const [showingBookmarks, setShowingBookmarks] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [editingPostId, setEditingPostId] = useState(null);
//   const [editedPost, setEditedPost] = useState({ title: '', experience: '', budget: '', location: '' });
//   const [showExperienceModal, setShowExperienceModal] = useState(false);
//   const [experienceText, setExperienceText] = useState('');
//   const [userExperiences, setUserExperiences] = useState([]); // Add this with your other state declarations

//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) return;

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//         setExperienceText(res.data.experience || '');
//       } catch {
//         toast.error("Failed to fetch user");
//       }
//     };

//     const fetchUserPosts = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/posts/user", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserPosts(res.data);
//       } catch {
//         toast.error("Failed to fetch user posts");
//       }
//     };

//     fetchUser();
//     fetchUserPosts();
//   }, [token]);

//   useEffect(() => {
//     if (!user || userPosts.length === 0) return;

//     const fetchLikes = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/likes");
//         const map = {};
//         res.data.forEach(({ post_id }) => {
//           map[post_id] = (map[post_id] || 0) + 1;
//         });
//         setLikesMap(map);
//       } catch {
//         toast.error("Failed to fetch likes");
//       }
//     };

//     const fetchHelpfuls = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/helpfuls");
//         const map = {};
//         res.data.forEach(({ post_id }) => {
//           map[post_id] = (map[post_id] || 0) + 1;
//         });
//         setHelpfulsMap(map);
//       } catch {
//         toast.error("Failed to fetch helpful marks");
//       }
//     };

//     const fetchCommentsCount = async () => {
//       try {
//         const map = {};
//         await Promise.all(
//           userPosts.map(async (post) => {
//             const res = await axios.get(`http://localhost:5000/api/comments/${post.id}`);
//             map[post.id] = res.data.length;
//           })
//         );
//         setCommentsMap(map);
//       } catch {
//         toast.error("Failed to fetch comments");
//       }
//     };

//    const fetchBookmarks = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/bookmarks?userId=${user.id}`);
//         setBookmarkedPosts(res.data);
//       } catch {
//         toast.error("Failed to fetch bookmarks");
//       }
//     };

//     fetchLikes();
//     fetchHelpfuls();
//     fetchCommentsCount();
//     fetchBookmarks();
//   }, [user, userPosts]);

// // const handleSaveExperience = async () => {
// //   try {
// //     const response = await axios.post(
// //       "http://localhost:5000/api/experiences",
// //       { experience: experienceText },
// //       { headers: { Authorization: `Bearer ${token}` } }
// //     );
    
// //     setUser({ ...user, experience: experienceText });
// //     setShowExperienceModal(false);
// //     toast.success("Experience saved successfully!");
// //     fetchUserExperiences(); // Refresh the experiences list
// //   } catch (error) {
// //     toast.error("Failed to save experience");
// //     console.error(error);
// //   }
// // };

//   const totalComments = Object.values(commentsMap).reduce((acc, val) => acc + val, 0);
//   const totalLikes = Object.values(likesMap).reduce((acc, val) => acc + val, 0);
//   const totalHelpfuls = Object.values(helpfulsMap).reduce((acc, val) => acc + val, 0);
//   const averageEngagement = userPosts.length > 0 ? (totalLikes + totalHelpfuls) / userPosts.length : 0;

//  const displayedPosts = showingBookmarks ? bookmarkedPosts : userPosts;

//   const startEditing = (post) => {
//     setEditingPostId(post.id);
//     setEditedPost({
//       title: post.title,
//       experience: post.experience,
//       budget: post.budget,
//       location: post.location_name,
//     });
//   };

//   const cancelEditing = () => {
//     setEditingPostId(null);
//     setEditedPost({ title: '', experience: '', budget: '', location: '' });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedPost((prev) => ({ ...prev, [name]: value }));
//   };

//   const saveEdit = async (postId) => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/posts/${postId}`,
//         editedPost,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Post updated");
//       setEditingPostId(null);
//       const res = await axios.get("http://localhost:5000/api/posts/user", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUserPosts(res.data);
//     } catch {
//       toast.error("Failed to update post");
//     }
//   };

//   const deletePost = async (postId) => {
//     if (!window.confirm("Delete this post?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Post deleted");
//       const res = await axios.get("http://localhost:5000/api/posts/user", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUserPosts(res.data);
//     } catch {
//       toast.error("Failed to delete post");
//     }
//   };

// // const fetchUserExperiences = async () => {
// //   try {
// //     const res = await axios.get("http://localhost:5000/api/experiences", {
// //       headers: { Authorization: `Bearer ${token}` }
// //     });
// //     setUserExperiences(res.data);
// //   } catch (error) {
// //     toast.error("Failed to fetch experiences");
// //     console.error(error);
// //   }
// // };
// const fetchUserExperiences = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/experiences", {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const experienceObj = res.data.data; // This is either object or null
//       setUserExperiences(experienceObj ? [experienceObj] : []);

//       if (experienceObj) {
//         setUser(prev => ({ ...prev, experience: experienceObj.experience }));
//         setExperienceText(experienceObj.experience);
//       } else {
//         setUser(prev => ({ ...prev, experience: '' }));
//         setExperienceText('');
//       }
//     } catch (error) {
//       toast.error("Failed to fetch experiences");
//       console.error(error);
//     }
//   };

//   const handleSaveExperience = async () => {
//     try {
//       if (userExperiences.length > 0) {
//         // Update existing experience
//         const latestId = userExperiences[0].id;
//         await axios.put(
//           `http://localhost:5000/api/experiences/${latestId}`,
//           { experience: experienceText },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success("Experience updated!");
//       } else {
//         // Create new experience
//         await axios.post(
//           "http://localhost:5000/api/experiences",
//           { experience: experienceText },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success("Experience saved!");
//       }

//       // Refresh experiences and update user state
//       fetchUserExperiences();
//       setShowExperienceModal(false);

//     } catch (error) {
//       toast.error("Failed to save experience");
//       console.error(error);
//     }
//   };

// // Call it when needed, for example:
// useEffect(() => {
//   if (user) {
//     fetchUserExperiences();
//   }
// }, [user]);

//   return (
//     <div className="container py-4">
//       <h2>My Account</h2>

//       <button
//         className="btn btn-outline-secondary mb-3 d-flex align-items-center gap-2"
//         onClick={() => navigate('/postdashboard')}
//       >
//         <FaArrowLeft />
//         Back to Dashboard
//       </button>

//       {user && (
//         <div className="tt-user-profile-card tt-card-theme">
//           <div className="tt-user-info-grid">
//             <div className="tt-user-basic-info">

// <div className="tt-info-item">
//   <span className="tt-icon-circle tt-primary-icon">
//     <FaIdCard className="tt-icon" />
//   </span>
//   <div className="tt-info-content">
//     <span className="tt-info-label">Name</span>
//     <p className="tt-info-value">{user.name}</p>
//   </div>
// </div>
              
//               <div className="tt-info-item">
//                 <span className="tt-icon-circle tt-accent-icon">
//                   <FaEnvelope className="tt-icon" />
//                 </span>
//                 <div className="tt-info-content">
//                   <span className="tt-info-label">Email</span>
//                   <p className="tt-info-value">{user.email}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="tt-user-experience">
//               <div className="tt-experience-container">
//                 <h6 className="tt-experience-title">
//                   <FaStar className="tt-star-icon" />
//                   <span>My Travel App Journey</span>
//                 </h6>
                
//                 {user.experience ? (
//                   <div className="tt-experience-content">
//                     <p className="tt-experience-text">"{user.experience}"</p>
//                     <button 
//                       className="tt-edit-btn tt-btn-theme"
//                       onClick={() => setShowExperienceModal(true)}
//                     >
//                       <FaEdit className="tt-btn-icon" />
//                       <span>Edit Feedback</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <button 
//                     className="tt-add-btn tt-btn-theme"
//                     onClick={() => setShowExperienceModal(true)}
//                   >
//                     <FaPlus className="tt-btn-icon" />
//                     <span>Share Your Experience</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Experience Modal */}
//       <Modal 
//         show={showExperienceModal} 
//         onHide={() => setShowExperienceModal(false)} 
//         centered
//         className="tt-experience-modal"
//       >
//         <Modal.Header closeButton className="tt-modal-header">
//           <Modal.Title className="tt-modal-title">
//             <FaStar className="tt-modal-title-icon" />
//             <span>{user?.experience ? 'Edit' : 'Share'} Your Travel Story</span>
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="tt-modal-body">
//           <p className="tt-modal-prompt">How has your journey with our app been?</p>
//           <textarea
//             className="tt-feedback-textarea"
//             rows={5}
//             value={experienceText}
//             onChange={(e) => setExperienceText(e.target.value)}
//             placeholder="Tell us what you loved or how we can improve your travel planning experience..."
//           />
//           <div className="tt-feedback-note">
//             Your insights help us create better adventures for travelers worldwide.
//           </div>
//         </Modal.Body>
//         <Modal.Footer className="tt-modal-footer">
//           <button 
//             className="tt-modal-cancel-btn"
//             onClick={() => setShowExperienceModal(false)}
//           >
//             Cancel
//           </button>
//           <button 
//             className="tt-modal-submit-btn"
//             onClick={handleSaveExperience}
//             disabled={!experienceText.trim()}
//           >
//             Share Your Story
//           </button>
//         </Modal.Footer>
//       </Modal>

//       {/* Rest of your existing code for posts display */}
//       <div className="d-flex gap-3 mb-4">
//         <div className="p-3 border rounded shadow-sm text-center flex-fill" onClick={() => setShowingBookmarks(false)}>
//           <h4>{userPosts.length}</h4><p>Total Posts</p>
//         </div>
//         <div className="p-3 border rounded shadow-sm text-center flex-fill" onClick={() => setShowingBookmarks(false)}>
//           <h4>{averageEngagement.toFixed(2)}</h4><p>Avg Engagement</p>
//         </div>
//         <div className="p-3 border rounded shadow-sm text-center flex-fill" onClick={() => setShowingBookmarks(false)}>
//           <h4>{totalComments}</h4><p>Total Comments</p>
//         </div>
//         <div className="p-3 border rounded shadow-sm text-center flex-fill bg-warning" onClick={() => setShowingBookmarks(true)}>
//           <h4>{bookmarkedPosts.length}</h4><p>Bookmarked Posts</p>
//         </div>
//       </div>

//       <h3>{showingBookmarks ? "Bookmarked Posts" : "Your Trip Posts"}</h3>

//       {displayedPosts.length === 0 ? (
//         <p>{showingBookmarks ? "No bookmarked posts." : "You have no posts."}</p>
//       ) : showingBookmarks ? (
//         <ul className="list-group mb-4">
//           {displayedPosts.map((post) => (
//             <li
//               key={post.id}
//               className="list-group-item list-group-item-action"
//               style={{ cursor: "pointer" }}
//               onClick={() => setSelectedPost(post)}
//             >
//               {post.title}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Title</th>
//               <th>Likes</th>
//               <th>Helpful</th>
//               <th>Comments</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedPosts.map((post) => (
//               <tr key={post.id}>
//                 <td>{new Date(post.created_at).toLocaleDateString()}</td>
//                 <td>
//                   {editingPostId === post.id ? (
//                     <input type="text" name="title" className="form-control" value={editedPost.title} onChange={handleChange} />
//                   ) : post.title}
//                 </td>
//                 <td>{likesMap[post.id] || 0}</td>
//                 <td>{helpfulsMap[post.id] || 0}</td>
//                 <td>{commentsMap[post.id] || 0}</td>
//                 <td>
//                   {editingPostId === post.id ? (
//                     <>
//                       <button className="btn btn-success btn-sm me-2" onClick={() => saveEdit(post.id)}>Save</button>
//                       <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>Cancel</button>
//                     </>
//                   ) : (
//                     <>
//                     <div className="btn-group">
//                       <button
//                         className="btn btn-primary btn-sm me-2"
//                         onClick={() => navigate(`/edit-post/${post.id}`, { state: { post } })}
//                       >
//                         Edit
//                       </button>

//                       <button className="btn btn-danger btn-sm" onClick={() => deletePost(post.id)}>Delete</button>
//                       </div>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {showingBookmarks && selectedPost && (
//         <div className="card p-3 shadow-sm mt-4">
//           <h4>{selectedPost.title}</h4>
//           <p>{selectedPost.experience}</p>
//           <p><strong>Location:</strong> {selectedPost.location_name}</p>
//           <p><strong>Budget:</strong> ₹{selectedPost.budget}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MyAccount;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaIdCard , FaEnvelope, FaStar, FaEdit, FaPlus } from 'react-icons/fa';
import { toast } from "react-toastify";
import { Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './MyAccount.css';

function MyAccount() {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [likesMap, setLikesMap] = useState({});
  const [helpfulsMap, setHelpfulsMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [showingBookmarks, setShowingBookmarks] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPost, setEditedPost] = useState({ title: '', experience: '', budget: '', location: '' });
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [experienceText, setExperienceText] = useState('');
  const [userExperiences, setUserExperiences] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch user info and posts
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);

        // Fetch experiences immediately after getting user
        fetchUserExperiences();
      } catch {
        toast.error("Failed to fetch user");
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPosts(res.data);
      } catch {
        toast.error("Failed to fetch user posts");
      }
    };

    fetchUser();
    fetchUserPosts();
  }, [token]);

  // Fetch likes, helpfuls, comments, bookmarks
  useEffect(() => {
    if (!user || userPosts.length === 0) return;

    const fetchLikes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/likes");
        const map = {};
        res.data.forEach(({ post_id }) => {
          map[post_id] = (map[post_id] || 0) + 1;
        });
        setLikesMap(map);
      } catch {
        toast.error("Failed to fetch likes");
      }
    };

    const fetchHelpfuls = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/helpfuls");
        const map = {};
        res.data.forEach(({ post_id }) => {
          map[post_id] = (map[post_id] || 0) + 1;
        });
        setHelpfulsMap(map);
      } catch {
        toast.error("Failed to fetch helpful marks");
      }
    };

    const fetchCommentsCount = async () => {
      try {
        const map = {};
        await Promise.all(
          userPosts.map(async (post) => {
            const res = await axios.get(`http://localhost:5000/api/comments/${post.id}`);
            map[post.id] = res.data.length;
          })
        );
        setCommentsMap(map);
      } catch {
        toast.error("Failed to fetch comments");
      }
    };

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookmarks?userId=${user.id}`);
        setBookmarkedPosts(res.data);
      } catch {
        toast.error("Failed to fetch bookmarks");
      }
    };

    fetchLikes();
    fetchHelpfuls();
    fetchCommentsCount();
    fetchBookmarks();
  }, [user, userPosts]);

  // Fetch user experiences and update user state
  const fetchUserExperiences = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/experiences", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const experienceObj = res.data.data; // This is either object or null
      setUserExperiences(experienceObj ? [experienceObj] : []);

      if (experienceObj) {
        setUser(prev => ({ ...prev, experience: experienceObj.experience }));
        setExperienceText(experienceObj.experience);
      } else {
        setUser(prev => ({ ...prev, experience: '' }));
        setExperienceText('');
      }
    } catch (error) {
      toast.error("Failed to fetch experiences");
      console.error(error);
    }
  };

  // Save or update experience
  const handleSaveExperience = async () => {
    try {
      if (userExperiences.length > 0) {
        // Update existing experience
        const latestId = userExperiences[0].id;
        await axios.put(
          `http://localhost:5000/api/experiences/${latestId}`,
          { experience: experienceText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Experience updated!");
      } else {
        // Create new experience
        await axios.post(
          "http://localhost:5000/api/experiences",
          { experience: experienceText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Experience saved!");
      }

      // Refresh experiences and update user state
      fetchUserExperiences();
      setShowExperienceModal(false);

    } catch (error) {
      toast.error("Failed to save experience");
      console.error(error);
    }
  };

  const totalComments = Object.values(commentsMap).reduce((acc, val) => acc + val, 0);
  const totalLikes = Object.values(likesMap).reduce((acc, val) => acc + val, 0);
  const totalHelpfuls = Object.values(helpfulsMap).reduce((acc, val) => acc + val, 0);
  const averageEngagement = userPosts.length > 0 ? (totalLikes + totalHelpfuls) / userPosts.length : 0;
  const displayedPosts = showingBookmarks ? bookmarkedPosts : userPosts;

  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditedPost({
      title: post.title,
      experience: post.experience,
      budget: post.budget,
      location: post.location_name,
    });
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditedPost({ title: '', experience: '', budget: '', location: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (postId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/${postId}`,
        editedPost,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Post updated");
      setEditingPostId(null);
      const res = await axios.get("http://localhost:5000/api/posts/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPosts(res.data);
    } catch {
      toast.error("Failed to update post");
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted");
      const res = await axios.get("http://localhost:5000/api/posts/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPosts(res.data);
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="container py-4">
      <h2>My Account</h2>

      <button
        className="btn btn-outline-secondary mb-3 d-flex align-items-center gap-2"
        onClick={() => navigate('/postdashboard')}
      >
        <FaArrowLeft />
        Back to Dashboard
      </button>

      {user && (
        <div className="tt-user-profile-card tt-card-theme">
          <div className="tt-user-info-grid">
            <div className="tt-user-basic-info">

              <div className="tt-info-item">
                <span className="tt-icon-circle tt-primary-icon">
                  <FaIdCard className="tt-icon" />
                </span>
                <div className="tt-info-content">
                  <span className="tt-info-label">Name</span>
                  <p className="tt-info-value">{user.name}</p>
                </div>
              </div>
              
              <div className="tt-info-item">
                <span className="tt-icon-circle tt-accent-icon">
                  <FaEnvelope className="tt-icon" />
                </span>
                <div className="tt-info-content">
                  <span className="tt-info-label">Email</span>
                  <p className="tt-info-value">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="tt-user-experience">
              <div className="tt-experience-container">
                <h6 className="tt-experience-title">
                  <FaStar className="tt-star-icon" />
                  <span>My Travel App Journey</span>
                </h6>
                
                {user.experience ? (
                  <div className="tt-experience-content">
                    <p className="tt-experience-text">"{user.experience}"</p>
                    <button 
                      className="tt-edit-btn tt-btn-theme"
                      onClick={() => setShowExperienceModal(true)}
                    >
                      <FaEdit className="tt-btn-icon" />
                      <span>Edit Feedback</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    className="tt-add-btn tt-btn-theme"
                    onClick={() => setShowExperienceModal(true)}
                  >
                    <FaPlus className="tt-btn-icon" />
                    <span>Share Your Experience</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      <Modal 
        show={showExperienceModal} 
        onHide={() => setShowExperienceModal(false)} 
        centered
        className="tt-experience-modal"
      >
        <Modal.Header closeButton className="tt-modal-header">
          <Modal.Title className="tt-modal-title">
            <FaStar className="tt-modal-title-icon" />
            <span>{user?.experience ? 'Edit' : 'Share'} Your Travel Story</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="tt-modal-body">
          <p className="tt-modal-prompt">How has your journey with our app been?</p>
          <textarea
            className="tt-feedback-textarea"
            rows={5}
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
            placeholder="Tell us what you loved or how we can improve your travel planning experience..."
          />
          <div className="tt-feedback-note">
            Your insights help us create better adventures for travelers worldwide.
          </div>
        </Modal.Body>
        <Modal.Footer className="tt-modal-footer">
          <button 
            className="tt-modal-cancel-btn"
            onClick={() => setShowExperienceModal(false)}
          >
            Cancel
          </button>
          <button 
            className="tt-modal-submit-btn"
            onClick={handleSaveExperience}
            disabled={!experienceText.trim()}
          >
            Share Your Story
          </button>
        </Modal.Footer>
      </Modal>

      {/* Stats and posts display */}
      <div className="d-flex gap-3 mb-4">
        <div className="p-3 border rounded shadow-sm text-center flex-fill" onClick={() => setShowingBookmarks(false)}>
          <h4>{userPosts.length}</h4><p>Total Posts</p>
        </div>
        <div className="p-3 border rounded shadow-sm text-center flex-fill" onClick={() => setShowingBookmarks(false)}>
          <h4>{averageEngagement.toFixed(2)}</h4><p>Avg Engagement</p>
        </div>
        <div className="p-3 border rounded shadow-sm text-center flex-fill" onClick={() => setShowingBookmarks(false)}>
          <h4>{totalComments}</h4><p>Total Comments</p>
        </div>
        <div className="p-3 border rounded shadow-sm text-center flex-fill bg-warning" onClick={() => setShowingBookmarks(true)}>
          <h4>{bookmarkedPosts.length}</h4><p>Bookmarked Posts</p>
        </div>
      </div>

      <h3>{showingBookmarks ? "Bookmarked Posts" : "Your Trip Posts"}</h3>

      {displayedPosts.length === 0 ? (
        <p>{showingBookmarks ? "No bookmarked posts." : "You have no posts."}</p>
      ) : showingBookmarks ? (
        <ul className="list-group mb-4">
          {displayedPosts.map((post) => (
            <li
              key={post.id}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedPost(post)}
            >
              {post.title}
            </li>
          ))}
        </ul>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Likes</th>
              <th>Helpful</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedPosts.map((post) => (
              <tr key={post.id}>
                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                <td>
                  {editingPostId === post.id ? (
                    <input type="text" name="title" className="form-control" value={editedPost.title} onChange={handleChange} />
                  ) : post.title}
                </td>
                <td>{likesMap[post.id] || 0}</td>
                <td>{helpfulsMap[post.id] || 0}</td>
                <td>{commentsMap[post.id] || 0}</td>
                <td>
                  {editingPostId === post.id ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => saveEdit(post.id)}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <div className="btn-group">
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/edit-post/${post.id}`, { state: { post } })}
                      >
                        Edit
                      </button>

                      <button className="btn btn-danger btn-sm" onClick={() => deletePost(post.id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showingBookmarks && selectedPost && (
        <div className="card p-3 shadow-sm mt-4">
          <h4>{selectedPost.title}</h4>
          <p>{selectedPost.experience}</p>
          <p><strong>Location:</strong> {selectedPost.location_name}</p>
          <p><strong>Budget:</strong> ₹{selectedPost.budget}</p>
        </div>
      )}
    </div>
  );
}

export default MyAccount;