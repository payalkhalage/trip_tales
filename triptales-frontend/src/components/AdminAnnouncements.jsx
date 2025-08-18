// // src/components/AdminAnnouncements.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function AdminAnnouncements() {
//   const [announcements, setAnnouncements] = useState([]);
//   const [title, setTitle] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchAnnouncements();
//   }, []);

//   const fetchAnnouncements = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/announcements", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });
//       setAnnouncements(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAdd = async () => {
//     try {
//       await axios.post("http://localhost:5000/api/announcements",
//         { title, message },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setTitle("");
//       setMessage("");
//       fetchAnnouncements();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//       });
//       fetchAnnouncements();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Manage Announcements</h2>
//       <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
//       <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
//       <button onClick={handleAdd}>Add</button>

//       <h3>All Announcements</h3>
//       <ul>
//         {announcements.map((a) => {
//           const isNew = (new Date() - new Date(a.date)) / (1000 * 60 * 60) < 24; // added within 24 hrs
//           return (
//             <li key={a.id}>
//               <div className="announcement-info">
//                 <strong>{a.title}</strong>
//                 {isNew && <span className="new-badge">New</span>}
//                 - {a.message}
//                 <small> ({new Date(a.date).toLocaleString()})</small>
//               </div>
//               <button onClick={() => handleDelete(a.id)}>Delete</button>
//             </li>
//           );
//         })}
//       </ul>

//     </div>
//   );
// }

// export default AdminAnnouncements;




// src/components/AdminAnnouncements.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminAnnouncements.css"; // Make sure to import the CSS

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/announcements", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    if (!title.trim() || !message.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/api/announcements",
        { title, message },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTitle("");
      setMessage("");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-announcements-container">
      <h2>Manage Announcements</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <button onClick={handleAdd}>Add Announcement</button>

      <h3>All Announcements</h3>
      <ul>
        {announcements.map((a) => {
          const isNew =
            (new Date() - new Date(a.date)) / (1000 * 60 * 60) < 24; // within 24 hours
          return (
            <li key={a.id} className={isNew ? "new-announcement" : ""}>
              <div className="announcement-info">
                <strong>{a.title}</strong>
                {isNew && <span className="new-badge">New</span>} -{" "}
                {a.message}
                <small> ({new Date(a.date).toLocaleString()})</small>
              </div>
              <button onClick={() => handleDelete(a.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default AdminAnnouncements;
