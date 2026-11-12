import { ArrowUpRight, CalendarDays, MapPin, Plus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getBoards } from '../data'

function Dashboard() {
  const boards = getBoards()
  const totalTasks = boards.reduce((total, board) => total + board.tasks, 0)
  const completedTasks = boards.reduce((total, board) => total + board.completed, 0)

  return (
    <main className="app-page dashboard-page">
      <div className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">YOUR EVENT WORKSPACE</span>
          <h1>Good things happen when we work together.</h1>
          <p>All your event plans, people, and progress — in one place.</p>
        </div>
        <Link className="button button-primary" to="/boards/new"><Plus size={18} /> Create a board</Link>
      </div>

      <section className="stats-grid" aria-label="Workspace overview">
        <article className="stat-card"><span>ACTIVE BOARDS</span><strong>{boards.length.toString().padStart(2, '0')}</strong><small>Events in your workspace</small></article>
        <article className="stat-card"><span>TASKS COMPLETED</span><strong>{completedTasks}<small> / {totalTasks}</small></strong><small>Keep the momentum going</small></article>
        <article className="stat-card"><span>YOUR CREW</span><strong>12</strong><small>Volunteers across your events</small></article>
      </section>

      <div className="section-heading">
        <div><span className="eyebrow">THE BIG PICTURE</span><h2>Your event boards</h2></div>
        <Link className="text-link" to="/boards/join">Join a board <ArrowUpRight size={16} /></Link>
      </div>
      <section className="board-grid" aria-label="Event boards">
        {boards.map((board) => (
          <Link className="board-card" to={`/boards/${board.id}`} key={board.id}>
            <div className={`board-card-art board-card-art-${board.color}`}><CalendarDays size={28} /><span>EVENT BOARD</span></div>
            <div className="board-card-content">
              <div className="board-title-row"><h3>{board.name}</h3><ArrowUpRight size={18} /></div>
              <p><CalendarDays size={15} /> {board.date}</p>
              <p><MapPin size={15} /> {board.location}</p>
              <div className="board-progress-meta"><span><Users size={15} /> 6 volunteers</span><span>{board.completed} / {board.tasks} tasks</span></div>
              <div className="progress-track"><span style={{ width: `${board.tasks ? Math.min(100, Math.round((board.completed / board.tasks) * 100)) : 0}%` }} /></div>
            </div>
          </Link>
        ))}
        <Link className="board-create-card" to="/boards/new"><span><Plus size={24} /></span><strong>Start a new event</strong><small>Make a plan. Bring your people.</small></Link>
      </section>
      <p className="demo-note">Your boards are saved in this browser for this demo.</p>
    </main>
  )
}

export default Dashboard