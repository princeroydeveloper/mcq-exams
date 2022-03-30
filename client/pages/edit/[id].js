import Head from "next/head"
import BrandHeader from "../../components/BrandHeader"
import PrivateRouteForTeachers from "../../components/PrivateRouteForTeachers"
import { Card, CardContent, Container, Fab, Grid, TextField, SpeedDialIcon, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useQuestion } from "../../contexts/QuestionContext"
import { useGlobal } from "../../contexts/GlobalContext"
import { useRouter } from "next/router"
import { useEffect } from "react"

const EditPaper = () => {
  const { state, dispatch, save, getPaper, totalNo, get } = useQuestion()
  const { btnDisabled } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    if (!router.query.id) {
      return
    }
    dispatch({ type: 'update_qp_id', payload: { value: router.query.id } })
  }, [router.query])

  useEffect(() => {
    if (state.qp_id !== '') {
      getPaper()
    }
  }, [state.qp_id])

  return (
    <>
      <Head>
        <title>Edit Question Paper - MCQ Exams</title>
      </Head>
      <PrivateRouteForTeachers>
        <BrandHeader title='Edit question paper' />
        <Container className='my-5'>
          <Grid container spacing={2} className='my-5'>
            <Grid item xs={8}>
              <TextField
                variant="standard"
                label='Your question'
                autoComplete="off"
                margin="normal"
                InputLabelProps={{ style: { fontSize: '20px' } }}
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
            </Grid>
            <Grid item xs={4}>
              <Card className='p-2'>
                <CardContent>
                  <h5>Questions</h5>
                  <div className='row'>
                    {totalNo.map((item, index) => {
                      return (
                        <Fab size='small' sx={{ boxShadow: 0 }} className='mx-3 mt-3' key={item._id} onClick={() => {
                          get(item._id)
                        }} color={state.question_id === item._id ? 'primary' : 'inherit'}>{index + 1}</Fab>
                      )
                    })}
                    <Fab size='small' sx={{ boxShadow: 0 }} className='mx-3 mt-3' color='secondary' onClick={() => dispatch({ type: 'discard' })} disabled={btnDisabled}>
                      <SpeedDialIcon />
                    </Fab>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={4} style={{ maxWidth: '40%' }}>
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
              />
            </Grid>
          </Grid>
          <br /><br /><br />
          <Button variant='contained' disabled={btnDisabled} onClick={save}>Save</Button>
        </Container>
      </PrivateRouteForTeachers>
    </>
  )
}

export default EditPaper