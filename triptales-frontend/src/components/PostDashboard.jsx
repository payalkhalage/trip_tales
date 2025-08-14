import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import profileIcon from '../assets/img.jpg';
import './PostDashboard.css';

function PostDashboard() {
  const [posts, setPosts] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [helpfuls, setHelpfuls] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState({}); // track comments toggle per post
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
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

  // Select a suggestion
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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Failed to fetch current user', err);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    axios.get('/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Fetch posts error:', err));
  }, []);

  useEffect(() => {
    posts.forEach(post => fetchComments(post.id));
    if (currentUser) {
      fetchLikes();
      fetchBookmarks();
      fetchHelpfuls();
    }
  }, [posts, currentUser]);

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`/api/comments/${postId}`);
      setComments(prev => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error('Fetch comments error:', err);
    }
  };

  const fetchLikes = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get('/api/likes');
      const likeMap = {};
      res.data.forEach(like => {
        if (!likeMap[like.post_id]) likeMap[like.post_id] = { count: 0, liked: false };
        likeMap[like.post_id].count += 1;
        if (like.user_id === currentUser.id) likeMap[like.post_id].liked = true;
      });
      setLikes(likeMap);
    } catch (err) {
      console.error('Fetch likes error:', err);
    }
  };

  const fetchBookmarks = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get('/api/bookmarks', { params: { userId: currentUser.id } });
      const bookmarkMap = {};
      res.data.forEach(bm => {
        bookmarkMap[bm.post_id] = true;
      });
      setBookmarks(bookmarkMap);
    } catch (err) {
      console.error('Fetch bookmarks error:', err);
    }
  };

  const fetchHelpfuls = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get('/api/helpfuls');
      const helpfulMap = {};
      res.data.forEach(helpful => {
        if (!helpfulMap[helpful.post_id]) helpfulMap[helpful.post_id] = { count: 0, marked: false };
        helpfulMap[helpful.post_id].count += 1;
        if (helpful.user_id === currentUser.id) helpfulMap[helpful.post_id].marked = true;
      });
      setHelpfuls(helpfulMap);
    } catch (err) {
      console.error('Fetch helpful marks error:', err);
    }
  };

  const handleGenerateSummary = async (postId) => {
    try {
      const res = await axios.post(`/api/summary/${postId}/generate`);
      toast.success('Summary generated!');
      await navigator.clipboard.writeText(res.data.link);
      setSummaries(prev => ({
        ...prev,
        [postId]: res.data.link,
      }));
    } catch (err) {
      console.error('Summary generation failed', err);
      toast.error('Could not generate summary');
    }
  };

  const handleAddComment = async (postId) => {
    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }
    const text = newComment[postId];
    if (!text?.trim()) return;

    try {
      await axios.post('/api/comments', {
        postId,
        userId: currentUser.id,
        commentText: text,
      });
      fetchComments(postId);
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      // Ensure comments stay visible after adding one
      setCommentsVisible(prev => ({ ...prev, [postId]: true }));
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleLike = async (postId) => {
    if (!currentUser) {
      toast.error('Please login to like');
      return;
    }
    try {
      await axios.post('/api/likes/toggle', {
        postId,
        userId: currentUser.id,
      });
      fetchLikes();
    } catch {
      toast.error('Like/unlike failed');
    }
  };

  const handleToggleBookmark = async (postId) => {
    if (!currentUser) {
      toast.error('Please login to bookmark');
      return;
    }
    try {
      await axios.post('/api/bookmarks/toggle', {
        postId,
        userId: currentUser.id,
      });
      fetchBookmarks();
    } catch {
      toast.error('Bookmark toggle failed');
    }
  };

  const handleToggleHelpful = async (postId) => {
    if (!currentUser) {
      toast.error('Please login to mark helpful');
      return;
    }
    try {
      await axios.post('/api/helpfuls/toggle', {
        postId,
        userId: currentUser.id,
      });
      fetchHelpfuls();
    } catch {
      toast.error('Helpful toggle failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  const handleViewProfile = () => {
    setDropdownOpen(false);
    navigate('/myaccount');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleCommentsVisibility = (postId) => {
    setCommentsVisible(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="post-dashboard-container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Trip-Tales</h2>
        <div className="d-flex align-items-center gap-3">
          <button
  className="btn btn-orange"
  onClick={() => navigate('/create-trip')}
>
  + Create Trip
</button>


          <div className="position-relative">
            <img
              src={profileIcon}
              alt="Profile"
              className="rounded-circle"
              width="40"
              height="40"
              onClick={toggleDropdown}
              style={{ cursor: 'pointer' }}
            />
            {dropdownOpen && (
              <div
                className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm"
                style={{ minWidth: '200px', zIndex: 1050 }}
              >
                {currentUser ? (
                  <>
                    <div className="p-3 border-bottom">
                      <strong>{currentUser.name}</strong>
                      <br />
                      <small>{currentUser.email}</small>
                    </div>
                    <div
                      className="p-3 hover-bg-light"
                      onClick={handleViewProfile}
                      style={{ cursor: 'pointer' }}
                    >
                      👤 View Profile
                    </div>
                    <div
                      className="p-3 border-top hover-bg-light"
                      onClick={handleLogout}
                      style={{ cursor: 'pointer' }}
                    >
                      🚪 Logout
                    </div>
                  </>
                ) : (
                  <div className="p-3">Loading...</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      





      {/* 🔍 Search Bar */}
      <div className="mb-4 relative">
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow-md max-h-48 overflow-y-auto">
            {suggestions.map((sug, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(sug)}
              >
                {sug}
              </li>
            ))}
          </ul>
        )}
      </div>



        <div className="mb-4 flex gap-4">
        {/* Location Filter */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="form-select"
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Budget Filter */}
        <select
          value={selectedBudget}
          onChange={(e) => setSelectedBudget(e.target.value)}
          className="form-select"
        >
          <option value="">All Budgets</option>
          <option value="5000">Up to ₹5,000</option>
          <option value="10000">Up to ₹10,000</option>
          <option value="20000">Up to ₹20,000</option>
          <option value="50000">Up to ₹50,000</option>
        </select>
      </div>
      {/* Posts */}
      <div className="row gy-4">
       {filteredPosts.map((post) => (
          <div className="col-md-6" key={post.id}>
            <div className="card shadow-sm h-100 d-flex flex-column">
              {post.images.length > 0 && (
                <div className="image-gallery">
                  <img
                    src={`http://localhost:5000${post.images[0]}`}
                    className="card-img-top"
                    alt="Post"
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text mb-1"><strong>Location:</strong> {post.location_name}</p>
                <p className="card-text text-muted mb-2">
                  {post.experience?.slice(0, 100)}...
                </p>

                <div className="mb-2">
                  <span className="me-3"><strong>Budget:</strong> ₹{post.budget}</span>
                  <span className="me-3"><strong>Duration:</strong> {post.duration_days} days</span>
                  <span><strong>Season:</strong> {post.best_season}</span>
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
                    👍 {likes[post.id]?.count || 0}{' '}
                    {likes[post.id]?.liked ? '(You liked)' : ''}
                  </button>

                  <button
                    className={`btn btn-sm ${bookmarks[post.id] ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => handleToggleBookmark(post.id)}
                  >
                    {bookmarks[post.id] ? '🔖 Bookmarked' : '🔖 Bookmark'}
                  </button>

                  <button
                    className={`btn btn-sm ${helpfuls[post.id]?.marked ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => handleToggleHelpful(post.id)}
                  >
                    👍 Helpful {helpfuls[post.id]?.count || 0}
                  </button>

                  <button
                    className="btn btn-sm btn-outline-secondary ms-auto"
                    onClick={() => toggleCommentsVisibility(post.id)}
                  >
                    {commentsVisible[post.id] ? 'Hide Comments' : 'Show Comments'}
                  </button>
                </div>

                {/* Comments Section */}
                {commentsVisible[post.id] && (
                  <div
                    className="comments-section"
                    style={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Add a comment..."
                      value={newComment[post.id] || ''}
                      onChange={(e) =>
                        setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))
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
        ))}
      </div>
    </div>
  );
}

export default PostDashboard;

