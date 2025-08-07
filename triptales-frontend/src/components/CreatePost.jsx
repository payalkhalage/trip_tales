// import React, { useState } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function CreatePost() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     location: '',
//     latitude: '',
//     longitude: '',
//     experience: '',
//     budget: '',
//     duration: '',
//     season: 'Any'
//   });
//   const [suggestions, setSuggestions] = useState([]);
//   const [photos, setPhotos] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const seasons = ['Any', 'Summer', 'Winter', 'Spring', 'Autumn', 'Monsoon'];

//   const handleLocationSearch = async (e) => {
//     const value = e.target.value;
//     setFormData({ ...formData, location: value });

//     if (value.length < 3) {
//       setSuggestions([]);
//       return;
//     }

//     try {
//       const res = await axios.get('/api/location-search', {
//         params: { q: value }
//       });
//       setSuggestions(res.data);
//     } catch (err) {
//       console.error('Location search failed', err);
//       toast.error('Failed to search locations');
//     }
//   };

//   const handleSelectLocation = (place) => {
//     setFormData({
//       ...formData,
//       location: place.display_name,
//       latitude: place.lat ? parseFloat(place.lat) : null,
//       longitude: place.lon ? parseFloat(place.lon) : null
//     });
//     setSuggestions([]);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length > 10) {
//       toast.warning('You can upload up to 10 images only');
//       return;
//     }

//     const validFiles = files.filter(file => {
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//       const isValidType = validTypes.includes(file.type);
//       const isValidSize = file.size <= 5 * 1024 * 1024;

//       if (!isValidType) {
//         toast.warning(`Invalid file type: ${file.name}. Only JPG, PNG, GIF are allowed.`);
//       }
//       if (!isValidSize) {
//         toast.warning(`File too large: ${file.name}. Max 5MB allowed.`);
//       }

//       return isValidType && isValidSize;
//     });

//     setPhotos(validFiles);
//     setPreviews(validFiles.map(file => URL.createObjectURL(file)));
//   };

//   const removeImage = (index) => {
//     const newPreviews = [...previews];
//     const newPhotos = [...photos];
//     newPreviews.splice(index, 1);
//     newPhotos.splice(index, 1);
//     setPreviews(newPreviews);
//     setPhotos(newPhotos);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!formData.title || !formData.location || !formData.experience || !formData.budget) {
//       toast.error('Please fill all required fields');
//       setIsSubmitting(false);
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('You must be logged in to share a trip.');
//       setIsSubmitting(false);
//       return;
//     }

//     const formDataToSend = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       formDataToSend.append(key, value);
//     });
//     photos.forEach(photo => {
//       formDataToSend.append('images', photo);
//     });

//     try {
//       await axios.post('/api/posts', formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`, // <-- Added token here
//         },
//       });

//       toast.success('Post created successfully!');
//       navigate('/');
//     } catch (error) {
//       console.error('Submission error:', error);
//       let errorMessage = 'Failed to create post';
//       if (error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = 'No response from server';
//       }
//       toast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container py-5">
//       <div className="row justify-content-center">
//         <div className="col-lg-8">
//           <div className="card shadow">
//             <div className="card-header bg-primary text-white">
//               <h2 className="mb-0">Share Your Travel Experience</h2>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label">Trip Title*</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3 position-relative">
//                   <label className="form-label">Location*</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="location"
//                     value={formData.location}
//                     onChange={handleLocationSearch}
//                     required
//                     autoComplete="off"
//                   />
//                   {suggestions.length > 0 && (
//                     <ul className="list-group position-absolute w-100 z-3 mt-1">
//                       {suggestions.map((place, idx) => (
//                         <li
//                           key={idx}
//                           className="list-group-item list-group-item-action"
//                           onClick={() => handleSelectLocation(place)}
//                           style={{ cursor: 'pointer' }}
//                         >
//                           {place.display_name}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>

//                 <div className="row mb-3">
//                   <div className="col-md-6">
//                     <label className="form-label">Budget (INR)*</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       name="budget"
//                       value={formData.budget}
//                       onChange={handleInputChange}
//                       min="1"
//                       required
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <label className="form-label">Duration (Days)</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       name="duration"
//                       value={formData.duration}
//                       onChange={handleInputChange}
//                       min="1"
//                     />
//                   </div>
//                   <div className="col-md-3">
//                     <label className="form-label">Best Season</label>
//                     <select
//                       className="form-select"
//                       name="season"
//                       value={formData.season}
//                       onChange={handleInputChange}
//                     >
//                       {seasons.map(season => (
//                         <option key={season} value={season}>{season}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Your Experience*</label>
//                   <textarea
//                     className="form-control"
//                     rows={6}
//                     name="experience"
//                     value={formData.experience}
//                     onChange={handleInputChange}
//                     required
//                     minLength="50"
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="form-label">Upload Photos (max 10)</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     multiple
//                     accept="image/*"
//                     onChange={handleImageChange}
//                   />
//                   <div className="d-flex flex-wrap gap-2 mt-3">
//                     {previews.map((src, i) => (
//                       <div key={i} className="position-relative">
//                         <img
//                           src={src}
//                           alt={`preview-${i}`}
//                           width="120"
//                           height="90"
//                           className="rounded border object-fit-cover"
//                         />
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-danger position-absolute top-0 end-0"
//                           onClick={() => removeImage(i)}
//                           style={{ transform: 'translate(50%, -50%)' }}
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="d-grid">
//                   <button
//                     type="submit"
//                     className="btn btn-primary btn-lg"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <span
//                           className="spinner-border spinner-border-sm me-2"
//                           role="status"
//                           aria-hidden="true"
//                         ></span>
//                         Sharing...
//                       </>
//                     ) : (
//                       'Share Your Trip'
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreatePost;








import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      }

      navigate('/myaccount');
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">
                {editingPost ? 'Edit Your Trip' : 'Share Your Travel Experience'}
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-3">
                  <label className="form-label">Trip Title*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Location */}
                <div className="mb-3 position-relative">
                  <label className="form-label">Location*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleLocationSearch}
                    required
                    autoComplete="off"
                  />
                  {suggestions.length > 0 && (
                    <ul className="list-group position-absolute w-100 z-3 mt-1">
                      {suggestions.map((place, idx) => (
                        <li
                          key={idx}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleSelectLocation(place)}
                          style={{ cursor: 'pointer' }}
                        >
                          {place.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Budget, Duration, Season */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Budget (INR)*</label>
                    <input
                      type="number"
                      className="form-control"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Duration (Days)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Best Season</label>
                    <select
                      className="form-select"
                      name="season"
                      value={formData.season}
                      onChange={handleInputChange}
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
                <div className="mb-3">
                  <label className="form-label">Your Experience*</label>
                  <textarea
                    className="form-control"
                    rows={6}
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    minLength="50"
                  />
                </div>

                {/* Photos Upload */}
                {!editingPost && (
                  <div className="mb-4">
                    <label className="form-label">Upload Photos (max 10)</label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {previews.map((src, i) => (
                        <div key={i} className="position-relative">
                          <img
                            src={src}
                            alt={`preview-${i}`}
                            width="120"
                            height="90"
                            className="rounded border object-fit-cover"
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            onClick={() => removeImage(i)}
                            style={{ transform: 'translate(50%, -50%)' }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {editingPost ? 'Saving...' : 'Sharing...'}
                      </>
                    ) : editingPost ? (
                      'Update Trip'
                    ) : (
                      'Share Your Trip'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
