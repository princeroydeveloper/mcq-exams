import { Card, CardContent, Container, FormControl, FormLabel, RadioGroup, Typography, FormControlLabel, Radio, AppBar, Toolbar, Box, Alert } from "@mui/material"
import { Scoreboard, Flaky } from '@mui/icons-material'
import Head from "next/head"
import { useRouter } from "next/router"
import PrivateRouteForStudents from "../../components/PrivateRouteForStudents"
import { useEffect } from "react"
import { useExam } from "../../contexts/ExamContext"
import { v4 as uuidv4 } from 'uuid'

const StudentScore = () => {
  const router = useRouter()
  const { paper_id } = router.query
  const { getScore, scoreData } = useExam()

  useEffect(() => {
    if (!paper_id) return
    getScore(paper_id)
  }, [paper_id])

  return (
    <>
      <Head>
        <title>Your Score - MCQ Exams</title>
      </Head>
      <PrivateRouteForStudents>
        <Container className='my-5' style={{ maxWidth: '40vw' }}>
          <Card className='p-4' variant='outlined'>
            <CardContent>
              <center className='text-muted'>
                <Scoreboard style={{ fontSize: '40px' }} />&nbsp;&nbsp;<span className='bold'>Examination Report ({paper_id})</span>
                <br />
                <small>{scoreData.state}</small>
                <br /><br />
              </center>
              <Typography component='div' variant='h4' className='text-center' style={{ color: '#0168ee' }}>{scoreData.total_score}</Typography>
            </CardContent>
          </Card>
        </Container>

        <Container>
          {Object.keys(scoreData).length > 0 &&
            <>
              {scoreData.data.map((item, index) => {
                return (
                  <Container className='mt-4' style={{ maxWidth: '60vw' }} key={uuidv4()}>
                    <Alert className='p-3' severity={item.marksObtained !== 0 ? 'success' : 'error'} variant='outlined'>
                      <span className='text-muted' style={{ letterSpacing: '5px', textTransform: 'uppercase' }}>Question {index + 1} ({item.marks} marks)</span><br />
                      <span className='bold mb-5' style={{ fontSize: '30px' }}>{item.question}</span>
                      <br /><br />
                      <FormControl>
                        <FormLabel id='mcq-question-1'>Options</FormLabel>
                        <RadioGroup value={item.correct_opt.code_name} name='mcq-question-1'>
                          <FormControlLabel disabled value='opt_a' label={item.opt_a} control={<Radio />} />
                          <FormControlLabel disabled value='opt_b' label={item.opt_b} control={<Radio />} />
                          <FormControlLabel disabled value='opt_c' label={item.opt_c} control={<Radio />} />
                          <FormControlLabel disabled value='opt_d' label={item.opt_d} control={<Radio />} />
                        </RadioGroup>
                      </FormControl>
                      <h6 className='text-muted mt-2'>Your Answer: {item.your_opt.name}</h6>
                      <h6 className='text-muted'>Marks obtained: {item.marksObtained}</h6>
                    </Alert>
                  </Container>
                )
              })}
            </>
          }
          <br /><br /><br />
          <Box sx={{ flexGrow: 1 }} className='p-4 text-dark'>
            <AppBar position="static" color="inherit" sx={{ boxShadow: 0, backgroundColor: 'inherit' }}>
              <Toolbar>
                <Flaky className='mx-2' style={{ fontSize: '35px' }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  MCQ Exams
                </Typography>
                The best examination environment for students & teachers.
              </Toolbar>
            </AppBar>
          </Box>
        </Container>
      </PrivateRouteForStudents>
    </>
  )
}

export default StudentScore