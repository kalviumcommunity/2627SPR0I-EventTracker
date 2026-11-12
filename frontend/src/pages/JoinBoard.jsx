import { ArrowLeft, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBoards } from '../data'

function JoinBoard() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const board = getBoards().find((item) => item.code.toLowerCase() === code.trim().toLowerCase())
    if (!board) {
      setError('We couldn’t find a board with that invite code. Check it and try again.')
      return
    }
    navigate(`/boards/${board.id}`)
  }

  return (
    <main className="app-page form-page">
      <Link className="back-link" to="/dashboard"><ArrowLeft size={16} /> Back to events</Link>
      <section className="form-card">
        <span className="eyebrow">YOUR CREW IS WAITING</span>
        <h1>Join an event board</h1>
        <p>Enter the invite code your event organiser shared with you.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="invite-code">Invite code</label>
          <div className="input-with-icon"><KeyRound size={17} /><input id="invite-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="e.g. SPRING25" required /></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary form-submit" type="submit">Find my board <span aria-hidden="true">→</span></button>
        </form>
        <p className="form-hint">Try SPRING25 or WELCOME to explore a sample board.</p>
      </section>
    </main>
  )
}

export default JoinBoard