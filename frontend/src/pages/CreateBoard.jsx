import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function CreateBoard() {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    const boardName = name.trim()

    if (!boardName) {
      setError('Give your event a name to get started.')
      return
    }

    try {
      setError('')
      setLoading(true)

      const data = await api.post('/boards/create', {
        name: boardName,
        date: date || null,
        location: location.trim(),
      })

      navigate(`/boards/${data.board.id}`)
    } catch (error) {
      setError(error.message || 'Could not create your board.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-page form-page">
      <Link className="back-link" to="/dashboard">
        <ArrowLeft size={16} /> Back to events
      </Link>

      <section className="form-card">
        <span className="eyebrow">A GREAT EVENT STARTS HERE</span>

        <h1>Create an event board</h1>

        <p>
          Get your crew on the same page. You can add duties
          and invite volunteers next.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="board-name">Event name</label>

          <input
            id="board-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Campus Spring Festival"
            required
          />

          <label htmlFor="board-date">
            Event date <span>OPTIONAL</span>
          </label>

          <div className="input-with-icon">
            <CalendarDays size={17} />

            <input
              id="board-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <label htmlFor="board-location">
            Location <span>OPTIONAL</span>
          </label>

          <div className="input-with-icon">
            <MapPin size={17} />

            <input
              id="board-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g. Student center"
            />
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="button button-primary form-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating board...' : 'Create your board'}
            {!loading && <span aria-hidden="true"> →</span>}
          </button>
        </form>
      </section>
    </main>
  )
}

export default CreateBoard
