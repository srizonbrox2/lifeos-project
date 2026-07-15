import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Download', path: '/download' },
  { label: 'App', path: '/app' },
  { label: 'Docs', path: '/docs' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

function Navber({ isLoggedIn, onLogout }) {
  function handleAuthClick(event) {
    if (isLoggedIn) {
      event.preventDefault()
      onLogout?.()
    }
  }

  const renderedLinks = [...links]
  if (isLoggedIn) {
    renderedLinks.splice(3, 0, { label: 'Dashboard', path: '/dashboard' })
  }

  return (
    <header className="navbar-shell">
      <nav className="navbar" aria-label="Main navigation">
        <NavLink className="brand" to="/">
          <span className="brand-mark">✦</span>
          <span>LifeOS</span>
        </NavLink>

        <div className="nav-links">
          {renderedLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <button className="profile-btn" type="button" aria-label="Profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path d="M5 20a7 7 0 0 1 14 0" />
            </svg>
          </button>
          {isLoggedIn ? (
            <button className="login-btn" type="button" onClick={handleAuthClick}>
              Logout
            </button>
          ) : (
            <NavLink className="login-btn" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navber
