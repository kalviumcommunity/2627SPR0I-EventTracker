
import { ArrowUpRight, CalendarDays, MapPin, Plus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { api } from '../services/api'

function Dashboard() {
  const { user, loading } = useAuth()
  const { userId } = useParams()

  const [boards, setBoards] = useState([])
  const [boardsLoading, setBoardsLoading] = useState(true)
  const [boardsError, setBoardsError] = useState('')

  useEffect(() => {
    if (!user) return

    async function fetchBoards() {
      try {
        setBoardsLoading(true)
        setBoardsError('')

        const response = await api.get('/boards/my-boards')
        setBoards(response.boards || [])
      } catch (error) {
        console.error('Unable to fetch your boards:', error)
        setBoardsError(error.message || 'Unable to load your boards.')
      } finally {
        setBoardsLoading(false)
      }
    }

    fetchBoards()
  }, [user])

  if (loading) {
    return <main className="app-page">Loading your dashboard...</main>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (userId !== user.id) {
    return <Navigate to={`/dashboard/${user.id}`} replace />
  }

  const organisedBoards = boards.filter(
    (board) => board.role === 'organiser'
  ).length

  const joinedBoards = boards.filter(
    (board) => board.role === 'volunteer'
  ).length

  function formatDate(date) {
    if (!date) return 'Date to be announced'

    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

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
            Joined {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : 'recently'}
          </small>
        </div>
      </section>

      {/* Dashboard Heading */}
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

      {/* Real Board Statistics */}
      <section className="stats-grid" aria-label="Workspace overview">
        <article className="stat-card">
          <span>ACTIVE BOARDS</span>
          <strong>{boards.length.toString().padStart(2, '0')}</strong>
          <small>Boards in your workspace</small>
        </article>

        <article className="stat-card">
          <span>BOARDS YOU ORGANISE</span>
          <strong>{organisedBoards.toString().padStart(2, '0')}</strong>
          <small>Events you created</small>
        </article>

        <article className="stat-card">
          <span>BOARDS YOU'VE JOINED</span>
          <strong>{joinedBoards.toString().padStart(2, '0')}</strong>
          <small>Events you're volunteering for</small>
        </article>
      </section>

      {/* Board Section Heading */}
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE BIG PICTURE</span>
          <h2>Your event boards</h2>
        </div>

        <Link className="text-link" to="/boards/join">
          Join a board <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Board Loading / Error / List */}
      {boardsLoading ? (
        <p className="empty-note">Loading your event boards...</p>
      ) : boardsError ? (
        <p className="empty-note">{boardsError}</p>
      ) : (
        <section className="board-grid" aria-label="Event boards">
          {boards.map((board) => (
            <Link
              className="board-card"
              to={`/boards/${board.id}`}
              key={board.id}
            >
              <div className="board-card-art board-card-art-lime">
                <CalendarDays size={28} />
                <span>EVENT BOARD</span>
              </div>

              <div className="board-card-content">
                <div className="board-title-row">
                  <h3>{board.name}</h3>
                  <ArrowUpRight size={18} />
                </div>

                <p>
                  <CalendarDays size={15} /> {formatDate(board.date)}
                </p>

                <p>
                  <MapPin size={15} /> {board.location || 'Location to be announced'}
                </p>

                <div className="board-progress-meta">
                  <span>
                    <Users size={15} />
                    {board.role === 'organiser' ? 'Organiser' : 'Volunteer'}
                  </span>
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
      )}

      {!boardsLoading && !boardsError && boards.length === 0 && (
        <p className="empty-note">
          You haven't created or joined any boards yet. Create a board or join
          one using an invitation code!
        </p>
      )}
    </main>
  )
}

export default Dashboard
