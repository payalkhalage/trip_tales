import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePost.css'; // You will write CSS here

function CreatePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const editingPost = location.state?.post || null;

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    latitude: '',
    longitude: '',
    experience: '',
    budget: '',
    duration: '',
    season: 'Any',
  });

  const [suggestions, setSuggestions] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const seasons = ['Any', 'Summer', 'Winter', 'Spring', 'Autumn', 'Monsoon'];

  // Prefill form if editing
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || '',
        location: editingPost.location_name || '',
        latitude: editingPost.latitude || '',
        longitude: editingPost.longitude || '',
        experience: editingPost.experience || '',
        budget: editingPost.budget || '',
        duration: editingPost.duration || '',
        season: editingPost.season || 'Any',
      });
      // If you want to preview existing images, implement that here
    }
  }, [editingPost]);

  const handleLocationSearch = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get('/api/location-search', {
        params: { q: value },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error('Location search failed', err);
      toast.error('Failed to search locations');
    }
  };

  const handleSelectLocation = (place) => {
    setFormData({
      ...formData,
      location: place.display_name,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
    });
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 10) {
      toast.warning('You can upload up to 10 images only');
      return;
    }

    const validFiles = files.filter((file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType) {
        toast.warning(`Invalid file type: ${file.name}`);
      }
      if (!isValidSize) {
        toast.warning(`File too large: ${file.name}`);
      }

      return isValidType && isValidSize;
    });

    setPhotos(validFiles);
    setPreviews(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    const newPreviews = [...previews];
    const newPhotos = [...photos];
    newPreviews.splice(index, 1);
    newPhotos.splice(index, 1);
    setPreviews(newPreviews);
    setPhotos(newPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { title, location, experience, budget } = formData;

    if (!title || !location || !experience || !budget) {
      toast.error('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to submit.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingPost) {
        // EDIT MODE
        await axios.put(`/api/posts/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Post updated successfully!');
        navigate('/myaccount');
      } else {
        // CREATE MODE
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          formDataToSend.append(key, value);
        });
        photos.forEach((photo) => {
          formDataToSend.append('images', photo);
        });

        await axios.post('/api/posts', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Post created successfully!');
        navigate('/myaccount');
      }
    } catch (error) {
      console.error('Submission error:', error);
      let errorMessage = editingPost
        ? 'Failed to update post'
        : 'Failed to create post';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <button className="back-btn" onClick={() => navigate('/postdashboard')}>
        <FaArrowLeft className="icon" />
        Back to Dashboard
      </button>

      <div className="card">
        <div className="card-header">
          <h2>{editingPost ? 'Edit Your Trip' : 'Share Your Travel Experience'}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="form">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Trip Title*</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="input"
              />
            </div>

            {/* Location */}
            <div className="form-group location-group">
              <label htmlFor="location">Location*</label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleLocationSearch}
                required
                autoComplete="off"
                className="input"
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((place, idx) => (
                    <li
                      key={idx}
                      className="suggestion-item"
                      onClick={() => handleSelectLocation(place)}
                    >
                      {place.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Budget, Duration, Season */}
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="budget">Budget (INR)*</label>
                <input
                  id="budget"
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="input"
                />
              </div>
              <div className="form-group quarter-width">
                <label htmlFor="duration">Duration (Days)</label>
                <input
                  id="duration"
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  className="input"
                />
              </div>
              <div className="form-group quarter-width">
                <label htmlFor="season">Best Season</label>
                <select
                  id="season"
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                  className="select"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Experience */}
            <div className="form-group">
              <label htmlFor="experience">Your Experience*</label>
              <textarea
                id="experience"
                rows={6}
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                minLength="50"
                className="textarea"
              />
            </div>

            {/* Photos Upload */}
            {!editingPost && (
              <div className="form-group">
                <label htmlFor="photos">Upload Photos (max 10)</label>
                <input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <div className="image-previews">
                  {previews.map((src, i) => (
                    <div key={i} className="preview-wrapper">
                      <img src={src} alt={`preview-${i}`} className="preview-image" />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeImage(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting
                ? editingPost
                  ? 'Saving...'
                  : 'Sharing...'
                : editingPost
                ? 'Update Trip'
                : 'Share Your Trip'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
