import { CalendarCheck2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useState } from 'react'

function Navbar() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handleLogout() {
    try {
      setError('')
      await logout()
      navigate('/')
    } catch (err) {
      setError(err.message || 'Logout failed. Please try again.')
    }
  }

  return (
    <header className="site-header">
      <nav className="nav-inner" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="EventSync home">
          <span className="brand-mark">
            <CalendarCheck2 size={26} strokeWidth={2.5} />
          </span>
          <span>EventSync</span>
        </Link>

        <div className="nav-links">
          <Link to={user ? `/dashboard/${user.id}` : '/login'}>
            Events
          </Link>
          <a href="/#teams">Teams</a>
          <a href="/#how-it-works">How it works</a>
        </div>

        <div className="nav-actions">
          {!loading && (
            <>
              {user ? (
                <>
                  <span>{user.name}</span>

                  <button
                    type="button"
                    className="nav-login"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="nav-login" to="/login">
                    Log in
                  </Link>

                  <Link
                    className="button button-primary nav-join"
                    to="/register"
                  >
                    Join the crew <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>

      {error && <p className="demo-note">{error}</p>}
    </header>
  )
}

export default Navbar
