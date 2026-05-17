import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-eventorz-navy/90 border-t border-white/5 relative z-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-purple">
              EventOrz
            </h3>
            <p className="text-eventorz-muted text-sm leading-relaxed">
              Your ultimate platform for organizing memorable events. Connect with venues,
              managers, and talented professionals all in one place.
            </p>
            <div className="flex gap-4 pt-2">
              {['FB', 'TW', 'IN', 'IG'].map((social, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-eventorz-muted hover:bg-eventorz-purple hover:text-white transition-all duration-300 font-bold text-xs">
                  {social}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Browse Venues', path: '/venues' },
                { name: 'Browse Talents', path: '/talents' },
                { name: 'Login', path: '/login' },
                { name: 'Register', path: '/register' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-eventorz-muted hover:text-eventorz-purple transition-colors duration-200 text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-eventorz-purple/50 group-hover:bg-eventorz-purple transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-eventorz-muted text-sm">
                <MapPin size={18} className="text-eventorz-purple shrink-0 mt-0.5" />
                <span>123 Innovation Drive,<br />Tech City, TC 90210</span>
              </li>
              <li className="flex items-center gap-3 text-eventorz-muted text-sm">
                <Phone size={18} className="text-eventorz-purple shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-eventorz-muted text-sm">
                <Mail size={18} className="text-eventorz-purple shrink-0" />
                <span>hello@eventorz.com</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-6">Newsletter</h4>
            <p className="text-eventorz-muted text-sm mb-4">
              Subscribe to get the latest updates and special offers.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="input-field py-2 text-sm"
              />
              <button 
                type="submit" 
                className="bg-eventorz-purple hover:bg-eventorz-violet text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-eventorz-slate text-sm">
            © {new Date().getFullYear()} EventOrz. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-eventorz-slate hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-eventorz-slate hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-eventorz-slate hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
