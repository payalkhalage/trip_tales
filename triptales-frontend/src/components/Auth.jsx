import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';

function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', username: '', password: '',
    gender: '', dob: '', country: '', role: 'user'
  });

  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const images = [img1, img2, img3, img4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        username: form.username,
        password: form.password
      });
      const { token, user, message, redirectTo } = res.data;
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        alert(message);
        navigate(redirectTo || '/');
      } else alert('Login failed: Missing token or user');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', form);
      alert(res.data.message);
      setIsRegister(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  useEffect(() => {
    setReveal(false);
    const timer = setTimeout(() => setReveal(true), 800);
    return () => clearTimeout(timer);
  }, [isRegister]);

  return (
    <div className='travel-auth-body'>
      <div className={`travel-auth-wrapper ${isRegister ? 'register-mode' : ''} ${reveal ? 'reveal-complete' : ''}`}>
        <div className="travel-forms-section">
          {/* LOGIN FORM */}
          <div className="travel-form-container travel-login-form">
            <h2>Login</h2>
            <form className="travel-auth-form" onSubmit={handleLogin}>
              <input name="username" placeholder="Username" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
              <button type="submit">Login</button>
            </form>
          </div>

          {/* REGISTER FORM */}
          <div className="travel-form-container travel-register-form">
            <h2>Register</h2>
            <form className="travel-auth-form" onSubmit={handleRegister}>
              <input name="name" placeholder="Full Name" onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
              <input name="username" placeholder="Username" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
              <select name="gender" onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input name="dob" type="date" onChange={handleChange} required />
              <input name="country" placeholder="Country" onChange={handleChange} required />
              <select name="role" onChange={handleChange}>
                <option value="user">User</option>
                {/* <option value="admin">Admin</option> */}
              </select>
              <button type="submit">Register</button>
            </form>
          </div>
        </div>

        {/* SLIDER PANEL */}
        <div className="travel-slider-panel">
          <div className="travel-slide-container" style={{ transform: `translateX(-${currentImage * 25}%)` }}>
            {images.map((img, index) => (
              <img key={index} src={img} alt="Travel" />
            ))}
          </div>

          <div className="travel-slider-content">
            {isRegister ? (
              <>
                <h2>Already have an account?</h2>
                <p>Login to continue your journey and access exclusive travel deals.</p>
                <button onClick={() => setIsRegister(false)}>Sign In</button>
              </>
            ) : (
              <>
                <h2>New to our platform?</h2>
                <p>Register now to unlock amazing travel experiences and special offers.</p>
                <button onClick={() => setIsRegister(true)}>Create Account</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;