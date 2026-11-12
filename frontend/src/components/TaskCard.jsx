import { ArrowUpRight, Check, Circle, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'

function TaskCard({ task, onToggle }) {
  const complete = task.status === 'done'

  return (
    <article className={`task-row ${complete ? 'task-row-done' : ''}`}>
      <button
        className="task-check"
        type="button"
        onClick={() => onToggle?.(task.id)}
        aria-label={complete ? `Reopen ${task.title}` : `Complete ${task.title}`}
      >
        {complete ? <Check size={16} /> : <Circle size={16} />}
      </button>
      <Link className="task-title" to={`/tasks/${task.id}`}>
        <span>{task.title}</span>
        <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
      <span className="task-assignee">{task.assignee}</span>
      <span className="task-due"><Clock3 size={14} /> {task.due}</span>
      <span className={`status-pill status-${task.status.replace(' ', '-')}`}>{task.status}</span>
    </article>
  )
}

export default TaskCard