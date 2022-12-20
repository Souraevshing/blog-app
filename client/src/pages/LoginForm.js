import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const loginUser = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password)
      navigate('/articles')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <h1>LOG IN</h1>
      {error && <p className='error'>{error}</p>}
      <input
        placeholder='Email address'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={loginUser}>Log In</button>
      <Link to='/create-account'>Don't have an account? Create Account</Link>
    </>
  )
}

export default LoginForm
