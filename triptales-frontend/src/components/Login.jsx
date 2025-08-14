import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', form);
      const { token, message, redirectTo } = res.data;

      if (token) {
        localStorage.setItem('token', token); // ✅ Store token
        alert(message);
        navigate(redirectTo); // Go to dashboard
      } else {
        alert('Login failed: Token not received');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Login</h3>
      <form onSubmit={handleSubmit} className="col-md-4">
        <input name="username" placeholder="Username" className="form-control mb-3" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="form-control mb-3" onChange={handleChange} required />
        <button className="btn btn-success" type="submit">Login</button>
      <p className="mt-3">Don't have an account? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
}

export default Login;

