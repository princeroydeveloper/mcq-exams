import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'
import { useGlobal } from './GlobalContext'

const QuestionPaperContext = React.createContext()

export const useQuestionPaper = () => {
  return useContext(QuestionPaperContext)
}

function QuestionPaperProvider({ children }) {
  const { API_DOMAIN, setBtnDisabled, progress } = useGlobal()
  const { currentUser, LOCAL_STORAGE_AUTH_TOKEN_KEY } = useAuth()
  const [newModal, setNewModal] = useState(false)
  const [delModal, setDelModal] = useState(false)
  const [paper_data, setPaper_data] = useState({})
  const [qps, setQps] = useState([])

  async function create(name) {
    try {
      setBtnDisabled(true)
      const req = await fetch(`${API_DOMAIN}/question_paper/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        },
        body: JSON.stringify({ name })
      })
      const stats = req.status
      const res = await req.json()
      if (stats === 400) {
        if (res.errors) {
          setBtnDisabled(false)
          return toast.error(res.errors[0].msg)
        } else if (res.error) {
          setBtnDisabled(false)
          return toast.error(res.error)
        }
        setBtnDisabled(false)
        return toast.error('An unexpected error occurred...')
      } else if (stats === 401 && res.error) {
        return currentUser.signOut()
      } else if (stats === 200 && res.success) {
        setBtnDisabled(false)
        setNewModal(false)
        return toast.success(res.success)
      } else if (stats === 500) {
        setBtnDisabled(false)
        return toast.error(res.error)
      } else {
        setBtnDisabled(false)
        return toast.error('An unexpected error occurred...')
      }
    } catch (error) {
      setBtnDisabled(false)
      console.error(error)
      return toast.error('An unexpected error occurred')
    }
  }

  async function deleteQp() {
    try {
      setBtnDisabled(true)
      const req = await fetch(`${API_DOMAIN}/question_paper/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        },
        body: JSON.stringify({ qpId: paper_data._id })
      })
      const stats = req.status
      const res = await req.json()
      if (stats === 400) {
        if (res.errors) {
          setBtnDisabled(false)
          return toast.error(res.errors[0].msg)
        } else if (res.error) {
          setBtnDisabled(false)
          return toast.error(res.error)
        }
        setBtnDisabled(false)
        return toast.error('An unexpected error occurred...')
      } else if (stats === 401 && res.error) {
        return currentUser.signOut()
      } else if (stats === 200 && res.success) {
        setBtnDisabled(false)
        setDelModal(false)
        return toast.success(res.success)
      } else if (stats === 500) {
        setBtnDisabled(false)
        return toast.error(res.error)
      } else {
        setBtnDisabled(false)
        return toast.error('An unexpected error occurred...')
      }
    } catch (error) {
      setBtnDisabled(false)
      console.error(error)
      return toast.error('An unexpected error occurred')
    }
  }

  async function getAll() {
    try {
      progress.show()
      const req = await fetch(`${API_DOMAIN}/question_paper/get_all`, {
        method: 'POST',
        headers: {
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        }
      })
      const stats = req.status
      const res = await req.json()
      if (stats === 400) {
        if (res.errors) {
          progress.hide()
          setQps([])
          return toast.error(res.errors[0].msg)
        } else if (res.error) {
          progress.hide()
          setQps([])
          return toast.error(res.error)
        }
        progress.hide()
        setQps([])
        return toast.error('An unexpected error occurred...')
      } else if (stats === 401 && res.error) {
        return currentUser.signOut()
      } else if (stats === 200) {
        progress.hide()
        return setQps(res)
      } else if (stats === 500) {
        progress.hide()
        setQps([])
        return toast.error(res.error)
      } else {
        progress.hide()
        setQps([])
        return toast.error('An unexpected error occurred...')
      }
    } catch (error) {
      progress.hide()
      setQps([])
      console.error(error)
      return toast.error('An unexpected error occurred')
    }
  }

  const values = {
    newModal, setNewModal, delModal, setDelModal,
    create, getAll, deleteQp,
    qps,
    paper_data, setPaper_data
  }

  return (
    <>
      <QuestionPaperContext.Provider value={values}>
        {children}
      </QuestionPaperContext.Provider>
    </>
  )
}

export default QuestionPaperProvider