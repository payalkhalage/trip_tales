import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import profileIcon from "../assets/img.jpg";
import "./PostDashboard.css";
import { Bell } from "lucide-react";

function PostDashboard() {
  const [posts, setPosts] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [helpfuls, setHelpfuls] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Track current image index for each post
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const uniqueLocations = [...new Set(posts.map((p) => p.location_name))];

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = uniqueLocations.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  const filteredPosts = posts.filter((post) => {
    const locationMatch = post.location_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesLocation = selectedLocation
      ? post.location_name === selectedLocation
      : true;

    const matchesBudget =
      selectedBudget !== ""
        ? parseInt(post.budget) <= parseInt(selectedBudget)
        : true;

    return locationMatch && matchesLocation && matchesBudget;
  });

  // Handle image navigation
  const handleNextImage = (postId) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));
  };

  const handlePrevImage = (postId) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [postId]: Math.max((prev[postId] || 0) - 1, 0),
    }));
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    axios
      .get("/api/posts")
      .then((res) => {
        setPosts(res.data);
        // Initialize image indexes
        const indexes = {};
        res.data.forEach((post) => {
          indexes[post.id] = 0;
        });
        setCurrentImageIndex(indexes);
      })
      .catch((err) => console.error("Fetch posts error:", err));
  }, []);

  useEffect(() => {
    posts.forEach((post) => fetchComments(post.id));
    if (currentUser) {
      fetchLikes();
      fetchBookmarks();
      fetchHelpfuls();
    }
  }, [posts, currentUser]);

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`/api/comments/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  const fetchLikes = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get("/api/likes");
      const likeMap = {};
      res.data.forEach((like) => {
        if (!likeMap[like.post_id])
          likeMap[like.post_id] = { count: 0, liked: false };
        likeMap[like.post_id].count += 1;
        if (like.user_id === currentUser.id) likeMap[like.post_id].liked = true;
      });
      setLikes(likeMap);
    } catch (err) {
      console.error("Fetch likes error:", err);
    }
  };

  const fetchBookmarks = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get("/api/bookmarks", {
        params: { userId: currentUser.id },
      });
      const map = {};
      res.data.forEach((b) => {
        map[b.id] = true; // b.id should be post_id from DB
        map[b.post_id] = true; // just in case
      });
      setBookmarks(map); // set state based on server
    } catch (err) {
      console.error("Fetch bookmarks error:", err);
    }
  };

  const fetchHelpfuls = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get("/api/helpfuls");
      const helpfulMap = {};
      res.data.forEach((helpful) => {
        if (!helpfulMap[helpful.post_id])
          helpfulMap[helpful.post_id] = { count: 0, marked: false };
        helpfulMap[helpful.post_id].count += 1;
        if (helpful.user_id === currentUser.id)
          helpfulMap[helpful.post_id].marked = true;
      });
      setHelpfuls(helpfulMap);
    } catch (err) {
      console.error("Fetch helpful marks error:", err);
    }
  };

  const handleGenerateSummary = async (postId) => {
    try {
      const res = await axios.post(`/api/summary/${postId}/generate`);
      toast.success("Summary generated!");
      await navigator.clipboard.writeText(res.data.link);
      setSummaries((prev) => ({
        ...prev,
        [postId]: res.data.link,
      }));
    } catch (err) {
      console.error("Summary generation failed", err);
      toast.error("Could not generate summary");
    }
  };

  const handleAddComment = async (postId) => {
    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }
    const text = newComment[postId];
    if (!text?.trim()) return;

    try {
      await axios.post("/api/comments", {
        postId,
        userId: currentUser.id,
        commentText: text,
      });
      fetchComments(postId);
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      setCommentsVisible((prev) => ({ ...prev, [postId]: true }));
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const handleLike = async (postId) => {
    if (!currentUser) {
      toast.error("Please login to like");
      return;
    }
    try {
      await axios.post("/api/likes/toggle", {
        postId,
        userId: currentUser.id,
      });
      fetchLikes();
    } catch {
      toast.error("Like/unlike failed");
    }
  };

  const handleToggleBookmark = async (postId) => {
    if (!currentUser) return toast.error("Please login to bookmark");

    // Optimistic UI: flip state immediately
    setBookmarks((prev) => ({ ...prev, [postId]: !prev[postId] }));

    try {
      const res = await axios.post("/api/bookmarks/toggle", {
        postId,
        userId: currentUser.id,
      });

      // Sync with server in case something changed
      setBookmarks((prev) => ({ ...prev, [postId]: res.data.bookmarked }));

      // Show toast based on server response
      toast.success(
        res.data.bookmarked
          ? "Bookmarked successfully"
          : "Removed from bookmarks"
      );
    } catch (err) {
      // Rollback on error
      setBookmarks((prev) => ({ ...prev, [postId]: !prev[postId] }));
      toast.error("Bookmark toggle failed");
      console.error(err);
    }
  };

  const handleToggleHelpful = async (postId) => {
    if (!currentUser) {
      toast.error("Please login to mark helpful");
      return;
    }
    try {
      await axios.post("/api/helpfuls/toggle", {
        postId,
        userId: currentUser.id,
      });
      fetchHelpfuls();
    } catch {
      toast.error("Helpful toggle failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/");
  };

  const handleViewProfile = () => {
    setDropdownOpen(false);
    navigate("/myaccount");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleCommentsVisibility = (postId) => {
    setCommentsVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };


  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!currentUser) return;

      try {
        const res = await axios.get("http://localhost:5000/api/announcements", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // Filter out seen announcements for this user
        const key = `seenAnnouncements_${currentUser.id}`;
        const seenIds = JSON.parse(localStorage.getItem(key) || "[]");
        const unseen = res.data.filter(a => !seenIds.includes(a.id));

        setAnnouncements(unseen);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      }
    };

    fetchAnnouncements();
  }, [currentUser]);


  const handleDismissAnnouncement = async (id) => {
    try {
      // Persist per user
      const userId = currentUser.id;
      const key = `seenAnnouncements_${userId}`;

      // Save dismissed announcement for this user only
      const seenIds = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([...seenIds, id]));

      // Remove from UI
      setAnnouncements(prev => prev.filter(a => a.id !== id));

      // Optional: notify server (still include userId!)
      await axios.post(
        "http://localhost:5000/api/announcements/seen",
        { announcementId: id, userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error("Failed to dismiss announcement", err);
    }
  };



  // const handleMarkAsSeen = () => {
  //   const seenIds = JSON.parse(localStorage.getItem("seenAnnouncements") || "[]");
  //   const newSeen = [...seenIds, ...announcements.map((a) => a.id)];
  //   localStorage.setItem("seenAnnouncements", JSON.stringify(newSeen));
  //   setAnnouncements([]); // clear from UI
  //   setShowAnnouncements(false);
  // };
  return (
    <div className="post-dashboard-container py-4">
      {/* Header */}
      <div className="tt-header-container">
        <h1 className="tt-logo">TripTales</h1>
        <div className="tt-header-actions">
          {/* <div className="tt-bell-wrapper">
            <button
              className="tt-bell-btn"
              onClick={() => setShowAnnouncements(!showAnnouncements)}
            >
              🔔
              {announcements.length > 0 && (
                <span className="tt-bell-badge">{announcements.length}</span>
              )}
            </button>

            {showAnnouncements && announcements.length > 0 && (
              <div className="tt-announcement-dropdown">
                <h5>Announcements</h5>
                <ul>
                  {announcements.map((a) => (
                    <li key={a.id}>
                      <strong>{a.title}</strong>
                      <p>{a.message}</p>
                      <small>{new Date(a.date).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-sm btn-primary mt-2"
                  onClick={handleMarkAsSeen}
                >
                  Mark as Read
                </button>
              </div>
            )}
          </div> */}


          {/* <div className="announcement-bell">
            <Bell size={24} />
            {announcements.length > 0 && (
              <span className="badge">{announcements.length}</span>
            )}
          </div>

         
          <div className="announcement-list">
            {announcements.map(a => (
              <div key={a.id} className="announcement-item">
                <p>{a.message}</p>
                <button onClick={() => handleDismissAnnouncement(a.id)}>Dismiss</button>
              </div>
            ))}
          </div> */}


         <div className="announcement-bell-wrapper">
  <button
    className={`announcement-bell ${announcements.length > 0 ? "new-alert" : ""}`}
    onClick={() => setShowAnnouncements((prev) => !prev)}
  >
    <Bell size={24} className="bell-icon" />
    {announcements.length > 0 && (
      <span className="badge">{announcements.length}</span>
    )}
  </button>

  {/* Dropdown */}
  {announcements.length > 0 && (
    <div className={`announcement-dropdown ${showAnnouncements ? "active" : ""}`}>
      <div className="dropdown-arrow"></div>
      <div className="dropdown-header">Announcements</div>
      <ul className="dropdown-list">
        {announcements.map((a) => (
          <li key={a.id} className="announcement-item">
            <p>{a.message}</p>
            <small>{new Date(a.date).toLocaleString()}</small>
            <button
              className="dismiss-btn"
              onClick={() => handleDismissAnnouncement(a.id)}
            >
              Mark as read
            </button>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>


          <button
            className="tt-create-trip-btn"
            onClick={() => navigate("/create-trip")}
          >
            <span className="tt-btn-icon">+</span> Create Trip
          </button>

          <div className="tt-profile-dropdown-wrapper">
            <img
              src={profileIcon}
              alt="Profile"
              className="tt-profile-pic"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="tt-profile-dropdown-menu">
                {currentUser ? (
                  <>
                    <div className="tt-dropdown-user-info">
                      <strong className="tt-user-name">
                        {currentUser.name}
                      </strong>
                      <span className="tt-user-email">{currentUser.email}</span>
                    </div>
                    <button
                      className="tt-dropdown-item"
                      onClick={handleViewProfile}
                    >
                      <span className="tt-dropdown-icon">👤</span> View Profile
                    </button>
                    <button
                      className="tt-dropdown-item tt-logout-btn"
                      onClick={handleLogout}
                    >
                      <span className="tt-dropdown-icon">🚪</span> Logout
                    </button>
                  </>
                ) : (
                  <div className="tt-dropdown-loading">Loading...</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="tt-search-filter-section">
        {/* Search Bar with Suggestions */}
        <div className="tt-search-container">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
          {suggestions.length > 0 && (
            <ul className="tt-search-suggestions">
              {suggestions.map((sug, idx) => (
                <li
                  key={idx}
                  className="tt-suggestion-item"
                  onClick={() => handleSuggestionClick(sug)}
                >
                  {sug}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filter Controls */}
        <div className="tt-filter-controls">
          {/* Location Filter */}
          <div className="tt-filter-select-wrapper">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="tt-filter-select"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <span className="tt-select-arrow">▼</span>
          </div>

          {/* Budget Filter */}
          <div className="tt-filter-select-wrapper">
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="tt-filter-select"
            >
              <option value="">All Budgets</option>
              <option value="5000">Up to ₹5,000</option>
              <option value="10000">Up to ₹10,000</option>
              <option value="20000">Up to ₹20,000</option>
              <option value="50000">Up to ₹50,000</option>
            </select>
            <span className="tt-select-arrow">▼</span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="row gy-4">
        {filteredPosts.map((post) => {
          const currentIndex = currentImageIndex[post.id] || 0;
          const hasImages = post.images && post.images.length > 0;
          const isSingleImage = hasImages && post.images.length === 1;
          const isMultiImage = hasImages && post.images.length > 1;

          return (
            <div className="col-md-6" key={post.id}>
              <div className="card shadow-sm h-100 d-flex flex-column">
                {/* Image Gallery Section */}
                {hasImages ? (
                  <div className="image-gallery-container">
                    <img
                      src={`http://localhost:5000${post.images[currentIndex]}`}
                      className="card-img-top gallery-image"
                      alt={`Post ${currentIndex + 1}`}
                    />

                    {isMultiImage && (
                      <>
                        <button
                          className="gallery-nav prev"
                          onClick={() => handlePrevImage(post.id)}
                          disabled={currentIndex === 0}
                        >
                          &lt;
                        </button>
                        <button
                          className="gallery-nav next"
                          onClick={() => handleNextImage(post.id)}
                          disabled={currentIndex === post.images.length - 1}
                        >
                          &gt;
                        </button>
                        <div className="image-counter">
                          {currentIndex + 1} / {post.images.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="no-image-placeholder">
                    <div className="placeholder-content">
                      <i className="bi bi-image"></i>
                      <span>No images available</span>
                    </div>
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text mb-1">
                    <strong>Location:</strong> {post.location_name}
                  </p>
                  <p className="card-text text-muted mb-2">
                    {post.experience?.slice(0, 100)}...
                  </p>

                  <div className="mb-2">
                    <span className="me-3">
                      <strong>Budget:</strong> ₹{post.budget}
                    </span>
                    <span className="me-3">
                      <strong>Duration:</strong> {post.duration_days} days
                    </span>
                    <span>
                      <strong>Season:</strong> {post.best_season}
                    </span>
                  </div>

                  <button
                    className="btn btn-outline-success mb-3 align-self-start"
                    onClick={() => handleGenerateSummary(post.id)}
                  >
                    Generate Summary
                  </button>

                  {(post.generated_link || summaries[post.id]) && (
                    <a
                      href={
                        summaries[post.id] ||
                        `http://localhost:5173/summary/${post.generated_link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-link mb-3"
                    >
                      🔗 View Summary
                    </a>
                  )}

                  <div className="mb-3 d-flex flex-wrap gap-2">
                    <button
                      className={`btn btn-sm btn-outline-primary`}
                      onClick={() => handleLike(post.id)}
                    >
                      👍 {likes[post.id]?.count || 0}{" "}
                      {likes[post.id]?.liked ? "(You liked)" : ""}
                    </button>

                    <button className={`btn btn-sm ${bookmarks[post.id] ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => handleToggleBookmark(post.id)}>
                      {bookmarks[post.id] ? '🔖 Bookmarked' : '🔖 Bookmark'}
                    </button>

                    <button
                      className={`btn btn-sm ${helpfuls[post.id]?.marked
                        ? "btn-success"
                        : "btn-outline-success"
                        }`}
                      onClick={() => handleToggleHelpful(post.id)}
                    >
                      👍 Helpful {helpfuls[post.id]?.count || 0}
                    </button>

                    <button
                      className="btn btn-sm btn-outline-secondary ms-auto"
                      onClick={() => toggleCommentsVisibility(post.id)}
                    >
                      {commentsVisible[post.id]
                        ? "Hide Comments"
                        : "Show Comments"}
                    </button>
                  </div>

                  {/* Comments Section */}
                  {commentsVisible[post.id] && (
                    <div className="comments-section">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Add a comment..."
                        value={newComment[post.id] || ""}
                        onChange={(e) =>
                          setNewComment((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="btn btn-sm btn-secondary mb-3"
                        onClick={() => handleAddComment(post.id)}
                      >
                        Comment
                      </button>

                      {comments[post.id]?.length ? (
                        comments[post.id].map((c) => (
                          <div key={c.id} className="mb-2 border-bottom pb-2">
                            <strong>{c.username}</strong>: {c.comment_text}
                          </div>
                        ))
                      ) : (
                        <div className="text-muted">No comments yet.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PostDashboard;
