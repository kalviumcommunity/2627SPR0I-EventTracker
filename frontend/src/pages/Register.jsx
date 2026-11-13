import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/useAuth'

function Register() {
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
        throw new Error(data.message || 'Registration failed.')
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
        <span className="eyebrow">MAKE ROOM FOR GOOD THINGS</span>
        <h1>Join the crew.</h1>
        <p>Create an account and start getting your next event in sync.</p>

        <div className="form-submit">
          <GoogleLogin
            text="signup_with"
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-up failed. Please try again.')}
          />
        </div>

        {loading && <p>Creating your account...</p>}
        {error && <p className="demo-note">{error}</p>}

        <p className="form-hint">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
