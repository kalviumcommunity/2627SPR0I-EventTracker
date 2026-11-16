import { ArrowLeft, CalendarDays, Copy, MapPin, Plus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import { api } from '../services/api'

function BoardDetails() {
  const { boardId } = useParams()
  const location = useLocation()
  const [board, setBoard] = useState(null)
  const [duties, setDuties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState(location.state?.notice || '')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true

    async function fetchBoard() {
      try {
        setLoading(true)
        setError('')
        const [boardResponse, dutiesResponse] = await Promise.all([
          api.get(`/boards/${boardId}`),
          api.get(`/duties/boards/${boardId}`),
        ])
        if (active) {
          setBoard({ ...boardResponse.board, currentUserRole: boardResponse.currentUserRole })
          setDuties(dutiesResponse.duties)
        }
      } catch (fetchError) {
        console.error('Unable to fetch board details:', fetchError)
        if (active) setError(fetchError.message || 'Unable to load this event board.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchBoard()
    return () => { active = false }
  }, [boardId])

  async function copyCode() {
    if (!board?.inviteCode) return

    try {
      await navigator.clipboard.writeText(board.inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (copyError) {
      console.error('Unable to copy the invite code.', copyError)
    }
  }

  async function deleteDuty(dutyId) {
    if (!window.confirm('Delete this duty? This action cannot be undone.')) return

    try {
      setActionError('')
      await api.delete(`/duties/${dutyId}`)
      setDuties((current) => current.filter((duty) => duty.id !== dutyId))
      setNotice('Duty deleted successfully.')
    } catch (deleteError) {
      setActionError(deleteError.message || 'Could not delete this duty.')
    }
  }

  if (loading) {
    return <main className="app-page"><p className="empty-note">Loading your event board...</p></main>
  }

  if (error || !board) {
    return (
      <main className="app-page not-found">
        <span className="eyebrow">UNABLE TO OPEN BOARD</span>
        <h1>{error || 'Looks like this event went missing.'}</h1>
        <Link className="button button-primary" to="/dashboard">Back to events</Link>
      </main>
    )
  }

  const volunteerCount = board.members.filter((member) => member.role === 'volunteer').length
  const formattedDate = board.date
    ? new Date(board.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Date to be announced'

  return (
    <main className="app-page board-details-page">
      <Link className="back-link" to="/dashboard"><ArrowLeft size={16} /> All events</Link>

      {notice && <p className="success-note" role="status">{notice}</p>}

      <section className="board-overview">
        <div className="board-hero-mark board-hero-mark-lime"><CalendarDays size={34} /></div>
        <div className="board-overview-copy">
          <span className="eyebrow">EVENT DUTY BOARD</span>
          <h1>{board.name}</h1>
          <div className="board-meta">
            <span><CalendarDays size={15} /> {formattedDate}</span>
            <span><MapPin size={15} /> {board.location || 'Location to be announced'}</span>
            <span><Users size={15} /> {volunteerCount} volunteers</span>
          </div>
        </div>

        {board.inviteCode && (
          <button className="invite-code" type="button" onClick={copyCode}>
            <span>INVITE CODE</span>
            <strong>{copied ? 'COPIED!' : board.inviteCode}</strong>
            <Copy size={15} aria-hidden="true" />
          </button>
        )}
      </section>

      <section className="task-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EVERY LITTLE THING COUNTS</span>
            <h2>Event duties <span className="count-badge">{duties.length}</span></h2>
          </div>
          {board.currentUserRole === 'organiser' && (
            <Link className="button button-primary" to={`/boards/${boardId}/duties/new`}>
              <Plus size={18} /> Add a duty
            </Link>
          )}
        </div>

        {actionError && <p className="form-error" role="alert">{actionError}</p>}

        {duties.length > 0 && (
          <div className="task-table">
            <div className="task-table-head">
              <span>DUTY</span>
              <span>ASSIGNED TO</span>
              <span>DUE DATE</span>
              <span>STATUS</span>
              <span>PRIORITY</span>
              <span>ACTIONS</span>
            </div>
            {duties.map((duty) => <TaskCard task={duty} key={duty.id} onDelete={deleteDuty} />)}
          </div>
        )}

        {duties.length === 0 && (
          <p className="empty-note">
            No duties yet. {board.currentUserRole === 'organiser' ? 'Add the first one and get your crew moving.' : 'The organiser has not added any duties yet.'}
          </p>
        )}
      </section>
    </main>
  )
}

export default BoardDetails
