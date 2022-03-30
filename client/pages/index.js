import { Container, Card, CardContent, Button } from '@mui/material'
import Head from 'next/head'
import BrandHeader from '../components/BrandHeader'
import PrivateRouteForTeachers from '../components/PrivateRouteForTeachers'
import { Quiz, Search, LiveHelp } from '@mui/icons-material'
import { DeleteModal, NewModal } from '../components/QuestionPaperModal'
import { useQuestionPaper } from '../contexts/QuestionPaperContext'
import SpeedDialComponent from '../components/SpeedDialComponent'

const TeachersHome = () => {
  const { setNewModal, qps, setPaper_data, setDelModal } = useQuestionPaper()

  return (
    <>
      <Head>
        <title>Teacher Dashboard - MCQ Exams</title>
      </Head>
      <PrivateRouteForTeachers>
        <BrandHeader title='Teacher Dashboard' />
        <NewModal />
        <DeleteModal />
        <Container className='my-5'>
          <h2>
            <Quiz style={{ fontSize: '40px' }} />&nbsp;
            Your question papers
          </h2>

          <div className='row mt-5'>
            {qps.length > 0 ?
              <>
                {qps.map(qp => {
                  return (
                    <Card style={{ width: '18rem' }} variant='outlined' className='q-card p-2 mx-3 mb-3'>
                      <CardContent>
                        <h5 className='text-truncate'>{qp.name}</h5>
                        <p className='text-muted text-truncate'>{qp.total_questions} questions</p>
                        <Button variant='outlined' size='small' onClick={() => {
                          return window.open(`/edit/${qp._id}`)
                        }}>Edit</Button>
                        <Button variant='outlined' size='small' className='mx-2' color='secondary'>Rename</Button>
                        <Button variant='outlined' size='small' className='mx-1' color='error' onClick={() => {
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
                  <Search style={{ fontSize: '34px' }} className='text-muted' />
                  <h5 className='text-muted mt-2'>No papers to show... Create a new one...</h5>
                </center>
              </>
            }
          </div>
          <SpeedDialComponent mainClick={() => {
            return setNewModal(true)
          }} />
        </Container>
      </PrivateRouteForTeachers>
    </>
  )
}

export default TeachersHome