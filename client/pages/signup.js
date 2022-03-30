import { useState } from 'react'
import Head from "next/head"
import PublicRoute from "../components/PublicRoute"
import { Container, Card, TextField, Button, CardContent, Slide, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { Flaky } from '@mui/icons-material'
import { useGlobal } from "../contexts/GlobalContext"
import TakeMe from '../components/TakeMe'
import { useAuth } from '../contexts/AuthContext'

const Signup = () => {
  const { btnDisabled } = useGlobal()
  const { signUp } = useAuth()
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Select')

  return (
    <>
      <Head>
        <title>Sign Up - MCQ Exams</title>
      </Head>
      <PublicRoute>
        <Slide direction="down" in={true}>
          <Container className='my-5' style={{ maxWidth: '400px' }}>
            <Card className='p-4'>
              <CardContent component='form' autoComplete='off' onSubmit={e => {
                e.preventDefault()
                signUp(email, password, fname, lname, role)
              }}>
                <h3 className='text-center mb-2'>Sign Up - MCQ Exams</h3>
                <center>
                  <small className='text-muted text-center'>The best exam environment for students & teachers</small>
                </center>
                <center className='mb-5 mt-4'>
                  <Flaky style={{ fontSize: '60px', color: '#001b94' }} />
                </center>
                <TextField variant='outlined' fullWidth label='First Name' className='mb-4' value={fname} onChange={e => setFname(e.target.value)} />
                <TextField variant='outlined' fullWidth label='Last Name' className='mb-4' value={lname} onChange={e => setLname(e.target.value)} />
                <TextField variant='outlined' fullWidth label='Email' className='mb-4' value={email} onChange={e => setEmail(e.target.value)} />
                <TextField variant='outlined' type='password' fullWidth label='Account Password' className='mb-4' value={password} onChange={e => setPassword(e.target.value)} />
                <FormControl fullWidth className='mb-5'>
                  <InputLabel id='select__role'>Role</InputLabel>
                  <Select labelId='select__role' label='Role' value={role} onChange={e => setRole(e.target.value)}>
                    <MenuItem value='Select'>Select</MenuItem>
                    <MenuItem value='teacher'>Teacher</MenuItem>
                    <MenuItem value='student'>Student</MenuItem>
                  </Select>
                </FormControl>
                <div>
                  <TakeMe path='/signin'>
                    <Button className='float-start' variant='text' disabled={btnDisabled}>Sign In</Button>
                  </TakeMe>
                  <Button className='float-end' variant='contained' disabled={btnDisabled} type='submit'>Continue</Button>
                </div>
              </CardContent>
            </Card>
          </Container>
        </Slide>
      </PublicRoute>
    </>
  )
}

export default Signup