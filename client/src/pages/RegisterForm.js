import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const RegisterForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const createAccount = async () => {
    try {
      if (password !== confirmpassword) {
        setError('Passwords do not match')
        return
      }

      await createUserWithEmailAndPassword(getAuth(), email, password)

      navigate('/articles')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <h1>SIGN UP</h1>
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
      <input
        type='password'
        placeholder='Confirm Password'
        value={confirmpassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={createAccount}>Register</button>
      <Link to='/create-account'>Already have an account? Log In</Link>
    </>
  )
}

export default RegisterForm
