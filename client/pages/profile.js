import Head from "next/head"
import { useState } from "react"
import PrivateRoute from "../components/PrivateRoute"
import { useAuth } from "../contexts/AuthContext"
import { useGlobal } from "../contexts/GlobalContext"
import { Button, Container, Slide, Card, CardContent, TextField, Grid } from '@mui/material'
import { Flaky } from '@mui/icons-material'
import TakeMe from "../components/TakeMe"

const Profile = () => {
  const { btnDisabled, progress } = useGlobal()
  const { currentUser } = useAuth()
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [cNewPass, setCNewPass] = useState('')

  return (
    <>
      <Head>
        <title>Profile - MCQ Exams</title>
      </Head>
      <PrivateRoute>
        <Slide direction='down' in={true}>
          <Container className='my-5' style={{ maxWidth: '450px' }}>
            <Card className='p-4' variant='outlined'>
              <CardContent component='form' autoComplete='off'>
                <h3 className='text-center mb-2'>Profile - MCQ Exams</h3>
                <center>
                  <small className='text-muted text-center'>The best exam environment for students & teachers</small>
                </center>
                <center className='mb-5 mt-4'>
                  <Flaky style={{ fontSize: '60px', color: '#001b94' }} />
                </center>
                <p className='text-center'>Name: <strong>{currentUser.fname} {currentUser.lname}</strong></p>
                <p className='text-center'>Email: <strong>{currentUser.email}</strong></p>
                <p className='text-center mb-5'>Role: <strong>{currentUser.role}</strong></p>
                <TextField size='small' fullWidth variant='outlined' type='password' label='Old Password' className='mb-4' value={oldPass} onChange={e => setOldPass(e.target.value)} />
                <TextField size='small' fullWidth variant='outlined' type='password' label='New Password' className='mb-4' value={newPass} onChange={e => setNewPass(e.target.value)} />
                <TextField size='small' fullWidth variant='outlined' type='password' label='Confirm New Password' className='mb-4' value={cNewPass} onChange={e => setCNewPass(e.target.value)} />
                <Button size='small' sx={{ boxShadow: 0 }} variant='contained' disabled={btnDisabled} onClick={() => currentUser.changePassword(oldPass, newPass, cNewPass)}>Change Password</Button>
                <br /><br /><br />
                <TakeMe path={currentUser.role === 'teacher' ? '/' : '/join'} fullReload={true}>
                  <Button className='float-start' variant='text' color='secondary' disabled={btnDisabled}>Back</Button>
                </TakeMe>
                <Button className='float-end' variant='text' disabled={btnDisabled} onClick={() => {
                  progress.show()
                  return setTimeout(() => {
                    currentUser.signOut()
                  }, 800)
                }}>Sign Out</Button>
              </CardContent>
            </Card>
          </Container>
        </Slide>
      </PrivateRoute>
    </>
  )
}

export default Profile