import Head from "next/head"
import BrandHeader from "../../components/BrandHeader"
import PrivateRouteForStudents from "../../components/PrivateRouteForStudents"
import { Container, Tooltip, IconButton, Card, CardContent, Button } from '@mui/material'
import { Refresh, Quiz } from '@mui/icons-material'
import SpeedDialComponent from '../../components/SpeedDialComponent'
import { useExam } from "../../contexts/ExamContext"
import { JoinModal } from "../../components/ExamModal"
import { Search } from '@mui/icons-material'
import { useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'

const StudentsHome = () => {
  const { setJoinModal, getAttemptedExams, attemptedExams, joinModal } = useExam()

  useEffect(() => {
    if (joinModal) return
    return getAttemptedExams()
  }, [joinModal])

  return (
    <>
      <Head>
        <title>Student Dashboard - MCQ Exams</title>
      </Head>
      <PrivateRouteForStudents>
        <BrandHeader title='Student Dashboard' options={true} />
        <JoinModal />
        <Container className='my-5'>
          <Tooltip title='Refresh'>
            <IconButton className='float-end' size='large' onClick={getAttemptedExams}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <h2>
            <Quiz style={{ fontSize: '40px' }} />&nbsp;
            Exams you attempted
          </h2>

          <div className='row mt-5'>
            {attemptedExams.length > 0 ?
              <>
                {attemptedExams.map(exam => {
                  return (
                    <Card style={{ width: '18rem' }} variant='outlined' className='q-card p-2 mx-3 mb-3' key={uuidv4()}>
                      <CardContent>
                        <h5 className='text-truncate'>{exam.paperId}</h5>
                        <p className='text-muted text-truncate'>{exam.state}</p>
                        <Button variant='outlined' color='success' onClick={() => window.open(`/score/${exam.paperId}`)} size='small' disabled={exam.state === 'Answers were submitted successfully.' ? false : true}>View Score</Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
              :
              <>
                <center className='my-5'>
                  <Search style={{ fontSize: '40px' }} className='text-muted' />
                  <h5 className='text-muted mt-2'>Nothing to show... Start by attempting an exam...</h5>
                </center>
              </>
            }
          </div>

          <SpeedDialComponent title='Attempt Exam' mainClick={() => {
            return setJoinModal(true)
          }} />
        </Container>
      </PrivateRouteForStudents>
    </>
  )
}

export default StudentsHome