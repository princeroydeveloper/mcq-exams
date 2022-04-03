import Head from "next/head"
import BrandHeader from "../../components/BrandHeader"
import PrivateRouteForTeachers from "../../components/PrivateRouteForTeachers"
import { Card, CardContent, Container, Fab, Grid, TextField, SpeedDialIcon, Button, FormControl, InputLabel, Select, MenuItem, InputAdornment, Input, FilledInput } from '@mui/material'
import { useQuestion } from "../../contexts/QuestionContext"
import { useGlobal } from "../../contexts/GlobalContext"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { ContentCopy } from '@mui/icons-material'
import ultralightCopy from 'copy-to-clipboard-ultralight'
import { toast } from "react-toastify"

const EditPaper = () => {
  const { state, dispatch, saveQuestion, getPaper, totalNo, getQuestion, deleteQuestion, paperId } = useQuestion()
  const { currentUser } = useAuth()
  const { btnDisabled, appPath } = useGlobal()
  const [fm, setFm] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (!router.query.id) {
      return
    }
    dispatch({ type: 'update_qp_id', payload: { value: router.query.id } })
  }, [router.query])

  useEffect(() => {
    if (state.qp_id !== '' && Object.keys(currentUser).length > 0) {
      getPaper()
    }
  }, [state.qp_id])

  useEffect(() => {
    async function perform() {
      let new_fm = 0
      await totalNo.forEach(item => {
        new_fm = new_fm + item.marks
      })
      setFm(new_fm)
    }
    perform()
  }, [totalNo])

  return (
    <>
      <Head>
        <title>Edit Question Paper - MCQ Exams</title>
      </Head>
      <PrivateRouteForTeachers>
        <BrandHeader title='Edit question paper' options={true} />
        <Container className='my-5'>
          <Grid container spacing={2} className='my-5'>
            <Grid item xs={8}>
              <TextField
                variant="outlined"
                label='QUESTION'
                autoComplete="off"
                margin="normal"
                InputLabelProps={{ style: { fontSize: '20px', letterSpacing: 7.5 } }}
                InputProps={{ style: { fontSize: '30px' } }}
                fullWidth
                multiline
                className="mb-5"
                value={state.question}
                onChange={e => dispatch({ type: 'update_question', payload: { value: e.target.value } })}
              />
              <TextField
                variant='standard'
                label='Option A'
                autoComplete='off'
                InputProps={{ style: { maxWidth: '60%', fontSize: '18px' } }}
                multiline
                fullWidth
                value={state.opt_a}
                onChange={e => dispatch({ type: 'update_opt_a', payload: { value: e.target.value } })}
              />
              <TextField
                className="mt-4"
                variant='standard'
                label='Option B'
                autoComplete='off'
                InputProps={{ style: { maxWidth: '60%', fontSize: '18px' } }}
                multiline
                fullWidth
                value={state.opt_b}
                onChange={e => dispatch({ type: 'update_opt_b', payload: { value: e.target.value } })}
              />
              <TextField
                className="mt-4"
                variant='standard'
                label='Option C'
                autoComplete='off'
                InputProps={{ style: { maxWidth: '60%', fontSize: '18px' } }}
                multiline
                fullWidth
                value={state.opt_c}
                onChange={e => dispatch({ type: 'update_opt_c', payload: { value: e.target.value } })}
              />
              <TextField
                className="mt-4"
                variant='standard'
                label='Option D'
                autoComplete='off'
                InputProps={{ style: { maxWidth: '60%', fontSize: '18px' } }}
                multiline
                fullWidth
                value={state.opt_d}
                onChange={e => dispatch({ type: 'update_opt_d', payload: { value: e.target.value } })}
              />
              <Grid container spacing={4} style={{ maxWidth: '40%' }} className='mt-4'>
                <Grid item xs={8}>
                  <FormControl variant='standard' size='small' fullWidth>
                    <InputLabel id='correct__option__select'>Correct Option</InputLabel>
                    <Select labelId='correct__option__select' label='Correct Option'
                      value={state.correct_opt}
                      onChange={e => dispatch({ type: 'update_correct_opt', payload: { value: e.target.value } })}
                    >
                      <MenuItem value='opt_a'>Option A</MenuItem>
                      <MenuItem value='opt_b'>Option B</MenuItem>
                      <MenuItem value='opt_c'>Option C</MenuItem>
                      <MenuItem value='opt_d'>Option D</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField type='number' variant='standard' label='Marks' size='small' autoComplete='off'
                    value={state.marks}
                    onChange={e => dispatch({ type: 'update_marks', payload: { value: e.target.value } })}
                    helperText='Optional'
                  />
                </Grid>
              </Grid>
              <br /><br />
              <Button variant='contained' disabled={btnDisabled} onClick={saveQuestion}>Save</Button>
              {state.question_id &&
                <Button variant='contained' disabled={btnDisabled} onClick={deleteQuestion} className='mx-4' color='error'>Delete</Button>
              }
            </Grid>
            <Grid item xs={4}>
              <Card className='p-2'>
                <CardContent>
                  <h5>Questions</h5>
                  <div className='row'>
                    {totalNo.length > 0 ?
                      <>
                        {totalNo.map((item, index) => {
                          return (
                            <Fab size='small' sx={{ boxShadow: 0 }} className='mx-3 mt-3' key={item._id} onClick={() => {
                              if (state.question_id === item._id) return
                              return getQuestion(item._id)
                            }} color={state.question_id === item._id ? 'primary' : 'inherit'}>{index + 1}</Fab>
                          )
                        })}
                        <Fab size='small' sx={{ boxShadow: 0 }} className='mx-3 mt-3' color='secondary' onClick={() => dispatch({ type: 'discard' })} disabled={btnDisabled}>
                          <SpeedDialIcon />
                        </Fab>
                      </>
                      :
                      <>
                        <h6 className='text-center text-muted mt-3'>No questions to show... Add your first question...</h6>
                      </>
                    }
                  </div>
                </CardContent>
              </Card>
              {totalNo.length > 0 &&
                <Card className='p-2 mt-4'>
                  <CardContent>
                    <h5>Other information</h5>
                    <h6 className='text-muted mt-3'>Full Marks = {fm}</h6>
                    <h6 className='text-muted mt-3'>Paper ID: {paperId}
                      <Button size='small' variant='text' className='mx-3' onClick={() => {
                        if (ultralightCopy(paperId)) {
                          return toast.success('Question paper Id has been successfully copied to clipboard!')
                        }
                      }}>
                        <ContentCopy fontSize='20' />&nbsp;Copy
                      </Button>
                    </h6>
                    <h6 className='mt-3'><span className="text-muted">Direct link for students to attempt the exam:</span> <span className='text-primary'>{appPath}/join/{paperId}</span><br />
                      <Button size='small' variant='text' className='mx-3' onClick={() => {
                        if (ultralightCopy(`${appPath}/join/${paperId}`)) {
                          return toast.success('Exam link has been successfully copied to clipboard!')
                        }
                      }}>
                        <ContentCopy fontSize='20' />&nbsp;Copy
                      </Button>
                    </h6>
                    <FormControl variant='filled' size='small' className='mt-3' fullWidth>
                      <InputLabel>Exam Duration</InputLabel>
                      <FilledInput
                        type='number'
                        onBlur={() => {
                          console.log('changeed')
                        }}
                        endAdornment={<InputAdornment position='end'>minutes</InputAdornment>}
                      />
                    </FormControl><br /><br />
                    <small className='text-muted'>Notice: The student must signin to attempt the exam</small>
                  </CardContent>
                </Card>
              }
            </Grid>
          </Grid>
        </Container>
      </PrivateRouteForTeachers>
    </>
  )
}

export default EditPaper