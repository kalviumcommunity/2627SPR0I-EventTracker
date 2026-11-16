
import { ArrowLeft, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function JoinBoard() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    const inviteCode = code.trim().toUpperCase()

    if (!inviteCode) {
      setError('Please enter an invitation code.')
      return
    }

    try {
      setError('')
      setSubmitting(true)

      const response = await api.post('/boards/join', { inviteCode })

      navigate(`/boards/${response.boardId}`)
    } catch (err) {
      console.error('Unable to join board:', err)
      setError(err.message || 'Unable to join this board. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="app-page form-page">
      <Link className="back-link" to="/dashboard">
        <ArrowLeft size={16} /> Back to events
      </Link>

      <section className="form-card">
        <span className="eyebrow">YOUR CREW IS WAITING</span>
        <h1>Join an event board</h1>
        <p>Enter the invite code your event organiser shared with you.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="invite-code">Invite code</label>

          <div className="input-with-icon">
            <KeyRound size={17} />
            <input
              id="invite-code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value)
                setError('')
              }}
              placeholder="e.g. 9D4A74"
              required
              disabled={submitting}
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
            disabled={submitting}
          >
            {submitting ? 'Joining board...' : 'Find my board'}
            {!submitting && <span aria-hidden="true"> →</span>}
          </button>
        </form>

        <p className="form-hint">
          Ask your event organiser for the board's invitation code.
        </p>
      </section>
    </main>
  )
}

export default JoinBoard
