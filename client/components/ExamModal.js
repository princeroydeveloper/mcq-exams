import { useEffect, useState } from "react"
import { useExam } from "../contexts/ExamContext"
import { useGlobal } from "../contexts/GlobalContext"
import { Dialog, Button, DialogActions, DialogTitle, DialogContent, TextField, Grow } from '@mui/material'

export const JoinModal = () => {
  const { joinModal, setJoinModal, check } = useExam()
  const { btnDisabled } = useGlobal()
  const [code, setCode] = useState('')

  useEffect(() => {
    if (!joinModal) {
      setCode('')
    }
  }, [joinModal])

  return (
    <div>
      <Dialog
        open={joinModal}
        maxWidth='xs'
        fullWidth
        TransitionComponent={Grow}
      >
        <DialogTitle>
          Attempt Exam
        </DialogTitle>
        <DialogContent>
          <TextField variant='standard' label='Enter Question Paper Id' autoComplete="off" fullWidth value={code} onChange={e => setCode(e.target.value)} helperText='You can get your question paper id from your teacher.' />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinModal(false)} disabled={btnDisabled}>Cancel</Button>
          <Button disabled={btnDisabled} onClick={() => {
            check(code)
          }}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export const ConfirmJoinModal = ({ paper_id }) => {
  const { confirmModal, join } = useExam()
  const { btnDisabled } = useGlobal()

  return (
    <div>
      <Dialog
        open={confirmModal}
        maxWidth='xs'
        fullWidth
        TransitionComponent={Grow}
      >
        <DialogTitle>
          Confirm Joining Exam
        </DialogTitle>
        <DialogContent>
          <h6 className='text-muted'>By clicking "Confirm & Join", your exam timer will start (as per the duration assigned by your teacher) and will autosubmit after the time ends.</h6>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.href = '/join'} disabled={btnDisabled}>Cancel</Button>
          <Button disabled={btnDisabled} onClick={() => {
            join(paper_id)
          }}>Confirm & Join</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export const SubmitModal = ({ submitFunction, questionsAnswered, totalQuestions }) => {
  const { btnDisabled } = useGlobal()
  const { submitModal, setSubmitModal } = useExam()

  return (
    <div>
      <Dialog
        open={submitModal}
        maxWidth='xs'
        fullWidth
        TransitionComponent={Grow}
      >
        <DialogTitle>
          Confirm submitting answers
        </DialogTitle>
        <DialogContent>
          <h6 className='text-muted'>You have answered {questionsAnswered} out of {totalQuestions} questions. Are you sure to submit?</h6>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitModal(false)} disabled={btnDisabled}>Cancel</Button>
          <Button disabled={btnDisabled} onClick={submitFunction}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}