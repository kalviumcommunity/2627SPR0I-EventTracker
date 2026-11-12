import { ArrowLeft, CalendarDays, Check, Circle, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { sampleTasks } from '../data'

function TaskDetails() {
  const { taskId } = useParams()
  const task = sampleTasks.find((item) => item.id === taskId)
  const [status, setStatus] = useState(task?.status ?? 'to do')
  const [showUpdate, setShowUpdate] = useState(false)
  const [updateText, setUpdateText] = useState('')
  const [updates, setUpdates] = useState([])

  if (!task) {
    return (
      <main className="app-page not-found">
        <span className="eyebrow">DUTY NOT FOUND</span>
        <h1>We can’t find that duty.</h1>
        <Link className="button button-primary" to="/dashboard">Back to events</Link>
      </main>
    )
  }

  function addUpdate(event) {
    event.preventDefault()
    const text = updateText.trim()
    if (!text) return
    setUpdates((current) => [text, ...current])
    setUpdateText('')
    setShowUpdate(false)
  }

  return (
    <main className="app-page task-details-page">
      <Link className="back-link" to="/boards/spring-fest"><ArrowLeft size={16} /> Back to Spring Fest</Link>
      <section className="task-detail-card">
        <span className="eyebrow">EVENT DUTY</span>
        <div className="task-detail-title"><h1>{task.title}</h1><span className={`status-pill status-${status.replace(' ', '-')}`}>{status}</span></div>
        <p className="task-description">A little detail goes a long way. Keep your crew in the loop with updates as this duty moves along.</p>
        <div className="task-detail-meta"><div><UserRound size={17} /><span><small>ASSIGNED TO</small><strong>{task.assignee}</strong></span></div><div><CalendarDays size={17} /><span><small>DUE DATE</small><strong>{task.due}</strong></span></div></div>
        <div className="task-detail-actions">
          <button className="button button-primary" type="button" onClick={() => setStatus((current) => current === 'done' ? 'in progress' : 'done')}>
            {status === 'done' ? <Circle size={17} /> : <Check size={17} />}
            {status === 'done' ? 'Reopen this duty' : 'Mark as complete'}
          </button>
          <button className="button button-secondary" type="button" onClick={() => setShowUpdate((shown) => !shown)}>Add an update</button>
        </div>
        {showUpdate && <form className="task-update-form" onSubmit={addUpdate}><label htmlFor="task-update">Progress update</label><textarea id="task-update" rows="3" value={updateText} onChange={(event) => setUpdateText(event.target.value)} placeholder="Share a quick update with your crew..." required /><button className="button button-dark" type="submit">Post update</button></form>}
        {updates.length > 0 && <section className="task-updates"><h2>Latest updates</h2>{updates.map((update, index) => <p key={`${index}-${update}`}>{update}</p>)}</section>}
      </section>
    </main>
  )
}

export default TaskDetails