import { Route, Routes } from 'react-router-dom'
import './App.css'
import CreatePost from './components/CreatePost'
import PostDashboard from './components/PostDashboard'
import SummaryPage from './components/SummaryPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Register'
import Login from './components/Login'
import MyAccount from './components/MyAccount'


function App() {

  return (
    <>
      <Routes>
     <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/postdashboard" element={<PostDashboard />} />
        <Route path="/create-trip" element={<CreatePost />} />
        <Route path="/summary/:id" element={<SummaryPage />} />
         <Route path="/myaccount" element={<MyAccount />} />
         <Route path="/edit-post/:id" element={<CreatePost />} />

    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
