import { ArrowLeft, CalendarDays, Pencil, Trash2, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'

const STATUSES = ['Pending', 'In Progress', 'Completed']
const PRIORITIES = ['Low', 'Medium', 'High']

function localDate(value) {
  return new Date(value).toISOString().slice(0, 10)
}

function todayString() {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

function TaskDetails() {
  const { taskId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const editRequested = new URLSearchParams(location.search).get('edit') === '1'
  const [duty, setDuty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedVolunteerId, setAssignedVolunteerId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [volunteers, setVolunteers] = useState([])

  useEffect(() => {
    let active = true
    api.get(`/duties/${taskId}`)
      .then(async ({ duty: data }) => {
        if (active) {
          setDuty(data)
          setTitle(data.title)
          setDescription(data.description)
          setAssignedVolunteerId(data.assignedVolunteer?.id || data.assignedVolunteer?._id || '')
          setDueDate(localDate(data.dueDate))
          setStatus(data.status)
          setPriority(data.priority)
        }
        if (active && editRequested && data.canEdit) {
          if (data.currentUserRole === 'organiser') {
            const { board } = await api.get(`/boards/${data.boardId}`)
            if (active) {
              setVolunteers(board.members.filter((member) => member.role === 'volunteer'))
            }
          }
          if (active) setEditing(true)
        }
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || 'Unable to load this duty.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [taskId, editRequested])

  async function updateStatus(nextStatus) {
    try {
      setError('')
      setSaving(true)
      const { duty: updatedDuty } = await api.put(`/duties/${taskId}`, { status: nextStatus })
      setDuty(updatedDuty)
      setStatus(updatedDuty.status)
      setNotice('Duty status updated.')
    } catch (updateError) {
      setError(updateError.message || 'Could not update duty status.')
      setStatus(duty.status)
    } finally {
      setSaving(false)
    }
  }

  async function saveDuty(event) {
    event.preventDefault()
    if (
      !description.trim() ||
      (canManage && (!title.trim() || !assignedVolunteerId || !dueDate))
    ) {
      setError('Complete all required fields before saving.')
      return
    }

    try {
      setError('')
      setSaving(true)
      const updates = canManage
        ? {
            title: title.trim(),
            description: description.trim(),
            assignedVolunteerId,
            dueDate,
            status,
            priority,
          }
        : { description: description.trim(), status }
      const { duty: updatedDuty } = await api.put(`/duties/${taskId}`, updates)
      setDuty(updatedDuty)
      setEditing(false)
      setNotice('Duty updated successfully.')
    } catch (updateError) {
      setError(updateError.message || 'Could not save this duty.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteDuty() {
    if (!window.confirm('Delete this duty? This action cannot be undone.')) return

    try {
      setError('')
      setSaving(true)
      await api.delete(`/duties/${taskId}`)
      navigate(`/boards/${duty.boardId}`, { state: { notice: 'Duty deleted.' } })
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete this duty.')
      setSaving(false)
    }
  }

  async function openEditor() {
    try {
      setError('')
      if (canManage) {
        const { board } = await api.get(`/boards/${duty.boardId}`)
        setVolunteers(board.members.filter((member) => member.role === 'volunteer'))
      }
      setEditing(true)
    } catch (loadError) {
      setError(loadError.message || 'Could not load board volunteers.')
    }
  }

  if (loading) {
    return <main className="app-page"><p className="empty-note">Loading duty details...</p></main>
  }

  if (error && !duty) {
    return (
      <main className="app-page not-found">
        <span className="eyebrow">DUTY NOT FOUND</span>
        <h1>{error}</h1>
        <Link className="button button-primary" to="/dashboard">Back to events</Link>
      </main>
    )
  }

  if (!duty) return null

  const canManage = duty.currentUserRole === 'organiser'
  const canEdit = Boolean(duty.canEdit)
  const createdDate = new Date(duty.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const dueDateLabel = new Date(`${localDate(duty.dueDate)}T12:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="app-page task-details-page">
      <Link className="back-link" to={`/boards/${duty.boardId}`}><ArrowLeft size={16} /> Back to {duty.boardName}</Link>
      <section className="task-detail-card">
        <span className="eyebrow">EVENT DUTY</span>
        <div className="task-detail-title">
          <h1>{duty.title}</h1>
          <div className="task-badges">
            <span className={`status-pill status-${duty.status.toLowerCase().replace(' ', '-')}`}>{duty.status}</span>
            <span className={`priority-pill priority-${duty.priority.toLowerCase()}`}>{duty.priority} priority</span>
          </div>
        </div>

        <p className="task-description">{duty.description}</p>

        {notice && <p className="success-note" role="status">{notice}</p>}

        <div className="task-detail-meta">
          <div className="assigned-profile">
            {duty.assignedVolunteer?.picture
              ? <img src={duty.assignedVolunteer.picture} alt="" />
              : <UserRound size={17} />}
            <span><small>ASSIGNED TO</small><strong>{duty.assignedVolunteer?.name || 'Unknown volunteer'}</strong><small>{duty.assignedVolunteer?.email}</small></span>
          </div>
          <div><CalendarDays size={17} /><span><small>DUE DATE</small><strong>{dueDateLabel}</strong></span></div>
          <div><CalendarDays size={17} /><span><small>CREATED</small><strong>{createdDate}</strong></span></div>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        {canEdit && !editing && (
          <div className="task-detail-actions">
            {canManage && (
              <label className="status-edit-control" htmlFor="task-detail-status">
                Update status
                <select id="task-detail-status" value={duty.status} disabled={saving} onChange={(event) => updateStatus(event.target.value)}>
                  {STATUSES.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            )}
            <button className="button button-secondary" type="button" onClick={openEditor}><Pencil size={16} /> Edit duty</button>
            {canManage && <button className="button button-danger" type="button" onClick={deleteDuty} disabled={saving}><Trash2 size={16} /> Delete</button>}
          </div>
        )}

        {canEdit && editing && (
          <form className="task-update-form duty-edit-form" onSubmit={saveDuty}>
            {canManage && (
              <>
                <label htmlFor="edit-duty-title">Duty title</label>
                <input id="edit-duty-title" maxLength="120" value={title} onChange={(event) => setTitle(event.target.value)} required />
              </>
            )}
            <label htmlFor="edit-duty-description">Description</label>
            <textarea id="edit-duty-description" rows="4" maxLength="3000" value={description} onChange={(event) => setDescription(event.target.value)} required />
            <label htmlFor="edit-duty-status">Status</label>
            <select id="edit-duty-status" value={status} onChange={(event) => setStatus(event.target.value)}>{STATUSES.map((option) => <option key={option}>{option}</option>)}</select>
            {canManage && (
              <>
                <label htmlFor="edit-duty-volunteer">Assigned volunteer</label>
                <select id="edit-duty-volunteer" value={assignedVolunteerId} onChange={(event) => setAssignedVolunteerId(event.target.value)} required>
                  {volunteers.map((volunteer) => <option value={volunteer.id} key={volunteer.id}>{volunteer.name} ({volunteer.email})</option>)}
                </select>
                <div className="duty-form-grid">
                  <div>
                    <label htmlFor="edit-duty-date">Due date</label>
                    <input id="edit-duty-date" type="date" min={dueDate < todayString() ? dueDate : todayString()} value={dueDate} onChange={(event) => setDueDate(event.target.value)} required />
                  </div>
                  <div>
                    <label htmlFor="edit-duty-priority">Priority</label>
                    <select id="edit-duty-priority" value={priority} onChange={(event) => setPriority(event.target.value)}>{PRIORITIES.map((option) => <option key={option}>{option}</option>)}</select>
                  </div>
                </div>
              </>
            )}
            <div className="duty-form-actions">
              <button className="button button-secondary" type="button" onClick={() => setEditing(false)}>Cancel</button>
              <button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
            </div>
          </form>
        )}
      </section>
    </main>
  )
}

export default TaskDetails
