import Head from "next/head"
import BrandHeader from "../../components/BrandHeader"
import PrivateRouteForTeachers from "../../components/PrivateRouteForTeachers"
import { Container, Grid, TextField } from '@mui/material'

const EditPaper = () => {
  return (
    <>
      <Head>
        <title>Edit Question Paper - MCQ Exams</title>
      </Head>
      <PrivateRouteForTeachers>
        <BrandHeader title='Edit question paper' />
        <Container className='my-5'>
          <Grid container spacing={4} className='my-5'>
            <Grid xs={8}>
              <TextField
                variant="standard"
                label='Your question'
                autoComplete="off"
                margin="normal"
                InputLabelProps={{ style: { fontSize: '25px' } }}
                InputProps={{ style: { fontSize: '40px' } }}
                fullWidth
                className="mb-5"
              />
              <TextField
                variant='filled'
                label='Option A'
                autoComplete='off'
                InputProps={{ style: { maxWidth: '60%' } }}
                multiline
                fullWidth
              />
              <TextField
                className="mt-4"
                variant='filled'
                label='Option B'
                autoComplete='off'
                InputProps={{ style: { maxWidth: '60%' } }}
                multiline
                fullWidth
              />
              <TextField
                className="mt-4"
                variant='filled'
                label='Option C'
                autoComplete='off'
                InputProps={{ style: { maxWidth: '60%' } }}
                multiline
                fullWidth
              />
              <TextField
                className="mt-4"
                variant='filled'
                label='Option D'
                autoComplete='off'
                InputProps={{ style: { maxWidth: '60%' } }}
                multiline
                fullWidth
              />
            </Grid>
          </Grid>
        </Container>
      </PrivateRouteForTeachers>
    </>
  )
}

export default EditPaper