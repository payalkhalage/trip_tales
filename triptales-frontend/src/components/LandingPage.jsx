import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiMapPin, FiCamera, FiUsers } from "react-icons/fi";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80",
    alt: "Tropical Beach",
    title: "Capture Your Adventures",
    subtitle: "Document every moment of your journey in stunning detail"
  },
  {
    img: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1470&q=80",
    alt: "Mountain View",
    title: "Explore New Horizons",
    subtitle: "Discover hidden gems and popular destinations alike"
  },
  {
    img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1470&q=80",
    alt: "City Skyline",
    title: "Share Your Story",
    subtitle: "Inspire others with your unique travel experiences"
  }
];

const features = [
  {
    icon: <FiMapPin className="feature-icon" />,
    title: "Interactive Maps",
    description: "Pin your adventures with detailed maps and location tracking"
  },
  {
    icon: <FiCamera className="feature-icon" />,
    title: "Photo Stories",
    description: "Create beautiful visual narratives of your travels"
  },
  {
    icon: <FiUsers className="feature-icon" />,
    title: "Travel Community",
    description: "Connect with fellow explorers and share tips"
  }
];

export default function LandingPage() {
  const [current, setCurrent] = useState(0);
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    const onScroll = () => {
      setNavSolid(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      clearInterval(slideInterval);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <motion.nav
        className={`navbar ${navSolid ? 'solid' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        aria-label="Primary navigation"
      >
        <div className="logo">
          <span className="logo-highlight">Trip</span>Tales
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#signup" className="cta-nav-link">
            Get Started <FiArrowRight className="arrow-icon" />
          </a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <header className="hero-section" role="banner">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="slide-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <img
              src={slides[current].img}
              alt={slides[current].alt}
              className="hero-image"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        <div className="hero-overlay" />
        
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="hero-title">{slides[current].title}</h1>
          <p className="hero-subtitle">{slides[current].subtitle}</p>
          <motion.a 
            href="#signup" 
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey <FiArrowRight className="arrow-icon" />
          </motion.a>
        </motion.div>

        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === current ? 'active' : ''}`}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section" aria-labelledby="features-title">
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

      {/* About Section */}
      <section id="about" className="about-section" aria-labelledby="about-title">
        <div className="about-container">
          <motion.div 
            className="about-image"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
          <motion.div 
            className="about-text-container"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 id="about-title" className="section-title">
              Your <span className="highlight">Travel Story</span> Matters
            </h2>
            <p className="about-text">
              TripTales is more than just a travel journal - it's a platform that transforms 
              your experiences into beautiful stories. Whether you're exploring your own city 
              or trekking across continents, we make it simple to document, organize, and 
              share your adventures with the world.
            </p>
            <ul className="about-list">
              <li>Create multimedia travel diaries</li>
              <li>Get personalized recommendations</li>
              <li>Connect with a global community</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="signup" className="signup-section" aria-labelledby="signup-title">
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
            href="/login" 
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

      <style jsx global>{`
        :root {
          --primary: #FF5722;
          --primary-light: #FF8A65;
          --primary-dark: #E64A19;
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
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: var(--text-dark);
          background-color: var(--off-white);
        }

        .landing-page {
          overflow-x: hidden;
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
        }

        .navbar.solid {
          background-color: rgba(255, 255, 255, 0.98);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          height: 70px;
        }

        .navbar.solid .logo {
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
          font-size: 2rem;
          font-weight: 800;
          color: var(--white);
          transition: var(--transition);
        }

        .logo-highlight {
          color: var(--primary);
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
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--primary);
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

        /* Hero Section */
        .hero-section {
          position: relative;
          height: 100vh;
          min-height: 700px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--white);
          text-align: center;
        }

        .slide-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, 
                        rgba(0, 0, 0, 0.2) 0%, 
                        rgba(0, 0, 0, 0.7) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          padding: 0 2rem;
          margin-top: -3rem;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          margin-bottom: 3rem;
          font-weight: 400;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-button {
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
          box-shadow: 0 10px 30px rgba(255, 87, 34, 0.4);
          transition: var(--transition);
          cursor: pointer;
        }

        .cta-button:hover {
          background-color: var(--primary);
          color: var(--white);
          box-shadow: 0 10px 30px rgba(255, 87, 34, 0.6);
        }

        .cta-button:hover .arrow-icon {
          transform: translateX(5px);
        }

        .slide-indicators {
          position: absolute;
          bottom: 3rem;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 1rem;
          z-index: 3;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: var(--transition);
          padding: 0;
        }

        .indicator.active {
          background-color: var(--white);
          transform: scale(1.2);
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

        /* Feature Card - Defined as component below */

        /* About Section */
        .about-section {
          padding: 6rem 5%;
          background-color: var(--off-white);
        }

        .about-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .about-image {
          flex: 1 1 400px;
          min-height: 400px;
          border-radius: 1rem;
          background-image: url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80');
          background-size: cover;
          background-position: center;
          box-shadow: 0 10px 30px rgba(255, 87, 34, 0.2);
        }

        .about-text-container {
          flex: 1 1 500px;
        }

        .about-text {
          margin: 1.5rem 0;
          color: var(--text-light);
          font-size: 1.1rem;
        }

        .about-list {
          list-style: none;
          margin-top: 2rem;
        }

        .about-list li {
          position: relative;
          padding-left: 2rem;
          margin-bottom: 1rem;
          color: var(--text-light);
        }

        .about-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--primary);
          font-weight: bold;
        }

        /* Signup Section */
        .signup-section {
          padding: 6rem 5%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .signup-section::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .signup-section::after {
          content: '';
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

        /* Responsive Design */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.8rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 2rem;
          }
          
          .hero-title {
            font-size: 2.2rem;
          }
          
          .section-title {
            font-size: 2.2rem;
          }
          
          .about-image {
            min-height: 300px;
          }
        }

        @media (max-width: 576px) {
          .nav-links {
            gap: 1rem;
          }
          
          .cta-nav-link {
            padding: 0.5rem 1rem;
          }
          
          .hero-title {
            font-size: 1.8rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

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
      <div className="feature-icon-container">
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      
      <style jsx>{`
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
          content: '';
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
      `}</style>
    </motion.div>
  );
};