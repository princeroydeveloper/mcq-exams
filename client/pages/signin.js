import { useState } from 'react'
import Head from "next/head"
import { useAuth } from "../contexts/AuthContext"
import { useGlobal } from '../contexts/GlobalContext'
import PublicRoute from '../components/PublicRoute'
import { Card, CardContent, Container, TextField, Button, Slide } from '@mui/material'
import { Flaky } from '@mui/icons-material'
import TakeMe from '../components/TakeMe'

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
        <Slide direction='down' in={true}>
          <Container className='my-5' style={{ maxWidth: '400px' }}>
            <Card className='p-4'>
              <CardContent component='form' autoComplete='off' onSubmit={e => {
                e.preventDefault()
                signIn(email, password)
              }}>
                <h3 className='text-center mb-2'>Sign In - MCQ Exams</h3>
                <center>
                  <small className='text-muted text-center'>The best exam environment for students & teachers</small>
                </center>
                <center className='mb-5 mt-4'>
                  <Flaky style={{ fontSize: '60px', color: '#001b94' }} />
                </center>
                <TextField variant='outlined' fullWidth label='Email' className='mb-4' value={email} onChange={e => setEmail(e.target.value)} />
                <TextField variant='outlined' type='password' fullWidth label='Password' className='mb-2' value={password} onChange={e => setPassword(e.target.value)} />
                <p className='float-end bold underline cursor-pointer' onClick={() => forgotPassword(email)}>Forgot Password?</p><br /><br /><br /><br />
                <TakeMe path='/signup'>
                  <Button className='float-start' variant='text' disabled={btnDisabled}>Create Account</Button>
                </TakeMe>
                <Button className='float-end' variant='contained' disabled={btnDisabled} type='submit'>Continue</Button>
              </CardContent>
            </Card>
          </Container>
        </Slide>
      </PublicRoute>
    </>
  )
}

export default SignIn