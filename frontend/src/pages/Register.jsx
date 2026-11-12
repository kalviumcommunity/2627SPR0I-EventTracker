import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
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
        <span className="eyebrow">MAKE ROOM FOR GOOD THINGS</span>
        <h1>Join the crew.</h1>
        <p>Create an account and start getting your next event in sync.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="register-name">Your name</label>
          <input id="register-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" required />
          <label htmlFor="register-email">Email address</label>
          <input id="register-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@campus.edu" required />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" required />
          <button className="button button-primary form-submit" type="submit">Create your account <span aria-hidden="true">→</span></button>
        </form>
        <p className="form-hint">Already have an account? <Link to="/login">Log in</Link></p>
        <p className="demo-note">Account creation is a front-end demo; connect an authentication service to enable accounts.</p>
      </section>
    </main>
  )
}

export default Register