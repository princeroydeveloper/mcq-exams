import { useQuestionPaper } from "../contexts/QuestionPaperContext"
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, TextField, Grow } from '@mui/material'
import { useGlobal } from "../contexts/GlobalContext"
import { useEffect, useState } from "react"

export const NewModal = () => {
  const { newModal, setNewModal, create, getAll } = useQuestionPaper()
  const { btnDisabled } = useGlobal()
  const [name, setName] = useState('')

  useEffect(() => {
    if (!newModal) {
      setName('')
      getAll()

    }
  }, [newModal])

  return (
    <div>
      <Dialog
        open={newModal}
        maxWidth='xs'
        fullWidth
        TransitionComponent={Grow}
      >
        <DialogTitle>
          New Question Paper
        </DialogTitle>
        <DialogContent>
          <TextField variant='standard' label='Name' autoComplete="off" fullWidth value={name} onChange={e => setName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewModal(false)} disabled={btnDisabled}>Cancel</Button>
          <Button autoFocus disabled={btnDisabled} onClick={() => {
            create(name)
          }}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export const DeleteModal = () => {
  const { delModal, setDelModal, getAll, paper_data, deleteQp } = useQuestionPaper()
  const { btnDisabled } = useGlobal()

  useEffect(() => {
    if (!delModal) {
      getAll()
    }
  }, [delModal])

  return (
    <div>
      <Dialog
        open={delModal}
        maxWidth='xs'
        fullWidth
        TransitionComponent={Grow}
      >
        <DialogTitle>
          Delete Question Paper
        </DialogTitle>
        <DialogContent>
          <h6 className='text-muted'>Are you sure to delete "{paper_data.name}" permanently? This will delete all the questions in that paper.</h6>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDelModal(false)} disabled={btnDisabled}>Cancel</Button>
          <Button color='error' disabled={btnDisabled} onClick={() => {
            deleteQp()
          }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}