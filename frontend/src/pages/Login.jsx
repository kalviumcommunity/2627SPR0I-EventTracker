import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <main className="app-page form-page">
      <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to EventSync</Link>
      <section className="form-card">
        <span className="eyebrow">GOOD TO HAVE YOU BACK</span>
        <h1>Welcome back.</h1>
        <p>Log in to pick up where your crew left off.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@campus.edu" required />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
          <button className="button button-primary form-submit" type="submit">Log in <span aria-hidden="true">→</span></button>
        </form>
        <p className="form-hint">New to EventSync? <Link to="/register">Join the crew</Link></p>
        <p className="demo-note">Sign-in is a front-end demo; connect an authentication service to enable accounts.</p>
      </section>
    </main>
  )
}

export default Login