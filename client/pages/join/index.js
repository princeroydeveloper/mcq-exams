import Head from "next/head"
import BrandHeader from "../../components/BrandHeader"
import PrivateRouteForStudents from "../../components/PrivateRouteForStudents"
import { Container, Tooltip, IconButton } from '@mui/material'
import { Refresh, Quiz } from '@mui/icons-material'
import SpeedDialComponent from '../../components/SpeedDialComponent'
import { useExam } from "../../contexts/ExamContext"
import { JoinModal } from "../../components/ExamModal"

const StudentsHome = () => {
  const { setJoinModal } = useExam()

  return (
    <>
      <Head>
        <title>Student Dashboard - MCQ Exams</title>
      </Head>
      <PrivateRouteForStudents>
        <BrandHeader title='Student Dashboard' />
        <JoinModal />
        <Container className='my-5'>
          <Tooltip title='Refresh'>
            <IconButton className='float-end' size='large'>
              <Refresh />
            </IconButton>
          </Tooltip>
          <h2>
            <Quiz style={{ fontSize: '40px' }} />&nbsp;
            Exams you attempted
          </h2>

          <div className='row mt-5'>

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