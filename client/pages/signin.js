import { useState } from 'react'
import Head from "next/head"
import { useAuth } from "../contexts/AuthContext"
import { useGlobal } from '../contexts/GlobalContext'
import PublicRoute from '../components/PublicRoute'
import { Card, CardContent, Container, TextField, Button } from '@mui/material'
import { Flaky } from '@mui/icons-material'

const SignIn = () => {
  const { signIn, forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { btnDisabled } = useGlobal()

  return (
    <>
      <Head>
        <title>Sign In - MCQ Exams</title>
      </Head>
      <PublicRoute>
        <Container className='my-5' style={{ maxWidth: '400px' }}>
          <Card className='p-4'>
            <CardContent component='form' autoComplete='off' onSubmit={e => {
              e.preventDefault()
              signIn(email, password)
            }}>
              <h3 className='text-center mb-2'>Sign In - MCQ Exams</h3>
              <center>
                <small className='text-muted text-center'>Create unlimited mcq papers for students</small>
              </center>
              <center className='mb-5 mt-4'>
                <Flaky style={{ fontSize: '60px', color: '#3367D5' }} />
              </center>
              <TextField variant='filled' fullWidth label='Email' className='mb-4' value={email} onChange={e => setEmail(e.target.value)} />
              <TextField variant='filled' type='password' fullWidth label='Password' className='mb-2' value={password} onChange={e => setPassword(e.target.value)} />
              <p className='float-end bold underline cursor-pointer' onClick={() => forgotPassword(email)}>Forgot Password?</p><br /><br /><br /><br />
              <Button className='float-end' variant='contained' disabled={btnDisabled} type='submit'>Continue</Button>
            </CardContent>
          </Card>
        </Container>
      </PublicRoute>
    </>
  )
}

export default SignIn