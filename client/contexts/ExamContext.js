import React, { useContext, useState } from 'react'
import { useGlobal } from '../contexts/GlobalContext'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

const ExamContext = React.createContext()

export const useExam = () => {
  return useContext(ExamContext)
}

function ExamProvider({ children }) {
  const [joinModal, setJoinModal] = useState(false)
  const { setBtnDisabled, API_DOMAIN } = useGlobal()
  const { LOCAL_STORAGE_AUTH_TOKEN_KEY } = useAuth()

  async function check(code) {
    try {
      setBtnDisabled(true)
      const req = await fetch(`${API_DOMAIN}/exam/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        },
        body: JSON.stringify({ qp_id: code })
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
        setBtnDisabled(false)
        return toast.error(res.error)
      } else if (stats === 200 && res.success) {
        if (res.success === true) {
          setBtnDisabled(false)
          setJoinModal(false)
          return window.open(`/join/${code}`)
        }
      } else if (stats === 500) {
        setBtnDisabled(false)
        return toast.error(res.error)
      } else {
        setBtnDisabled(false)
        return toast.error('An unexpected error occurred...')
      }
    } catch (error) {
      console.error(error)
      return toast.error('An unexpected error occurred')
    }
  }

  const values = {
    joinModal, setJoinModal,
    check
  }

  return (
    <>
      <ExamContext.Provider value={values}>
        {children}
      </ExamContext.Provider>
    </>
  )
}

export default ExamProvider