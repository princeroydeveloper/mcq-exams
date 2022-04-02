import { Container, Grid, Card, CardContent, Fab, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import BrandHeader from "../../components/BrandHeader"
import { ConfirmJoinModal } from "../../components/ExamModal"
import PrivateRouteForStudents from "../../components/PrivateRouteForStudents"
import { useExam } from "../../contexts/ExamContext"

const Exam = () => {
  const { examQuestions, answerState, answerDispatch, setConfirmModal } = useExam()
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [tickedOpt, setTickedOpt] = useState('')
  const [pId, setPId] = useState('')
  const router = useRouter()
  const { paper_id } = router.query

  useEffect(() => {
    return setConfirmModal(true)
  }, [])

  useEffect(() => {
    if (!paper_id) return
    return setPId(paper_id)
  }, [paper_id])

  useEffect(() => {
    if (examQuestions.length > 0) {
      setCurrentQuestion({ ...examQuestions[0], index: 0 })
    }
  }, [examQuestions])

  useEffect(() => {
    const filtered = answerState.filter(ans => ans.qId === currentQuestion._id)
    if (filtered.length > 0) {
      return setTickedOpt(filtered[0].opt)
    }
    return setTickedOpt('')
  }, [answerState, currentQuestion])

  function handleOptionChange(e) {
    return answerDispatch({ type: 'set_answer', payload: { qId: currentQuestion._id, opt: e.target.value } })
  }

  return (
    <>
      <Head>
        <title>Live Exam - MCQ Exams</title>
      </Head>
      <PrivateRouteForStudents>
        <BrandHeader title='Exam' options={false} />
        {examQuestions.length > 0 ?
          <Container className='my-5'>
            <Grid container>
              <Grid item xs={8}>
                <span className='text-muted' style={{ letterSpacing: '5px', textTransform: 'uppercase' }}>Question {currentQuestion.index + 1}</span><br />
                <span className='bold mb-5' style={{ fontSize: '30px' }}>{currentQuestion.question}</span><br /><br /><br />
                <FormControl>
                  <FormLabel>Choose your answer</FormLabel>
                  <RadioGroup name='answer-mcqs' value={tickedOpt} onChange={handleOptionChange}>
                    <FormControlLabel value='opt_a' control={<Radio />} label={currentQuestion.opt_a} sx={{ fontSize: 18 }} />
                    <FormControlLabel value='opt_b' control={<Radio />} label={currentQuestion.opt_b} sx={{ fontSize: 18 }} />
                    <FormControlLabel value='opt_c' control={<Radio />} label={currentQuestion.opt_c} sx={{ fontSize: 18 }} />
                    <FormControlLabel value='opt_d' control={<Radio />} label={currentQuestion.opt_d} sx={{ fontSize: 18 }} />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Card className='p-2'>
                  <CardContent>
                    <h5>Questions</h5>
                    <div className='row'>
                      {examQuestions.length > 0 && examQuestions.map((item, index) => {
                        return (
                          <Fab size='small' sx={{ boxShadow: 0 }} className='mx-3 mt-3' key={item._id} onClick={() => {
                            if (currentQuestion._id === item._id) return
                            return setCurrentQuestion({
                              ...item,
                              index
                            })
                          }} color={(answerState.filter(ans => ans.qId === item._id).length === 1) ? 'success' : 'inherit'}>{index + 1}</Fab>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>



            {/* Footer */}
            <div className='footer p-3'>
              <Container>
                {(currentQuestion.index + 1) > 1 &&
                  <Button variant='outlined' className='mx-3' onClick={() => {
                    const i = currentQuestion.index - 1
                    return setCurrentQuestion({ ...examQuestions[i], index: i })
                  }}>Previous Question</Button>
                }
                {!(examQuestions.length === (currentQuestion.index + 1)) &&
                  <Button variant='contained' className='mx-3' onClick={() => {
                    const i = currentQuestion.index + 1
                    return setCurrentQuestion({ ...examQuestions[i], index: i })
                  }}>Next Question</Button>
                }
              </Container>
            </div>
          </Container>
          :
          <>
            <ConfirmJoinModal paper_id={pId} />
            <h1 className='my-5 text-muted text-center'>Waiting for confirmation ...</h1>
          </>
        }
      </PrivateRouteForStudents>
    </>
  )
}

export default Exam