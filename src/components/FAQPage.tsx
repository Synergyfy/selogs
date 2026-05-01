import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, CircleHelp } from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import type { ThemeMode } from '../types';
import './FAQPage.css';

interface FAQPageProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-page-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <div className={`icon-circle ${isOpen ? 'open' : ''}`}>
          {isOpen ? <Minus className="icon-xs" /> : <Plus className="icon-xs" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="faq-answer"
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQPage: React.FC<FAQPageProps> = ({ themeMode, setThemeMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'technical', label: 'Technical' },
    { id: 'offline', label: 'Offline' },
    { id: 'mobile', label: 'Mobile App' }
  ];

  const faqs = {
    general: [
      { question: "What is VGuard?", answer: "VGuard is a digital vehicle entry logging system designed to replace traditional manual logbooks in hotels, estates, and corporate facilities." },
      { question: "How many users can I have?", answer: "The number of users depends on your subscription plan. Starter supports up to 5, Business up to 20, and Enterprise is unlimited." },
      { question: "Can I use VGuard on multiple devices?", answer: "Yes, you can register and use VGuard on multiple smartphones or tablets depending on your plan's device limit." }
    ],
    pricing: [
      { question: "Do you offer a free trial?", answer: "Yes, we offer a 14-day free trial of our Business plan features for all new organizations." },
      { question: "What payment methods do you accept?", answer: "We accept all major credit/debit cards, bank transfers, and USSD payments." },
      { question: "Can I cancel my subscription?", answer: "Yes, you can cancel your subscription at any time from your billing settings. You will continue to have access until the end of your billing cycle." }
    ],
    technical: [
      { question: "Does VGuard require special hardware?", answer: "No special hardware is required. VGuard works on any modern smartphone or tablet with a working camera." },
      { question: "How secure is my data?", answer: "All data is encrypted both in transit and at rest. We use enterprise-grade security to ensure your logs are safe and only accessible by authorized personnel." }
    ],
    offline: [
      { question: "Does it really work without internet?", answer: "Yes! VGuard is a Progressive Web App (PWA) that stores data locally on the device's database. Guards can capture entries without any internet connection." },
      { question: "How does the sync work?", answer: "Once the device detects an internet connection, it automatically syncs all locally stored records to our cloud servers in the background." }
    ],
    mobile: [
      { question: "Is there a mobile app in the Play Store?", answer: "VGuard is a PWA (Progressive Web App). You don't need to download it from a store; you simply 'Install' it to your home screen from your browser." },
      { question: "What mobile OS is supported?", answer: "VGuard works on both Android and iOS devices through any modern browser like Chrome, Safari, or Edge." }
    ]
  };

  return (
    <div className="faq-page">
      <div className="bg-glow top-glow" />
      <div className="bg-glow bottom-glow" />

      <PublicHeader themeMode={themeMode} setThemeMode={setThemeMode} />

      <section className="faq-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content centered"
          >
            <h1 className="hero-title">How can we <span className="text-gradient">help you?</span></h1>
            <p className="hero-subtitle">Search for answers or browse through categories to learn more about VGuard.</p>
            
            <div className="search-box-container">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search for questions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="faq-content-section">
        <div className="container">
          <div className="faq-layout">
            {/* Sidebar Tabs */}
            <div className="faq-sidebar">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={`faq-cat-btn ${activeTab === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="faq-list-main">
              <h2 className="cat-title">{categories.find(c => c.id === activeTab)?.label} Questions</h2>
              <div className="faq-items-wrapper">
                {faqs[activeTab as keyof typeof faqs].map((item, idx) => (
                  <FAQItem key={idx} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card help-cta">
            <CircleHelp className="icon-xl" />
            <h2>Still can't find what you're looking for?</h2>
            <p>Our support team is available 24/7 to answer your questions.</p>
            <button className="btn-premium" onClick={() => navigate('/contact')}>Contact Support</button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default FAQPage;
