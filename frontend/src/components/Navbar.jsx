import { CalendarCheck2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav-inner" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="EventSync home">
          <span className="brand-mark"><CalendarCheck2 size={26} strokeWidth={2.5} /></span>
          <span>EventSync</span>
        </Link>
        <div className="nav-links">
          <Link to="/dashboard">Events</Link>
          <a href="/#teams">Teams</a>
          <a href="/#how-it-works">How it works</a>
        </div>
        <div className="nav-actions">
          <Link className="nav-login" to="/login">Log in</Link>
          <Link className="button button-primary nav-join" to="/register">
            Join the crew <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar