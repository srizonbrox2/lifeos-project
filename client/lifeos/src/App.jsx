import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navber from './components/Navber'
import Footer from './components/Footer'
import Home from './page/Home'
import Login from './page/Login'
import Register from './page/Register'
import LearnMore from './page/LearnMore'
import PlaceholderPage from './page/PlaceholderPage'
import ForgotPassword from './page/ForgotPassword'
import Dashboard from './user/Dashboard'
import Tester from './page/Tester'
function ProtectedRoute({ children }) {
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('login_status') === 'true' && Boolean(localStorage.getItem('user_id'))

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('login_status') === 'true' && Boolean(localStorage.getItem('user_id'))
  })

  async function verifyBrowserSession() {
    const token = localStorage.getItem('user_token')
    const userId = localStorage.getItem('user_id')

    if (!token || !userId) {
      localStorage.setItem('login_status', 'false')
      localStorage.removeItem('user_id')
      setIsLoggedIn(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/veryfy-browser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          running_status: true,
          token,
        }),
      })

      const data = await response.json()
      const loggedIn = Boolean(data.success && data.status)
      localStorage.setItem('login_status', String(loggedIn))
      if (!loggedIn) {
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_token')
      }
      setIsLoggedIn(loggedIn)
    } catch (error) {
      localStorage.setItem('login_status', 'false')
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_token')
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    verifyBrowserSession()
  }, [])

  function handleLoginSuccess(userId = '') {
    localStorage.setItem('login_status', 'true')
    if (userId) {
      localStorage.setItem('user_id', userId)
    }
    setIsLoggedIn(true)
  }

  function handleLogout() {
    localStorage.setItem('login_status', 'false')
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_id')
    setIsLoggedIn(false)
  }

  return (
    <div className="app-page">
      <Navber isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<PlaceholderPage title="Download" description="Download the LifeOS app and get started on your next milestone." />} />
        <Route path="/app" element={<PlaceholderPage title="App" description="Your personal dashboard will live here." />} />
        <Route path="/docs" element={<PlaceholderPage title="Docs" description="Explore guides, setup steps, and product documentation." />} />
        <Route path="/about" element={<PlaceholderPage title="About" description="Learn more about the mission behind LifeOS." />} />
        <Route path="/contact" element={<PlaceholderPage title="Contact" description="Reach out to the LifeOS team for support or feedback." />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Tester />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
