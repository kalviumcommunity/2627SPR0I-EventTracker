
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/useAuth'

function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { refreshUser } = useAuth()

  async function handleGoogleSuccess(response) {
    try {
      setError('')
      setLoading(true)

      if (!response.credential) {
        throw new Error('Google did not provide a credential.')
      }

      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            credential: response.credential,
          }),
        }
      )

      const data = await result.json()

      if (!result.ok) {
        throw new Error(data.message || 'Login failed.')
      }

      const user = await refreshUser()
      navigate(`/dashboard/${user.id}`)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-page form-page">
      <Link className="back-link" to="/">
        <ArrowLeft size={16} /> Back to EventSync
      </Link>

      <section className="form-card">
        <span className="eyebrow">GOOD TO HAVE YOU BACK</span>
        <h1>Welcome back.</h1>
        <p>Log in to pick up where your crew left off.</p>

        <div className="form-submit">
          <GoogleLogin
            text="continue_with"
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-in failed. Please try again.')}
          />
        </div>

        {loading && <p>Signing you in...</p>}
        {error && <p className="demo-note">{error}</p>}

        <p className="form-hint">
          New to EventSync? <Link to="/register">Join the crew</Link>
        </p>
      </section>
    </main>
  )
}

export default Login
