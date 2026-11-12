import { ArrowLeft, CalendarDays, Copy, MapPin, Plus, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import { getBoards, sampleTasks } from '../data'

function BoardDetails() {
  const { boardId } = useParams()
  const board = getBoards().find((item) => item.id === boardId)
  const [tasks, setTasks] = useState(() => (
    boardId === 'spring-fest' || boardId === 'welcome-week' ? sampleTasks : []
  ))
  const [showForm, setShowForm] = useState(false)
  const [taskName, setTaskName] = useState('')

  if (!board) {
    return (
      <main className="app-page not-found">
        <span className="eyebrow">BOARD NOT FOUND</span>
        <h1>Looks like this event went missing.</h1>
        <Link className="button button-primary" to="/dashboard">Back to events</Link>
      </main>
    )
  }

  function toggleTask(taskId) {
    setTasks((current) => current.map((task) => task.id === taskId
      ? { ...task, status: task.status === 'done' ? 'to do' : 'done' }
      : task))
  }

  function addTask(event) {
    event.preventDefault()
    const title = taskName.trim()
    if (!title) return
    setTasks((current) => [{ id: `task-${Date.now()}`, title, assignee: 'You', due: 'No due date', status: 'to do' }, ...current])
    setTaskName('')
    setShowForm(false)
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(board.code)
    } catch (error) {
      console.error('Unable to copy the invite code.', error)
    }
  }

  return (
    <main className="app-page board-details-page">
      <Link className="back-link" to="/dashboard"><ArrowLeft size={16} /> All events</Link>
      <section className="board-overview">
        <div className={`board-hero-mark board-hero-mark-${board.color}`}><CalendarDays size={34} /></div>
        <div className="board-overview-copy">
          <span className="eyebrow">EVENT DUTY BOARD</span>
          <h1>{board.name}</h1>
          <div className="board-meta"><span><CalendarDays size={15} /> {board.date}</span><span><MapPin size={15} /> {board.location}</span><span><Users size={15} /> 6 volunteers</span></div>
        </div>
        <button className="invite-code" type="button" onClick={copyCode}><span>INVITE CODE</span><strong>{board.code}</strong><Copy size={15} aria-hidden="true" /></button>
      </section>
      <section className="task-panel">
        <div className="section-heading">
          <div><span className="eyebrow">EVERY LITTLE THING COUNTS</span><h2>Event duties <span className="count-badge">{tasks.length}</span></h2></div>
          <button className="button button-primary" type="button" onClick={() => setShowForm((shown) => !shown)}><Plus size={18} /> Add a duty</button>
        </div>
        {showForm && <form className="quick-task-form" onSubmit={addTask}><input autoFocus value={taskName} onChange={(event) => setTaskName(event.target.value)} placeholder="What needs to get done?" aria-label="New duty name" required /><button className="button button-dark" type="submit">Add duty</button></form>}
        <div className="task-table">
          <div className="task-table-head"><span>DUTY</span><span>ASSIGNED TO</span><span>DUE DATE</span><span>STATUS</span></div>
          {tasks.map((task) => <TaskCard task={task} onToggle={toggleTask} key={task.id} />)}
        </div>
        {tasks.length === 0 && <p className="empty-note">No duties yet. Add the first one and get your crew moving.</p>}
      </section>
    </main>
  )
}

export default BoardDetails