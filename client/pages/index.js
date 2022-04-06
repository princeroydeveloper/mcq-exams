import { Container, Card, CardContent, Button, IconButton, Tooltip } from '@mui/material'
import Head from 'next/head'
import BrandHeader from '../components/BrandHeader'
import PrivateRouteForTeachers from '../components/PrivateRouteForTeachers'
import { Quiz, Search, Refresh } from '@mui/icons-material'
import { DeleteModal, NewModal } from '../components/QuestionPaperModal'
import { useQuestionPaper } from '../contexts/QuestionPaperContext'
import SpeedDialComponent from '../components/SpeedDialComponent'
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const TeachersHome = () => {
  const { setNewModal, qps, setPaper_data, setDelModal, getAll, newModal, delModal } = useQuestionPaper()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser.role === 'teacher') {
      if (newModal) return
      if (delModal) return
      getAll()
    }
  }, [newModal, delModal])

  return (
    <>
      <Head>
        <title>Teacher Dashboard - MCQ Exams</title>
      </Head>
      <PrivateRouteForTeachers>
        <BrandHeader title='Teacher Dashboard' options={true} />
        <NewModal />
        <DeleteModal />
        <Container className='my-5'>
          <Tooltip title='Refresh question papers'>
            <IconButton onClick={getAll} className='float-end' size='large'>
              <Refresh />
            </IconButton>
          </Tooltip>
          <h2>
            <Quiz style={{ fontSize: '40px' }} />&nbsp;
            Your question papers
          </h2>

          <div className='row mt-5'>
            {qps.length > 0 ?
              <>
                {qps.map(qp => {
                  return (
                    <Card style={{ width: '18rem' }} variant='outlined' className='q-card p-2 mx-3 mb-3' key={uuidv4()}>
                      <CardContent>
                        <h5 className='text-truncate'>{qp.name}</h5>
                        <p className='text-muted text-truncate'>{qp.total_questions} questions</p>
                        <Button variant='outlined' size='small' onClick={() => {
                          return window.open(`/edit/${qp._id}`)
                        }}>Edit</Button>&nbsp;&nbsp;
                        <Button variant='outlined' size='small' color='secondary' onClick={() => {
                          return window.open(`/responses/${qp._id}`)
                        }}>Responses</Button>&nbsp;&nbsp;
                        <Button variant='outlined' size='small' color='error' onClick={() => {
                          setPaper_data(qp)
                          return setDelModal(true)
                        }}>Delete</Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
              :
              <>
                <center className='my-5'>
                  <Search style={{ fontSize: '40px' }} className='text-muted' />
                  <h5 className='text-muted mt-2'>No papers to show... Create a new one...</h5>
                </center>
              </>
            }
          </div>
          <SpeedDialComponent title='Question Paper' mainClick={() => {
            return setNewModal(true)
          }} />
        </Container>
      </PrivateRouteForTeachers>
    </>
  )
}

export default TeachersHome