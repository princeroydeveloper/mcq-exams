import { Container, Card, CardContent, Button } from '@mui/material'
import Head from 'next/head'
import BrandHeader from '../components/BrandHeader'
import PrivateRoute from '../components/PrivateRoute'
import { AddCircle, Quiz } from '@mui/icons-material'

const Home = () => {
  return (
    <>
      <Head>
        <title>Dashboard - MCQ Exams</title>
      </Head>
      <PrivateRoute>
        <BrandHeader />
        <Container className='my-5'>
          <Button className='float-end' size='large' variant='text'>
            <AddCircle />&nbsp;New Paper
          </Button>
          <h2>
            <Quiz style={{ fontSize: '40px' }} />&nbsp;
            Your question papers
          </h2>

          <div className='row mt-5'>
            <Card style={{ width: '18rem' }} variant='outlined' className='q-card p-2 mx-3 mb-3'>
              <CardContent>
                <h5 className='text-truncate'>Untitled paper</h5>
                <p className='text-muted text-truncate'>48 questions</p>
                <Button variant='outlined' size='sm'>Edit</Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </PrivateRoute>
    </>
  )
}

export default Home