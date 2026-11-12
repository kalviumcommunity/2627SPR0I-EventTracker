import { Folder, UsersRound, SquareCheckBig } from 'lucide-react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import workstationArt from './assets/eventsync-workstation.png'
import Navbar from './components/Navbar'
import BoardDetails from './pages/BoardDetails'
import CreateBoard from './pages/CreateBoard'
import Dashboard from './pages/Dashboard'
import JoinBoard from './pages/JoinBoard'
import Login from './pages/Login'
import Register from './pages/Register'
import TaskDetails from './pages/TaskDetails'
import './App.css'

function LandingPage() {
  const steps = [
    {
      number: '01 / CREATE',
      icon: 'folder',
      title: 'Create event duty boards',
      description: 'for your campus events.',
    },
    {
      number: '02 / ASSIGN',
      icon: 'team',
      title: 'Invite volunteers, assign',
      description: 'tasks, and set deadlines.',
    },
    {
      number: '03 / TRACK',
      icon: 'check',
      title: 'Monitor progress, get updates,',
      description: 'and close tasks.',
    },
  ]

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="hero-copy">
          <span className="eyebrow">EVENT OPERATIONS PLATFORM</span>
          <h1>
            Less chaos.
            <br />
            More getting
            <br />
            <span>things done.</span>
          </h1>
          <p>
            Create event boards, assign volunteer duties, track progress, and
            keep your crew in sync.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/boards/new">
              Create a Board <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-secondary" to="/dashboard">
              Explore Events
            </Link>
          </div>
        </div>
        <img
          className="workstation-art"
          src={workstationArt}
          alt="A pixel-art computer showing a checked event calendar, with a notepad and desk calendar"
        />
      </section>

      <section className="process-cards" id="how-it-works" aria-label="How it works">
        {steps.map((step) => (
          <article className="process-card" key={step.number}>
            <span className={`process-icon process-icon-${step.icon}`} aria-hidden="true">
              {step.icon === 'folder' ? <Folder size={43} /> : step.icon === 'team' ? <UsersRound size={43} /> : <SquareCheckBig size={40} />}
            </span>
            <div>
              <span className="step-label">{step.number}</span>
              <p>{step.title}</p>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="landing-bottom" id="teams">
        <p>One shared board for every event duty.</p>
        <a href="/register">Bring your crew together <span aria-hidden="true">→</span></a>
      </section>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/boards/new" element={<CreateBoard />} />
        <Route path="/boards/join" element={<JoinBoard />} />
        <Route path="/boards/:boardId" element={<BoardDetails />} />
        <Route path="/tasks/:taskId" element={<TaskDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
