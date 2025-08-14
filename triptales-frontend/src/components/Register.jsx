import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    name: '', email: '', username: '', password: '',
    gender: '', dob: '', country: '', role: 'user'
  });

  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', form);
      alert(res.data.message);
      navigate('/login'); // Go to login
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Register</h3>
      <form onSubmit={handleSubmit} className="col-md-6">
        <input name="name" placeholder="Name" className="form-control mb-2" onChange={handleChange} required />
        <input name="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} required />
        <input name="username" placeholder="Username" className="form-control mb-2" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="form-control mb-2" onChange={handleChange} required />
        <input name="gender" placeholder="Gender" className="form-control mb-2" onChange={handleChange} />
        <input name="dob" type="date" className="form-control mb-2" onChange={handleChange} />
        <input name="country" placeholder="Country" className="form-control mb-2" onChange={handleChange} />
        <select name="role" className="form-control mb-3" onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn btn-primary">Register</button>
              <p className="mt-3">Already have an account? <Link to="/login">Login here</Link></p>

      </form>
    </div>
  );
}

export default Register;
