// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';


// function MyAccount() {
//     const [user, setUser] = useState(null);
//     const [userPosts, setUserPosts] = useState([]);
//     const [editingPostId, setEditingPostId] = useState(null);
//     const [editedPost, setEditedPost] = useState({ title: '', experience: '', budget: '', location: '' });

//     const token = localStorage.getItem('token');
//     const navigate = useNavigate();
//     useEffect(() => {
//         const fetchCurrentUser = async () => {
//             if (!token) return;
//             try {
//                 const res = await axios.get('http://localhost:5000/api/me', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setUser(res.data);
//             } catch (err) {
//                 console.error('Failed to fetch user profile', err);
//             }
//         };

//         const fetchUserPosts = async () => {
//             if (!token) return;
//             try {
//                 const res = await axios.get('http://localhost:5000/api/posts/user', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setUserPosts(res.data);
//             } catch (err) {
//                 console.error('Failed to fetch user posts', err);
//                 toast.error('Failed to load your posts');
//             }
//         };

//         fetchCurrentUser();
//         fetchUserPosts();
//     }, [token]);

//     const startEditing = (post) => {
//         setEditingPostId(post.id);
//         setEditedPost({
//             title: post.title,
//             experience: post.experience,
//             budget: post.budget,
//             location: post.location_name,
//         });
//     };

//     const cancelEditing = () => {
//         setEditingPostId(null);
//         setEditedPost({ title: '', experience: '', budget: '', location: '' });
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEditedPost(prev => ({ ...prev, [name]: value }));
//     };

//     const saveEdit = async (postId) => {
//         try {
//             await axios.put(
//                 `http://localhost:5000/api/posts/${postId}`,
//                 { ...editedPost },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             toast.success('Post updated successfully');
//             setEditingPostId(null);
//             const res = await axios.get('http://localhost:5000/api/posts/user', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setUserPosts(res.data);
//         } catch (err) {
//             console.error('Failed to update post', err);
//             toast.error('Failed to update post');
//         }
//     };

//     const deletePost = async (postId) => {
//         if (!window.confirm('Are you sure you want to delete this post?')) return;
//         try {
//             await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             toast.success('Post deleted successfully');
//             const res = await axios.get('http://localhost:5000/api/posts/user', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setUserPosts(res.data);
//         } catch (err) {
//             console.error('Failed to delete post', err);
//             toast.error('Failed to delete post');
//         }
//     };

//     if (!user) return <p>Loading your profile...</p>;

//     return (
//         <div className="container py-4">
//             <h2>My Account</h2>
//             <div className="card p-3 shadow-sm mb-4">
//                 <p><strong>Name:</strong> {user.name}</p>
//                 <p><strong>Email:</strong> {user.email}</p>
//             </div>

//             <h3>Your Trip Posts</h3>

//             {userPosts.length === 0 ? (
//                 <p>You have not posted any trips yet.</p>
//             ) : (
//                 <table className="table table-striped">
//                     <thead>
//                         <tr>
//                             <th>Title</th>
//                             <th style={{ width: '200px' }}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {userPosts.map((post) => (
//                             <tr key={post.id}>
//                                 <td>
//                                     {editingPostId === post.id ? (
//                                         <input
//                                             type="text"
//                                             name="title"
//                                             value={editedPost.title}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                         />
//                                     ) : (
//                                         post.title
//                                     )}
//                                 </td>
//                                 <td>
//                                     {editingPostId === post.id ? (
//                                         <>
//                                             <button
//                                                 className="btn btn-success btn-sm me-2"
//                                                 onClick={() => saveEdit(post.id)}
//                                             >
//                                                 Save
//                                             </button>
//                                             <button
//                                                 className="btn btn-secondary btn-sm"
//                                                 onClick={cancelEditing}
//                                             >
//                                                 Cancel
//                                             </button>
//                                         </>
//                                     ) : (
//                                         <>


//                                             <button
//                                                 onClick={() => navigate(`/edit-post/${post.id}`, { state: { post } })}
//                                             >
//                                                 Edit
//                                             </button>
//                                             <button
//                                                 className="btn btn-danger btn-sm"
//                                                 onClick={() => deletePost(post.id)}
//                                             >
//                                                 Delete
//                                             </button>
//                                         </>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// }

// export default MyAccount;







// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// function MyAccount() {
//   const [user, setUser] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [likesMap, setLikesMap] = useState({});       // { postId: likeCount }
//   const [helpfulsMap, setHelpfulsMap] = useState({}); // { postId: helpfulCount }
//   const [commentsMap, setCommentsMap] = useState({}); // { postId: commentCount }
//   const [bookmarkedPostIds, setBookmarkedPostIds] = useState(new Set()); // Set for quick lookup
//   const [showingBookmarks, setShowingBookmarks] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null); // for showing full post from bookmarks
//   const token = localStorage.getItem("token");

//   // Fetch user info and posts on mount
//   useEffect(() => {
//     if (!token) return;

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
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

//   // Fetch likes, helpfuls, comments and bookmarks after posts or user change
//   useEffect(() => {
//     if (!user || userPosts.length === 0) return;

//     const fetchLikes = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/likes");
//         // Count likes per post
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
//         // We'll get comments count per post by fetching comments for each post (can be optimized in backend)
//         const map = {};
//         await Promise.all(
//           userPosts.map(async (post) => {
//             const res = await axios.get(
//               `http://localhost:5000/api/comments/${post.id}`
//             );
//             map[post.id] = res.data.length;
//           })
//         );
//         setCommentsMap(map);
//       } catch {
//         toast.error("Failed to fetch comments");
//       }
//     };

//     const fetchBookmarks = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/bookmarks?userId=${user.id}`
//         );
//         // Store bookmarked post IDs in a Set for quick lookup
//         const bookmarkedIds = new Set(res.data.map((bm) => bm.post_id));
//         setBookmarkedPostIds(bookmarkedIds);
//       } catch {
//         toast.error("Failed to fetch bookmarks");
//       }
//     };

//     fetchLikes();
//     fetchHelpfuls();
//     fetchCommentsCount();
//     fetchBookmarks();
//   }, [user, userPosts]);

//   // Calculate total comments and average engagement
//   const totalComments = Object.values(commentsMap).reduce(
//     (acc, val) => acc + val,
//     0
//   );

//   const totalLikes = Object.values(likesMap).reduce((acc, val) => acc + val, 0);
//   const totalHelpfuls = Object.values(helpfulsMap).reduce(
//     (acc, val) => acc + val,
//     0
//   );

//   const averageEngagement =
//     userPosts.length > 0
//       ? (totalLikes + totalHelpfuls) / userPosts.length
//       : 0;

//   // Filtered posts based on bookmarks toggle
//   const displayedPosts = showingBookmarks
//     ? userPosts.filter((post) => bookmarkedPostIds.has(post.id))
//     : userPosts;

//   return (
//     <div className="container py-4">
//       <h2>My Account</h2>

//       {user && (
//         <div className="card p-3 shadow-sm mb-4">
//           <p>
//             <strong>Name:</strong> {user.name}
//           </p>
//           <p>
//             <strong>Email:</strong> {user.email}
//           </p>
//         </div>
//       )}

//       {/* Stat Boxes */}
//       <div className="d-flex gap-3 mb-4">
//         <div
//           className="p-3 border rounded shadow-sm text-center flex-fill"
//           style={{ cursor: "pointer" }}
//           onClick={() => {
//             setShowingBookmarks(false);
//             setSelectedPost(null);
//           }}
//         >
//           <h4>{userPosts.length}</h4>
//           <p>Total Posts</p>
//         </div>

//         <div
//           className="p-3 border rounded shadow-sm text-center flex-fill"
//           style={{ cursor: "pointer" }}
//           onClick={() => {
//             setShowingBookmarks(false);
//             setSelectedPost(null);
//           }}
//         >
//           <h4>{averageEngagement.toFixed(2)}</h4>
//           <p>Average Engagement</p>
//         </div>

//         <div
//           className="p-3 border rounded shadow-sm text-center flex-fill"
//           style={{ cursor: "pointer" }}
//           onClick={() => {
//             setShowingBookmarks(false);
//             setSelectedPost(null);
//           }}
//         >
//           <h4>{totalComments}</h4>
//           <p>Total Comments</p>
//         </div>

//         <div
//           className="p-3 border rounded shadow-sm text-center flex-fill bg-warning"
//           style={{ cursor: "pointer" }}
//           onClick={() => {
//             setShowingBookmarks(true);
//             setSelectedPost(null);
//           }}
//         >
//           <h4>{bookmarkedPostIds.size}</h4>
//           <p>Bookmarked Posts</p>
//         </div>
//       </div>

//       {/* Posts List */}
//       <h3>{showingBookmarks ? "Bookmarked Posts" : "Your Trip Posts"}</h3>

//       {displayedPosts.length === 0 && (
//         <p>{showingBookmarks ? "No bookmarked posts." : "You have no posts."}</p>
//       )}

//       {showingBookmarks ? (
//         // Show bookmarked posts titles only
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
//         // Show full posts with edit/delete when not showing bookmarks
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th style={{ width: "200px" }}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedPosts.map((post) => (
//               <tr key={post.id}>
//                 <td>{post.title}</td>
//                 <td>
//                   {/* Add your edit/delete buttons here */}
//                   <button
//                     className="btn btn-primary btn-sm me-2"
//                     onClick={() =>
//                       alert("Edit feature not implemented in this snippet")
//                     }
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => alert("Delete feature not implemented")}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Selected bookmarked post details */}
//       {showingBookmarks && selectedPost && (
//         <div className="card p-3 shadow-sm mt-4">
//           <h4>{selectedPost.title}</h4>
//           <p>{selectedPost.experience}</p>
//           <p>
//             <strong>Location:</strong> {selectedPost.location_name}
//           </p>
//           <p>
//             <strong>Budget:</strong> ₹{selectedPost.budget}
//           </p>
//           {/* Add more details as needed */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default MyAccount;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// function MyAccount() {
//   const [user, setUser] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [likesMap, setLikesMap] = useState({});       // { postId: likeCount }
//   const [helpfulsMap, setHelpfulsMap] = useState({}); // { postId: helpfulCount }
//   const [commentsMap, setCommentsMap] = useState({}); // { postId: commentCount }
//   const [bookmarkedPostIds, setBookmarkedPostIds] = useState(new Set()); // Set for quick lookup
//   const [showingBookmarks, setShowingBookmarks] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null); // for showing full post from bookmarks
//   const token = localStorage.getItem("token");

//   // Fetch user info and posts on mount
//   useEffect(() => {
//     if (!token) return;

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
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

//   // Fetch likes, helpfuls, comments and bookmarks after posts or user change
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
//             const res = await axios.get(
//               `http://localhost:5000/api/comments/${post.id}`
//             );
//             map[post.id] = res.data.length;
//           })
//         );
//         setCommentsMap(map);
//       } catch {
//         toast.error("Failed to fetch comments");
//       }
//     };

//     const fetchBookmarks = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/bookmarks?userId=${user.id}`
//         );
//         const bookmarkedIds = new Set(res.data.map((bm) => bm.post_id));
//         setBookmarkedPostIds(bookmarkedIds);
//       } catch {
//         toast.error("Failed to fetch bookmarks");
//       }
//     };

//     fetchLikes();
//     fetchHelpfuls();
//     fetchCommentsCount();
//     fetchBookmarks();
//   }, [user, userPosts]);

//   // Calculate total comments and average engagement
//   const totalComments = Object.values(commentsMap).reduce(
//     (acc, val) => acc + val,
//     0
//   );

//   const totalLikes = Object.values(likesMap).reduce((acc, val) => acc + val, 0);
//   const totalHelpfuls = Object.values(helpfulsMap).reduce(
//     (acc, val) => acc + val,
//     0
//   );

//   const averageEngagement =
//     userPosts.length > 0
//       ? (totalLikes + totalHelpfuls) / userPosts.length
//       : 0;

//   // Filtered posts based on bookmarks toggle
//   const displayedPosts = showingBookmarks
//     ? userPosts.filter((post) => bookmarkedPostIds.has(post.id))
//     : userPosts;

//   return (
//     <div className="container py-4">
//       <h2>My Account</h2>

//       {user && (
//         <div className="card p-3 shadow-sm mb-4">
//           <p>
//             <strong>Name:</strong> {user.name}
//           </p>
//           <p>
//             <strong>Email:</strong> {user.email}
//           </p>
//         </div>
//       )}

//       {/* Stat Boxes */}
//       <div className="d-flex gap-3 mb-4">
//         <div
//           className="p-3 border rounded shadow-sm text-center flex-fill"
//           style={{ cursor: "pointer" }}
//           onClick={() => {
//             setShowingBookmarks(false);
//             setSelectedPost(null);
//           }}
//         >
//           <h4>{userPosts.length}</h4>
//           <p>Total Posts</p>
//         </div>

//         <div
//           className="p-3 border rounded shadow-sm text-center flex-fill"
//           style={{ cursor: "pointer" }}
//           onClick={() => {
//             setShowingBookmarks(false);
//             setSelectedPost(null);
//           }}
//         >
//           <h4>{averageEngagement.toFixed(2)}</h4>
//           <p>Average Engagement</p>
//         </div>

//         <div
//           className="p-3 border rounded shadow-sm text-center flex-fill"
//           style={{ cursor: "pointer" }}
//           onClick={() => {
//             setShowingBookmarks(false);
//             setSelectedPost(null);
//           }}
//         >
//           <h4>{totalComments}</h4>
//           <p>Total Comments</p>
//         </div>

//         <div
//           className="p-3 border rounded shadow-sm text-center flex-fill bg-warning"
//           style={{ cursor: "pointer" }}
//           onClick={() => {
//             setShowingBookmarks(true);
//             setSelectedPost(null);
//           }}
//         >
//           <h4>{bookmarkedPostIds.size}</h4>
//           <p>Bookmarked Posts</p>
//         </div>
//       </div>

//       {/* Posts List */}
//       <h3>{showingBookmarks ? "Bookmarked Posts" : "Your Trip Posts"}</h3>

//       {displayedPosts.length === 0 && (
//         <p>{showingBookmarks ? "No bookmarked posts." : "You have no posts."}</p>
//       )}

//       {showingBookmarks ? (
//         // Show bookmarked posts titles only
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
//         // Show full posts with enhanced table including date and engagement metrics
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>Date Created</th>
//               <th>Title</th>
//               <th>Likes</th>
//               <th>Helpful Votes</th>
//               <th>Comments</th>
//               <th style={{ width: "200px" }}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedPosts.map((post) => (
//               <tr key={post.id}>
//                 <td>{new Date(post.created_at).toLocaleDateString()}</td>
//                 <td>{post.title}</td>
//                 <td>{likesMap[post.id] || 0}</td>
//                 <td>{helpfulsMap[post.id] || 0}</td>
//                 <td>{commentsMap[post.id] || 0}</td>
//                 <td>
//                   <button
//                     className="btn btn-primary btn-sm me-2"
//                     onClick={() =>
//                       alert("Edit feature not implemented in this snippet")
//                     }
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => alert("Delete feature not implemented")}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Selected bookmarked post details */}
//       {showingBookmarks && selectedPost && (
//         <div className="card p-3 shadow-sm mt-4">
//           <h4>{selectedPost.title}</h4>
//           <p>{selectedPost.experience}</p>
//           <p>
//             <strong>Location:</strong> {selectedPost.location_name}
//           </p>
//           <p>
//             <strong>Budget:</strong> ₹{selectedPost.budget}
//           </p>
//           {/* Add more details as needed */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default MyAccount;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MyAccount() {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [likesMap, setLikesMap] = useState({});
  const [helpfulsMap, setHelpfulsMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState(new Set());
  const [showingBookmarks, setShowingBookmarks] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPost, setEditedPost] = useState({ title: '', experience: '', budget: '', location: '' });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
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
        const bookmarkedIds = new Set(res.data.map((bm) => bm.post_id));
        setBookmarkedPostIds(bookmarkedIds);
      } catch {
        toast.error("Failed to fetch bookmarks");
      }
    };

    fetchLikes();
    fetchHelpfuls();
    fetchCommentsCount();
    fetchBookmarks();
  }, [user, userPosts]);

  const totalComments = Object.values(commentsMap).reduce((acc, val) => acc + val, 0);
  const totalLikes = Object.values(likesMap).reduce((acc, val) => acc + val, 0);
  const totalHelpfuls = Object.values(helpfulsMap).reduce((acc, val) => acc + val, 0);
  const averageEngagement = userPosts.length > 0 ? (totalLikes + totalHelpfuls) / userPosts.length : 0;

  const displayedPosts = showingBookmarks
    ? userPosts.filter((post) => bookmarkedPostIds.has(post.id))
    : userPosts;

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

      {user && (
        <div className="card p-3 shadow-sm mb-4">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

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
          <h4>{bookmarkedPostIds.size}</h4><p>Bookmarked Posts</p>
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
                    <>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/edit-post/${post.id}`, { state: { post } })}
                      >
                        Edit
                      </button>

                      <button className="btn btn-danger btn-sm" onClick={() => deletePost(post.id)}>Delete</button>
                    </>
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
