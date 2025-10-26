import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-heading">Event Organizer</h3>
            <p className="footer-description">
              Your ultimate platform for organizing memorable events. Connect with venues,
              managers, and talented professionals all in one place.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="social-icon">f</i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="social-icon">𝕏</i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="social-icon">in</i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="social-icon">📷</i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Get Started */}
          <div className="footer-section">
            <h3 className="footer-heading">Get Started</h3>
            <ul className="footer-links">
              <li><Link to="/register?role=eventOrganizer">Register as Organizer</Link></li>
              <li><Link to="/register?role=eventManager">Register as Manager</Link></li>
              <li><Link to="/register?role=talent">Register as Talent</Link></li>
              <li><a href="#venues">Browse Venues</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><a href="#blog">Blog</a></li>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            Copyright © 2025 Event Organizer. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <span className="footer-separator">•</span>
            <a href="#terms">Terms</a>
            <span className="footer-separator">•</span>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
