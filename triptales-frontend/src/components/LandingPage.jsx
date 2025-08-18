import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png"; // Update path if needed
import {
  FiArrowRight,
  FiMapPin,
  FiCamera,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";


// Image data
const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
    label: "BEACH",
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
    label: "NATURE",
  },
  {
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    label: "HOTEL",
  },
  {
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    label: "MOUNTAINS",
  },
  {
    url: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    label: "TEMPLE",
  },
];

// Features data
const features = [
  {
    icon: <FiMapPin className="feature-icon" />,
    title: "Interactive Maps",
    description: "Pin your adventures with detailed maps and location tracking",
  },
  {
    icon: <FiCamera className="feature-icon" />,
    title: "Photo Stories",
    description: "Create beautiful visual narratives of your travels",
  },
  {
    icon: <FiUsers className="feature-icon" />,
    title: "Travel Community",
    description: "Connect with fellow explorers and share tips",
  },
];

// Testimonials data
// const testimonials = [
//   {
//     id: 1,
//     name: "Sarah Johnson",
//     role: "Travel Blogger",
//     content:
//       "TripTales has completely transformed how I document my journeys. The photo stories feature is my favorite - it helps me create beautiful narratives of my travels.",
//     avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//   },
//   {
//     id: 2,
//     name: "Michael Chen",
//     role: "Adventure Photographer",
//     content:
//       "As someone who travels constantly, I love how TripTales helps me organize all my experiences in one place. The interactive maps are incredibly useful!",
//     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//   },
//   {
//     id: 3,
//     name: "Emma Rodriguez",
//     role: "Digital Nomad",
//     content:
//       "The travel community on TripTales is amazing. I've connected with so many like-minded explorers and discovered hidden gems I would have never found otherwise.",
//     avatar: "https://randomuser.me/api/portraits/women/63.jpg",
//   },
//   {
//     id: 4,
//     name: "David Kim",
//     role: "Backpacker",
//     content:
//       "Simple, intuitive, and packed with features. TripTales makes travel journaling fun and effortless. Highly recommend to any traveler!",
//     avatar: "https://randomuser.me/api/portraits/men/71.jpg",
//   },
// ];

// Feature Card Component
const FeatureCard = ({ icon, title, description, index }) => {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      <div className="feature-icon-container">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  );
};

// Testimonials Carousel Component
// const TestimonialsCarousel = () => {
//   const [current, setCurrent] = useState(0);
//   const [direction, setDirection] = useState(1);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDirection(1);
//       setCurrent((prev) => (prev + 1) % testimonials.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const nextTestimonial = () => {
//     setDirection(1);
//     setCurrent((prev) => (prev + 1) % testimonials.length);
//   };

//   const prevTestimonial = () => {
//     setDirection(-1);
//     setCurrent(
//       (prev) => (prev - 1 + testimonials.length) % testimonials.length
//     );
//   };

//   return (
//     <section className="testimonials-section">
//       <div className="testimonials-heading-container">
//         <h2 className="section-title">
//           What Our <span className="highlight">Travelers Say</span>
//         </h2>
//       </div>
//       <div className="testimonials-container">
//         <button className="carousel-button prev" onClick={prevTestimonial}>
//           <FiChevronLeft />
//         </button>

//         <div className="testimonials-track">
//           <AnimatePresence mode="wait" custom={direction}>
//             <motion.div
//               key={testimonials[current].id}
//               custom={direction}
//               initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
//               transition={{ duration: 0.5 }}
//               className="testimonial-card"
//             >
//               <p className="testimonial-text">
//                 "{testimonials[current].content}"
//               </p>
//               <div className="testimonial-author">
//                 <img
//                   src={testimonials[current].avatar}
//                   alt={testimonials[current].name}
//                   className="testimonial-avatar"
//                 />
//                 <div>
//                   <h4 className="author-name">{testimonials[current].name}</h4>
//                   <p className="author-role">{testimonials[current].role}</p>
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>
//         </div>

//         <button className="carousel-button next" onClick={nextTestimonial}>
//           <FiChevronRight />
//         </button>
//       </div>

//       <div className="testimonial-indicators">
//         {testimonials.map((_, index) => (
//           <button
//             key={index}
//             className={`indicator ${index === current ? "active" : ""}`}
//             onClick={() => {
//               setDirection(index > current ? 1 : -1);
//               setCurrent(index);
//             }}
//             aria-label={`Go to testimonial ${index + 1}`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// Main Landing Page Component
const LandingPage = () => {
  const [navSolid, setNavSolid] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
   //const [aboutFeedback, setAboutFeedback] = useState(null);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    const carouselInterval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

 const savedFeedbacks = localStorage.getItem("aboutFeedbacks");
if (savedFeedbacks) {
  setFeedbacks(JSON.parse(savedFeedbacks));
}


    const onScroll = () => {
      setNavSolid(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      clearInterval(carouselInterval);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

// Move feedback carousel every 4 seconds
  useEffect(() => {
    if (feedbacks.length === 0) return;
    const interval = setInterval(() => {
      setFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [feedbacks]);

  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(carouselImages[(carouselIndex + i) % carouselImages.length]);
    }
    return visible;
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <motion.nav
        className={`navbar ${navSolid ? "solid" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        aria-label="Primary navigation"
      >
        <div className="logo">
          <div className="logo-container">
            <img src={logo} alt="TripTales Logo" className="logo-image" />
          </div>
          <span className="logo-text">
            <span className="logo-highlight">Trip</span>Tales
          </span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a href="#signup" className="cta-nav-link">
            Get Started <FiArrowRight className="arrow-icon" />
          </a>
        </div>
      </motion.nav>

      {/* Main Section */}
      <div className="main-section">
        <div className="left-text">
          <h2>
            NEVER STOP <br /> EXPLORING THE <br /> WORLD.
          </h2>
          <p>
            "Discover, share, and relive your most unforgettable journeys.
            TripTales isn't just about travel — it's about the stories that stay
            with you forever."
          </p>
          <button className="learn-btn">LEARN MORE</button>
        </div>

        <div className="carousel-cards">
          {getVisibleImages().map((item, index) => (
            <motion.div
              className="carousel-card"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <img src={item.url} alt={item.label} />
              <div className="label">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="features-section"
        aria-labelledby="features-title"
      >
        <h2 id="features-title" className="section-title">
          Why Choose <span className="highlight">TripTales</span>?
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </section>

  
       {/* About Section with Feedback Carousel */}
      {/* <section id="about" className="about-section" aria-labelledby="about-title">
        <div className="about-container">
          {feedbacks.length > 0 ? (
            <motion.div
              key={feedbackIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="about-text-carousel"
            >
              <p className="about-text">
                “{feedbacks[feedbackIndex].experience}” – <strong>{feedbacks[feedbackIndex].username}</strong>
              </p>
            </motion.div>
          ) : (
            <p className="about-text">
              TripTales is more than just a travel journal - it's a platform
              that transforms your experiences into beautiful stories. Whether
              you're exploring your own city or trekking across continents, we
              make it simple to document, organize, and share your adventures
              with the world.
            </p>
          )}
        </div>
      </section> */}

    <section id="about" className="about-section" aria-labelledby="about-title">
  <div className="about-container">
    <motion.div
      className="feedback-carousel-track"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
    >
      {/* Duplicate feedbacks for seamless scrolling */}
      {feedbacks.length > 0
        ? [...feedbacks, ...feedbacks].map((fb, i) => (
            <div key={i} className="feedback-card">
              <p className="feedback-text">{fb.experience}</p>
              <strong className="feedback-user">{fb.username}</strong>
            </div>
          ))
        : Array(2).fill(
            <div className="feedback-card">
              <p className="feedback-text">
                TripTales is more than just a travel journal - it's a platform that transforms your experiences into beautiful stories.
              </p>
            </div>
          )}
    </motion.div>
  </div>

  {/* Internal CSS */}
  <style>{`
    .about-section {
      padding: 60px 20px;
      background-color: #fff7f0;
    }
    .about-container {
      overflow: hidden;
      width: 100%;
    }
    .feedback-carousel-track {
      display: flex;
      gap: 20px;
      white-space: normal; /* allow wrapping */
    }
    .feedback-card {
      flex: 0 0 auto;       /* prevent shrinking */
      max-width: 320px;     /* optional max width */
      background-color: #ff6b35;
      color: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      font-style: italic;
      display: flex;
      flex-direction: column;
      justify-content: center;
      word-wrap: break-word; /* wrap long text */
      white-space: normal;   /* prevent clipping */
    }
    .feedback-text {
      font-size: 1rem;
      line-height: 1.4;
    }
    .feedback-user {
      margin-top: 10px;
      font-weight: 700;
      color: #ffe5d0;
      font-size: 0.95rem;
    }
    @media (max-width: 768px) {
      .feedback-card {
        min-width: 80%;
        max-width: 80%;
      }
    }
  `}</style>
</section>





      {/* CTA Section */}
      <section
        id="signup"
        className="signup-section"
        aria-labelledby="signup-title"
      >
        <motion.div
          className="signup-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 id="signup-title" className="section-title white">
            Ready to Begin Your Adventure?
          </h2>
          <p className="signup-subtitle">
            Join thousands of travelers sharing their stories on TripTales
          </p>
          <motion.a
            href="/auth"
            className="cta-button-signup"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up Now - It's Free! <FiArrowRight className="arrow-icon" />
          </motion.a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="logo">
            <span className="logo-highlight">Trip</span>Tales
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} TripTales. All rights reserved.
          </p>
        </div>
      </footer>

      {/* CSS Styles */}
      <style jsx="true">{`
        :root {
          --primary: #ff5722;
          --primary-light: #ff8a65;
          --primary-dark: #e64a19;
          --text-dark: #333;
          --text-light: #666;
          --text-lighter: #888;
          --white: #fff;
          --off-white: #f9f9f9;
          --gray: #eee;
          --dark-overlay: rgba(0, 0, 0, 0.7);
          --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          --shadow-hover: 0 8px 20px rgba(0, 0, 0, 0.15);
          --transition: all 0.3s ease;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: var(--text-dark);
          background-color: var(--off-white);
        }

        .landing-page {
          overflow-x: hidden;
          padding-top: 80px;
        }

        /* Navigation */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 5%;
          z-index: 1000;
          transition: var(--transition);
          background-color: var(--primary);
        }

        .navbar.solid {
          background-color: rgba(255, 255, 255, 0.98);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          height: 70px;
        }

        .navbar.solid .logo {
          color: var(--primary);
        }
        .navbar.solid .logo-text,
        .navbar.solid .logo-highlight {
          color: var(--primary);
        }

        .navbar.solid .nav-link {
          color: var(--text-dark);
        }

        .navbar.solid .cta-nav-link {
          color: var(--primary);
          border-color: var(--primary);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          padding: 10px 0; /* Adjust padding as needed */
        }
        .logo-image {
          height: 60px; /* Increased from 40px to 60px */
          width: auto;
          transition: all 0.3s ease;
        }

        // .navbar.solid .logo-image {
        //   filter: brightness(0) saturate(100%) invert(42%) sepia(98%) saturate(1352%) hue-rotate(350deg) brightness(99%) contrast(88%);
        //   /* This filter converts the logo to your primary orange color */
        // }

        .logo-highlight {
          color: var(--white);
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--white);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: var(--white);
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: var(--transition);
          position: relative;
        }

        .nav-link:hover {
          color: var(--primary-light);
        }

        .nav-link::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--white);
          transition: var(--transition);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .cta-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--white);
          border: 2px solid var(--white);
          border-radius: 2rem;
          padding: 0.5rem 1.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: var(--transition);
        }

        .cta-nav-link:hover {
          background-color: var(--white);
          color: var(--primary);
        }

        .arrow-icon {
          transition: var(--transition);
        }

        .cta-nav-link:hover .arrow-icon {
          transform: translateX(3px);
        }

        /* Main Section */
        .main-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6rem 5%;
          max-width: 1400px;
          margin: 0 auto;
          min-height: calc(100vh - 80px);
        }

        .left-text {
          flex: 1;
          padding-right: 3rem;
        }

        .left-text h2 {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 2rem;
          color: var(--text-dark);
        }

        .left-text p {
          font-size: 1.2rem;
          color: var(--text-light);
          margin-bottom: 2.5rem;
          font-style: italic;
        }

        .learn-btn {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 2rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 15px rgba(255, 87, 34, 0.3);
        }

        .learn-btn:hover {
          background-color: var(--primary-dark);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 87, 34, 0.4);
        }

        .carousel-cards {
          flex: 1;
          display: flex;
          gap: 1.5rem;
          perspective: 1000px;
        }

        .carousel-card {
          position: relative;
          width: 200px;
          height: 300px;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: var(--transition);
        }

        .carousel-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .carousel-card .label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: white;
          padding: 1rem;
          font-weight: 600;
          text-align: center;
        }

        /* Features Section */
        .features-section {
          padding: 6rem 5%;
          background-color: var(--white);
        }

        .section-title {
          font-size: 2.8rem;
          margin-bottom: 3rem;
          text-align: center;
          font-weight: 800;
          position: relative;
          display: inline-block;
          left: 50%;
          transform: translateX(-50%);
        }

        .section-title .highlight {
          color: var(--primary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* About Section */
//         .about-section {
//   padding: 60px 20px;
//   background-color: #fff7f0; /* soft theme color */
//   text-align: center;
// }

// .about-container {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   overflow: hidden;
//   position: relative;
//   max-width: 900px;
//   margin: 0 auto;
//   height: 180px; /* adjust as needed */
// }

// .about-text-carousel {
//   background-color: #ff6b35; /* orange theme */
//   color: #fff;
//   border-radius: 20px;
//   padding: 20px 30px;
//   margin: 0 10px;
//   box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
//   min-width: 250px;
//   max-width: 350px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   font-style: italic;
//   font-size: 1rem;
//   line-height: 1.4;
// }

// .about-text-carousel strong {
//   color: #ffe5d0; /* lighter highlight for username */
//   margin-top: 8px;
//   display: block;
//   font-weight: 700;
// }

// @media (max-width: 768px) {
//   .about-container {
//     height: auto;
//     flex-direction: column;
//   }

//   .about-text-carousel {
//     margin: 10px 0;
//     min-width: 80%;
//   }
// }

        /* Testimonials Section */
        // .testimonials-section {
        //   padding: 6rem 5%;
        //   background-color: var(--white);
        //   // text-align: center;
        // }

        // .testimonials-container {
        //   position: relative;
        //   max-width: 800px;
        //   margin: 0 auto;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   gap: 1rem;
        // }

        // .testimonials-track {
        //   width: 100%;
        //   min-height: 300px;
        //   position: relative;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        // }

        // .testimonial-card {
        //   width: 100%;
        //   max-width: 600px;
        //   background-color: var(--off-white);
        //   border-radius: 1rem;
        //   padding: 2.5rem;
        //   box-shadow: var(--shadow);
        //   margin: 0 auto;
        // }

        // .testimonial-text {
        //   font-size: 1.1rem;
        //   color: var(--text-light);
        //   margin-bottom: 2rem;
        //   font-style: italic;
        //   line-height: 1.8;
        // }

        // .testimonial-author {
        //   display: flex;
        //   align-items: center;
        //   gap: 1rem;
        //   justify-content: center;
        // }

        // .testimonial-avatar {
        //   width: 60px;
        //   height: 60px;
        //   border-radius: 50%;
        //   object-fit: cover;
        //   border: 3px solid var(--primary-light);
        // }

        // .author-name {
        //   font-size: 1.2rem;
        //   color: var(--text-dark);
        //   margin-bottom: 0.3rem;
        // }

        // .author-role {
        //   font-size: 0.9rem;
        //   color: var(--text-lighter);
        // }

        // .carousel-button {
        //   background: var(--primary);
        //   color: white;
        //   border: none;
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 50%;
        //   font-size: 1.2rem;
        //   cursor: pointer;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   transition: var(--transition);
        //   flex-shrink: 0;
        // }

        // .carousel-button:hover {
        //   background: var(--primary-dark);
        //   transform: scale(1.1);
        // }

        // .testimonial-indicators {
        //   display: flex;
        //   justify-content: center;
        //   gap: 1rem;
        //   margin-top: 2rem;
        // }

        // .testimonial-indicators .indicator {
        //   width: 12px;
        //   height: 12px;
        //   border-radius: 50%;
        //   background-color: var(--gray);
        //   border: none;
        //   cursor: pointer;
        //   transition: var(--transition);
        // }

        // .testimonial-indicators .indicator.active {
        //   background-color: var(--primary);
        //   transform: scale(1.2);
        // }

        // .testimonials-heading-container {
        //   max-width: 1200px;
        //   margin: 0 auto 3rem;
        // }

        // .testimonials-heading-container .section-title {
        //   font-size: 2.8rem;
        //   font-weight: 800;
        //   position: relative;
        //   display: inline-block;
        //   margin: 0 auto;
        // }

        // .testimonials-heading-container .section-title .highlight {
        //   color: var(--primary);
        // }

        /* Signup Section */
        .signup-section {
          padding: 6rem 5%;
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-dark)
          );
          color: var(--white);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .signup-section::before {
          content: "";
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .signup-section::after {
          content: "";
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 300px;
          height: 300px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .signup-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }

        .section-title.white {
          color: var(--white);
        }

        .signup-subtitle {
          font-size: 1.2rem;
          margin-bottom: 3rem;
          opacity: 0.9;
        }

        .cta-button-signup {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--white);
          padding: 1rem 2.5rem;
          border-radius: 2rem;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: var(--transition);
          cursor: pointer;
        }

        .cta-button-signup:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        .cta-button-signup:hover .arrow-icon {
          transform: translateX(5px);
        }

        /* Footer */
        .footer {
          padding: 3rem 5%;
          background-color: var(--text-dark);
          color: var(--white);
          text-align: center;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer .logo {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          display: inline-block;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: var(--white);
          text-decoration: none;
          opacity: 0.8;
          transition: var(--transition);
        }

        .footer-links a:hover {
          opacity: 1;
          color: var(--primary-light);
        }

        .copyright {
          opacity: 0.7;
          font-size: 0.9rem;
        }

        /* Feature Card Styles */
        .feature-card {
          background-color: var(--white);
          border-radius: 1rem;
          padding: 2.5rem 2rem;
          box-shadow: var(--shadow);
          transition: var(--transition);
          cursor: default;
          text-align: center;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .feature-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background-color: var(--primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: var(--transition);
        }

        .feature-card:hover {
          box-shadow: var(--shadow-hover);
        }

        .feature-card:hover::after {
          transform: scaleX(1);
        }

        .feature-icon-container {
          width: 70px;
          height: 70px;
          background-color: rgba(255, 87, 34, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: var(--primary);
          font-size: 2rem;
          transition: var(--transition);
        }

        .feature-card:hover .feature-icon-container {
          background-color: var(--primary);
          color: var(--white);
          transform: rotateY(180deg);
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-dark);
        }

        .feature-description {
          color: var(--text-light);
          font-size: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .main-section {
            flex-direction: column;
            text-align: center;
          }

          .left-text {
            padding-right: 0;
            margin-bottom: 3rem;
          }

          .carousel-cards {
            justify-content: center;
          }
        }

        @media (max-width: 992px) {
          .left-text h2 {
            font-size: 2.8rem;
          }

          .testimonial-card {
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 2rem;
          }

          .section-title {
            font-size: 2.2rem;
          }

          .about-image {
            min-height: 300px;
          }

          .carousel-card {
            width: 160px;
            height: 240px;
          }

          .testimonial-card {
            padding: 1.5rem;
          }

          .testimonial-text {
            font-size: 1rem;
          }

          .testimonials-container {
            gap: 0.5rem;
          }

          .carousel-button {
            width: 35px;
            height: 35px;
            font-size: 1rem;
          }
        }

        @media (max-width: 576px) {
          .nav-links {
            gap: 1rem;
          }

          .cta-nav-link {
            padding: 0.5rem 1rem;
          }

          .left-text h2 {
            font-size: 2rem;
          }

          .carousel-cards {
            flex-direction: column;
            align-items: center;
          }

          .carousel-card {
            width: 100%;
            max-width: 300px;
          }

          .testimonial-author {
            flex-direction: column;
            text-align: center;
          }

          .testimonial-card {
            padding: 1.5rem 1rem;
          }

          .testimonials-container {
            flex-direction: column;
            gap: 1rem;
          }

          .carousel-button {
            position: static;
            margin: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
