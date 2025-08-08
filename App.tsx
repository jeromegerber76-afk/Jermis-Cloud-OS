// src/App.tsx - Mit eigenem Logo
import { useState } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess('Anmeldung erfolgreich! Willkommen zurück.')
        localStorage.setItem('authToken', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        console.log('User:', data.data.user)
      } else {
        if (data.message.includes('Invalid email or password')) {
          setError('Falsche E-Mail oder Passwort. Bitte überprüfen Sie Ihre Eingaben.')
        } else if (data.message.includes('Too many')) {
          setError('Zu viele Anmeldeversuche. Bitte warten Sie einen Moment.')
        } else if (data.message.includes('User not found')) {
          setError('Benutzer nicht gefunden.')
        } else if (data.message.includes('Account locked')) {
          setError('Konto gesperrt. Kontaktieren Sie den Administrator.')
        } else {
          setError('Anmeldung fehlgeschlagen. Versuchen Sie es erneut.')
        }
      }

    } catch (err) {
      console.error('Login error:', err)
      setError('Keine Verbindung zum Server. Prüfen Sie Ihre Internetverbindung.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="login-card">
        {/* Logo Bereich */}
        <div className="logo-section">
          <div className="logo-container">
            {/* Hier kannst du dein Logo einfügen */}
            <img 
              src="/logo.png" 
              alt="JERMIS Logo" 
              className="logo-image"
              onError={(e) => {
                // Falls Logo nicht gefunden wird, zeige Fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling!.classList.remove('hidden');
              }}
            />
            {/* Fallback wenn Logo nicht da ist */}
            <div className="logo-fallback hidden">
              <span className="logo-text">JERMIS</span>
            </div>
          </div>
          <h1 className="system-title">CloudOS.Jermis</h1>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">E-Mail Adresse</label>
            <input
              type="email"
              className="form-input"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Passwort</label>
            <input
              type="password"
              className="form-input"
              placeholder="Passwort eingeben"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <div className="footer">
          <p>CloudOS.Jermis v1.0.0</p>
          <p>Powered by JERMIS GmbH</p>
        </div>
      </div>
    </div>
  )
}

export default App