import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'

const STATUSES = ['Pending', 'In Progress', 'Completed']
const PRIORITIES = ['Low', 'Medium', 'High']

function todayString() {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

function AddDuty() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const [board, setBoard] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedVolunteerId, setAssignedVolunteerId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('Pending')
  const [priority, setPriority] = useState('Medium')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    api.get(`/boards/${boardId}`)
      .then(({ board: data, currentUserRole }) => {
        if (active) setBoard({ ...data, currentUserRole })
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || 'Unable to load this board.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [boardId])

  const volunteers = board?.members.filter((member) => member.role === 'volunteer') ?? []

  async function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !description.trim() || !assignedVolunteerId || !dueDate) {
      setError('Complete all required fields before creating the duty.')
      return
    }

    try {
      setError('')
      setSaving(true)
      await api.post(`/duties/boards/${boardId}`, {
        title: title.trim(),
        description: description.trim(),
        assignedVolunteerId,
        dueDate,
        status,
        priority,
      })
      navigate(`/boards/${boardId}`, { state: { notice: 'Duty created successfully.' } })
    } catch (submitError) {
      setError(submitError.message || 'Could not create this duty.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <main className="app-page"><p className="empty-note">Loading board members...</p></main>
  }

  if (!board) {
    return (
      <main className="app-page not-found">
        <span className="eyebrow">UNABLE TO ADD DUTY</span>
        <h1>{error || 'This board could not be found.'}</h1>
        <Link className="button button-primary" to="/dashboard">Back to events</Link>
      </main>
    )
  }

  if (board.currentUserRole !== 'organiser') {
    return (
      <main className="app-page not-found">
        <span className="eyebrow">ORGANISER ACCESS ONLY</span>
        <h1>Only this board's organiser can add a duty.</h1>
        <Link className="button button-primary" to={`/boards/${boardId}`}>Back to board</Link>
      </main>
    )
  }

  return (
    <main className="app-page form-page">
      <Link className="back-link" to={`/boards/${boardId}`}>
        <ArrowLeft size={16} /> Back to {board.name}
      </Link>

      <section className="form-card duty-form-card">
        <span className="eyebrow">PUT YOUR CREW IN MOTION</span>
        <h1>Add a duty</h1>
        <p>Give a volunteer a clear task, deadline, and priority.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="duty-title">Duty title</label>
          <input id="duty-title" maxLength="120" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Prepare volunteer check-in" required />

          <label htmlFor="duty-description">Description</label>
          <textarea id="duty-description" rows="4" maxLength="3000" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add the details this volunteer will need..." required />

          <label htmlFor="duty-volunteer">Assigned volunteer</label>
          <select id="duty-volunteer" value={assignedVolunteerId} onChange={(event) => setAssignedVolunteerId(event.target.value)} required>
            <option value="">Select a board volunteer</option>
            {volunteers.map((member) => (
              <option value={member.id} key={member.id}>{member.name} ({member.email})</option>
            ))}
          </select>
          {volunteers.length === 0 && <p className="form-hint">Invite volunteers to this board before assigning duties.</p>}

          <label htmlFor="duty-due-date">Due date</label>
          <input id="duty-due-date" type="date" min={todayString()} value={dueDate} onChange={(event) => setDueDate(event.target.value)} required />

          <div className="duty-form-grid">
            <div>
              <label htmlFor="duty-status">Status</label>
              <select id="duty-status" value={status} onChange={(event) => setStatus(event.target.value)}>
                {STATUSES.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="duty-priority">Priority</label>
              <select id="duty-priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
                {PRIORITIES.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="duty-form-actions">
            <Link className="button button-secondary" to={`/boards/${boardId}`}>Cancel</Link>
            <button className="button button-primary" type="submit" disabled={saving || volunteers.length === 0}>
              {saving ? 'Creating duty...' : 'Create duty'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default AddDuty
