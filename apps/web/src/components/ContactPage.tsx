import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Globe } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import type { ThemeMode } from '../types';
import './ContactPage.css';

interface ContactPageProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ themeMode, setThemeMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you shortly.');
    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="bg-glow top-glow" />
      <div className="bg-glow bottom-glow" />

      <PublicHeader themeMode={themeMode} setThemeMode={setThemeMode} />

      <section className="contact-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content centered"
          >
            <h1 className="hero-title">Get in <span className="text-gradient">Touch</span></h1>
            <p className="hero-subtitle">Have questions about VGuard? Our team is here to help you secure your premises.</p>
          </motion.div>
        </div>
      </section>

      <section className="contact-content-section">
        <div className="container">
          <div className="contact-grid">
            
            {/* Contact Form */}
            <div className="contact-form-container">
              <div className="form-card">
                <h2>Send us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+234 ..." 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Subject</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      >
                        <option>General Inquiry</option>
                        <option>Sales & Pricing</option>
                        <option>Technical Support</option>
                        <option>Partnership</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea 
                      rows={5} 
                      placeholder="How can we help you?" 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-premium submit-btn">
                    Send Message <Send className="icon-xs" />
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="contact-info-container">
              <div className="info-card">
                <h3>Contact Information</h3>
                <p>Reach out to us through any of these channels.</p>
                
                <div className="info-items">
                  <div className="info-item">
                    <div className="info-icon"><Mail className="icon-sm" /></div>
                    <div className="info-text">
                      <strong>Email Us</strong>
                      <span>support@vguard.com</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon"><Phone className="icon-sm" /></div>
                    <div className="info-text">
                      <strong>Call Us</strong>
                      <span>+234 800 VGUARD</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon"><MapPin className="icon-sm" /></div>
                    <div className="info-text">
                      <strong>Our Office</strong>
                      <span>123 Security Avenue, Lagos, Nigeria</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon"><Globe className="icon-sm" /></div>
                    <div className="info-text">
                      <strong>Follow Us</strong>
                      <div className="mini-socials">
                        <a href="#">TW</a>
                        <a href="#">LI</a>
                        <a href="#">FB</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="support-badge">
                  <ShieldCheck className="icon-sm" />
                  <span>24/7 Priority Support for Business Plans</span>
                </div>
              </div>

              {/* Chat Card */}
              <div className="chat-card">
                <MessageSquare className="icon-md" />
                <div>
                  <h4>Live Chat</h4>
                  <p>Typical response time: 5 minutes</p>
                </div>
                <button className="btn-glass-sm" onClick={() => alert('Live chat is starting... Connecting you with an agent.')}>Start Chat</button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default ContactPage;
