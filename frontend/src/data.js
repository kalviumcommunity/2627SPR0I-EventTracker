const STORAGE_KEY = 'eventsync-boards'

export const initialBoards = [
  {
    id: 'spring-fest',
    name: 'Spring Fest 2025',
    date: 'May 18, 2025',
    location: 'Main campus',
    code: 'SPRING25',
    tasks: 12,
    completed: 8,
    color: 'lime',
  },
  {
    id: 'welcome-week',
    name: 'Welcome Week',
    date: 'August 24, 2025',
    location: 'Student center',
    code: 'WELCOME',
    tasks: 8,
    completed: 3,
    color: 'lavender',
  },
]

export function getBoards() {
  try {
    const storedBoards = localStorage.getItem(STORAGE_KEY)
    return storedBoards ? JSON.parse(storedBoards) : initialBoards
  } catch (error) {
    console.error('Unable to load event boards from local storage.', error)
    return initialBoards
  }
}

export function saveBoards(boards) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards))
    return true
  } catch (error) {
    console.error('Unable to save event boards to local storage.', error)
    return false
  }
}

export const sampleTasks = [
  { id: 'stage-setup', title: 'Set up the main stage', assignee: 'Alex Morgan', due: 'May 16', status: 'done' },
  { id: 'volunteer-checkin', title: 'Prepare volunteer check-in', assignee: 'Jamie Lee', due: 'May 17', status: 'in progress' },
  { id: 'welcome-signs', title: 'Place welcome signs around campus', assignee: 'You', due: 'May 18', status: 'to do' },
  { id: 'sound-check', title: 'Complete sound check', assignee: 'Riley Chen', due: 'May 18', status: 'to do' },
]
