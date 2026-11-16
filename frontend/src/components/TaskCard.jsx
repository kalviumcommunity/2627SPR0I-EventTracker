import { ArrowUpRight, Clock3, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function TaskCard({ task, onDelete }) {
  const dueDate = new Date(`${String(task.dueDate).slice(0, 10)}T12:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <article className="task-row">
      <Link className="task-title" to={`/tasks/${task.id}`}>
        <span>{task.title}</span>
        <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
      <span className="task-assignee">{task.assignedVolunteer?.name || 'Volunteer'}</span>
      <span className="task-due"><Clock3 size={14} /> {dueDate}</span>
      <span className={`status-pill status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
      <span className={`priority-pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      <div className="task-row-actions">
        {task.canEdit && (
          <Link className="task-action-link" to={`/tasks/${task.id}?edit=1`}>
            <Pencil size={14} /> Edit
          </Link>
        )}
        {task.canDelete && (
          <button className="task-action-delete" type="button" onClick={() => onDelete?.(task.id)}>
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>
    </article>
  )
}

export default TaskCard