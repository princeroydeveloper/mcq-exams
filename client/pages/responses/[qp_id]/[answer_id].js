import { Container, Alert, Card, CardContent, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio, Typography, Button } from "@mui/material"
import Head from 'next/head'
import { Scoreboard } from '@mui/icons-material'
import { useRouter } from "next/router"
import { useEffect } from "react"
import BrandHeader from "../../../components/BrandHeader"
import PrivateRouteForTeachers from "../../../components/PrivateRouteForTeachers"
import { useResponses } from "../../../contexts/ResponsesContext"
import { v4 as uuidv4 } from 'uuid'

const SpecificResponse = () => {
  const router = useRouter()
  const { qp_id, answer_id } = router.query
  const { getScore, scoreData, deleteResponse } = useResponses()

  useEffect(() => {
    if ((!qp_id) && (!answer_id)) return
    return getScore(qp_id, answer_id)
  }, [qp_id, answer_id])

  return (
    <>
      <Head>
        <title>Student Response - MCQ Exams</title>
      </Head>
      <PrivateRouteForTeachers>
        <BrandHeader options={true} title='Student Response' />
        {Object.keys(scoreData).length > 0 &&
          <>
            <Container className='my-5' style={{ maxWidth: '40vw' }}>
              <Card className='p-4' variant='outlined'>
                <CardContent>
                  <center className='text-muted'>
                    <Scoreboard style={{ fontSize: '40px' }} />&nbsp;&nbsp;<span className='bold'>{scoreData.studentName}'s Examination Report</span>
                    <br />
                    <small>{scoreData.state}</small>
                    <br /><br />
                  </center>
                  <Typography component='div' variant='h4' className='text-center' style={{ color: '#0168ee' }}>{scoreData.total_score}</Typography>
                  <center>
                    <Button onClick={() => {
                      if (confirm("This would allow the student to attempt the exam once again.\nAre you sure to delete this response?") == true) {
                        deleteResponse(qp_id, answer_id)
                      }
                    }} variant='contained' color='error' className='mt-4'>Delete Response</Button>
                  </center>
                </CardContent>
              </Card>
            </Container>

            <Container>
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
                      <h6 className='text-muted mt-2'>{scoreData.studentName.split(' ')[0]}'s Answer: {item.your_opt.name}</h6>
                      <h6 className='text-muted'>Marks obtained: {item.marksObtained}</h6>
                    </Alert>
                  </Container>
                )
              })}
            </Container>
          </>
        }
        <br /><br /><br />
      </PrivateRouteForTeachers>
    </>
  )
}

export default SpecificResponse