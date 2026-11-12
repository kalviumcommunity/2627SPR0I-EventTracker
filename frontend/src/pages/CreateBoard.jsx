import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBoards, saveBoards } from '../data'

function CreateBoard() {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const boardName = name.trim()
    if (!boardName) {
      setError('Give your event a name to get started.')
      return
    }

    const board = {
      id: `event-${Date.now()}`,
      name: boardName,
      date: date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date to be announced',
      location: location.trim() || 'Location to be announced',
      code: Math.random().toString(36).slice(2, 8).toUpperCase(),
      tasks: 0,
      completed: 0,
      color: 'lime',
    }
    if (!saveBoards([board, ...getBoards()])) {
      setError('Your board could not be saved in this browser. Check your storage settings and try again.')
      return
    }
    navigate(`/boards/${board.id}`)
  }

  return (
    <main className="app-page form-page">
      <Link className="back-link" to="/dashboard"><ArrowLeft size={16} /> Back to events</Link>
      <section className="form-card">
        <span className="eyebrow">A GREAT EVENT STARTS HERE</span>
        <h1>Create an event board</h1>
        <p>Get your crew on the same page. You can add duties and invite volunteers next.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="board-name">Event name</label>
          <input id="board-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Campus Spring Festival" required />
          <label htmlFor="board-date">Event date <span>OPTIONAL</span></label>
          <div className="input-with-icon"><CalendarDays size={17} /><input id="board-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div>
          <label htmlFor="board-location">Location <span>OPTIONAL</span></label>
          <div className="input-with-icon"><MapPin size={17} /><input id="board-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Student center" /></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary form-submit" type="submit">Create your board <span aria-hidden="true">→</span></button>
        </form>
      </section>
    </main>
  )
}

export default CreateBoard