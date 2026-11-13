
import { ArrowUpRight, CalendarDays, MapPin, Plus, Users } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getBoards } from '../data'
import { useAuth } from '../context/useAuth'

function Dashboard() {
  const { user, loading } = useAuth()
  const { userId } = useParams()

  if (loading) {
    return <main className="app-page">Loading your dashboard...</main>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (userId !== user.id) {
    return <Navigate to={`/dashboard/${user.id}`} replace />
  }

  const boards = getBoards()
  const totalTasks = boards.reduce((total, board) => total + board.tasks, 0)
  const completedTasks = boards.reduce((total, board) => total + board.completed, 0)

  return (
    <main className="app-page dashboard-page">

      {/* User Profile */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px',
          marginBottom: '28px',
          border: '2px solid #223141',
          borderRadius: '14px',
          background: '#fffdf5',
        }}
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            referrerPolicy="no-referrer"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ffda3d',
              display: 'grid',
              placeItems: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#223141',
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <span className="eyebrow">YOUR ACCOUNT</span>
          <h2 style={{ margin: '4px 0' }}>{user.name}</h2>
          <p style={{ margin: '0 0 4px' }}>{user.email}</p>
          <small>
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </small>
        </div>
      </section>

      {/* Existing Dashboard UI */}
      <div className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">YOUR EVENT WORKSPACE</span>
          <h1>Good things happen when we work together.</h1>
          <p>All your event plans, people, and progress — in one place.</p>
        </div>

        <Link className="button button-primary" to="/boards/new">
          <Plus size={18} /> Create a board
        </Link>
      </div>

      <section className="stats-grid" aria-label="Workspace overview">
        <article className="stat-card">
          <span>ACTIVE BOARDS</span>
          <strong>{boards.length.toString().padStart(2, '0')}</strong>
          <small>Events in your workspace</small>
        </article>

        <article className="stat-card">
          <span>TASKS COMPLETED</span>
          <strong>
            {completedTasks}
            <small> / {totalTasks}</small>
          </strong>
          <small>Keep the momentum going</small>
        </article>

        <article className="stat-card">
          <span>YOUR CREW</span>
          <strong>12</strong>
          <small>Volunteers across your events</small>
        </article>
      </section>

      <div className="section-heading">
        <div>
          <span className="eyebrow">THE BIG PICTURE</span>
          <h2>Your event boards</h2>
        </div>

        <Link className="text-link" to="/boards/join">
          Join a board <ArrowUpRight size={16} />
        </Link>
      </div>

      <section className="board-grid" aria-label="Event boards">
        {boards.map((board) => (
          <Link
            className="board-card"
            to={`/boards/${board.id}`}
            key={board.id}
          >
            <div className={`board-card-art board-card-art-${board.color}`}>
              <CalendarDays size={28} />
              <span>EVENT BOARD</span>
            </div>

            <div className="board-card-content">
              <div className="board-title-row">
                <h3>{board.name}</h3>
                <ArrowUpRight size={18} />
              </div>

              <p><CalendarDays size={15} /> {board.date}</p>
              <p><MapPin size={15} /> {board.location}</p>

              <div className="board-progress-meta">
                <span><Users size={15} /> 6 volunteers</span>
                <span>{board.completed} / {board.tasks} tasks</span>
              </div>

              <div className="progress-track">
                <span
                  style={{
                    width: `${board.tasks
                      ? Math.min(100, Math.round((board.completed / board.tasks) * 100))
                      : 0}%`,
                  }}
                />
              </div>
            </div>
          </Link>
        ))}

        <Link className="board-create-card" to="/boards/new">
          <span><Plus size={24} /></span>
          <strong>Start a new event</strong>
          <small>Make a plan. Bring your people.</small>
        </Link>
      </section>

      <p className="demo-note">
        Your boards are saved in this browser for this demo.
      </p>
    </main>
  )
}

export default Dashboard
