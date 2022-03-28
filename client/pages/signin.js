import { useState } from 'react'
import Head from "next/head"
import { useAuth } from "../contexts/AuthContext"
import { toast } from 'react-toastify'
import { useGlobal } from '../contexts/GlobalContext'
import PublicRoute from '../components/PublicRoute'

const SignIn = () => {
  const { signIn, forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { btnDisabled } = useGlobal()

  return (
    <>
      <Head>
        <title>Sign In - Your App</title>
      </Head>
      <PublicRoute>
        <h1>Sign In - Your App</h1>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className='field' />
        <br />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="yoursecret@password" className='field' />
        <br /><br />
        <button className='button' onClick={() => {
          try {
            signIn(email, password)
          } catch (error) {
            console.error(error)
            return toast.error('An unexpected error occurred')
          }
        }} disabled={btnDisabled}>Sign In</button>
        <br />
        <button className='button' onClick={() => {
          try {
            forgotPassword(email)
          } catch (error) {
            console.error(error)
            return toast.error('An unexpected error occurred')
          }
        }} disabled={btnDisabled}>Forgot Password</button>
      </PublicRoute>
    </>
  )
}

export default SignIn