import Head from "next/head"
import BrandHeader from "../../components/BrandHeader"
import PrivateRouteForStudents from "../../components/PrivateRouteForStudents"
import { Container, Tooltip, IconButton } from '@mui/material'
import { Refresh, Quiz } from '@mui/icons-material'
import SpeedDialComponent from '../../components/SpeedDialComponent'

const StudentsHome = () => {
  return (
    <>
      <Head>
        <title>Student Dashboard - MCQ Exams</title>
      </Head>
      <PrivateRouteForStudents>
        <BrandHeader title='Student Dashboard' />
        <Container className='my-5'>
          <Tooltip title='Refresh'>
            <IconButton className='float-end' size='large'>
              <Refresh />
            </IconButton>
          </Tooltip>
          <h2>
            <Quiz style={{ fontSize: '40px' }} />&nbsp;
            Exams you attempted already
          </h2>

          <SpeedDialComponent title='Attempt Exam' mainClick={() => {
            return setNewModal(true)
          }} />
        </Container>
      </PrivateRouteForStudents>
    </>
  )
}

export default StudentsHome