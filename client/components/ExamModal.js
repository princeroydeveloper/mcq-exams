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