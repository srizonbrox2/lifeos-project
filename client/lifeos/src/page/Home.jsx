import React, { useState, useEffect } from 'react'
import './Home.css'
import homeIcon from '../presets/icons/home_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png'
import autorenewIcon from '../presets/icons/autorenew_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png'
import settingsIcon from '../presets/icons/settings_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png'
import { Link } from 'react-router'

const Home = () => {
  const [quote, setQuote] = useState({
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
  })
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
  const [imageLoading, setImageLoading] = useState(false)

  const quotes = [
    {
      text: 'The future belongs to those who believe in the beauty of their dreams.',
      author: 'Eleanor Roosevelt',
    },
    {
      text: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
    },
    {
      text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      author: 'Winston Churchill',
    },
    {
      text: 'Believe you can and you\'re halfway there.',
      author: 'Theodore Roosevelt',
    },
    {
      text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
      author: 'Chinese Proverb',
    },
    {
      text: 'Your only limit is your soul.',
      author: 'Unknown',
    },
  ]

  // Fetch or use local motivational quote and inspirational visuals
  useEffect(() => {
    fetchQuote()
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setImageLoading(true)
    try {
      const response = await fetch('https://picsum.photos/v2/list?page=2&limit=4')
      if (response.ok) {
        const data = await response.json()
        setImageUrls(data.map((item) => `https://picsum.photos/id/${item.id}/640/640`))
      } else {
        setImageUrls([
          '',
          'https://source.unsplash.com/640x640/?wellness',
          'https://source.unsplash.com/640x640/?technology',
          'https://source.unsplash.com/640x640/?creativity',
        ])
      }
    } catch (error) {
      setImageUrls([
        '',
        'https://source.unsplash.com/640x640/?wellness',
        'https://source.unsplash.com/640x640/?technology',
        'https://source.unsplash.com/640x640/?creativity',
      ])
    }
    setImageLoading(false)
  }

  const fetchQuote = async () => {
    setLoading(true)
    try {
      // Try to fetch from API
      const response = await fetch('https://api.quotable.io/random?tags=success,motivation', {
        headers: { 'Accept': 'application/json' },
      })
      if (response.ok) {
        const data = await response.json()
        setQuote({
          text: data.content,
          author: data.author.replace(', type.fit', ''),
        })
      } else {
        // Fallback to local quotes
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
        setQuote(randomQuote)
      }
    } catch (error) {
      // Use local quotes on error
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setQuote(randomQuote)
    }
    setLoading(false)
  }

  const features = [
    {
      icon: homeIcon,
      title: 'Goal Tracking',
      description: 'Set, monitor, and achieve your goals with AI-powered insights and personalized recommendations.',
    },
    {
      icon: autorenewIcon,
      title: 'AI Assistant',
      description: 'Your personal AI mentor provides guidance, motivation, and adaptive strategies 24/7.',
    },
    {
      icon: settingsIcon,
      title: 'Progress Analytics',
      description: 'Visualize your progress with beautiful charts and detailed analytics to stay motivated.',
    },
  ]

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '95%', label: 'Success Rate' },
    { number: '24/7', label: 'AI Support' },
  ]

  return (
    <div className="home-container">
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      <div className="home-content">
        {/* Hero Section */}
        <section className="hero-container">
          <div className="hero-glow"></div>
          <h1 className="hero-title">LifeOS</h1>
          <p className="hero-subtitle">
            Transform your life with an AI-powered assistant designed to help you progress towards your goals,
            stay motivated, and unlock your full potential.
          </p>
          <div className="hero-cta">
            <Link to="/login" className='cta-button primary'>Get Sarted</Link>
            <a href="/learn-more" className="cta-button secondary">
              Learn More
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <img src={feature.icon} alt="feature icon" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="gallery-section" id="gallery">
          <h2 className="section-title">Inspiration Gallery</h2>
          <p className="gallery-copy">
            Fresh visuals to spark momentum, creativity, and focus. Images are drawn from curated online collections and styled with animated gradients.
          </p>
          <div className="gallery-grid">
            {imageUrls.map((url, index) => (
              <div key={index} className="gallery-card">
                <div className="gallery-image" style={{ backgroundImage: `url(${url})` }} />
                <div className="gallery-overlay">
                  <span>Creative Flow</span>
                </div>
              </div>
            ))}
            {imageLoading && (
              <div className="gallery-loading">
                Loading inspirational imagery...
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="testimonial-section">
          <div className="testimonial-card">
            <p className="testimonial-text">"{quote.text}"</p>
            <p className="testimonial-author">— {quote.author}</p>
            <button className="quote-button" onClick={fetchQuote}>
              {loading ? 'Loading...' : 'Get New Inspiration'}
            </button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-box">
            <h2>Ready to Transform Your Life?</h2>
            <p>
              Join thousands of users who are already achieving their goals with LifeOS. Start your journey
              today and unlock your potential with AI-powered guidance.
            </p>
            <a href="#download" className="cta-button primary">
              Start Your Journey
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
