import React, { useContext, useReducer, useState } from 'react'
import { useGlobal } from '../contexts/GlobalContext'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

const ExamContext = React.createContext()

export const useExam = () => {
  return useContext(ExamContext)
}

function answerReducer(state, { type, payload }) {
  switch (type) {
    case 'set_answer':
      return [
        ...state.filter(ans => ans.qId !== payload.qId),
        {
          qId: payload.qId,
          opt: payload.opt
        }
      ]
  }
}

function ExamProvider({ children }) {
  const [joinModal, setJoinModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const { setBtnDisabled, API_DOMAIN, progress } = useGlobal()
  const { LOCAL_STORAGE_AUTH_TOKEN_KEY } = useAuth()
  const [examQuestions, setExamQuestions] = useState([])
  const [answerState, answerDispatch] = useReducer(answerReducer, [])

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
      setBtnDisabled(false)
      console.error(error)
      return toast.error('An unexpected error occurred')
    }
  }

  async function join(code) {
    try {
      setBtnDisabled(true)
      const req = await fetch(`${API_DOMAIN}/exam/join`, {
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
          toast.error(res.errors[0].msg)
          return setTimeout(() => {
            window.location.href = '/join'
          }, 1500)
        } else if (res.error) {
          setBtnDisabled(false)
          toast.error(res.error)
          return setTimeout(() => {
            window.location.href = '/join'
          }, 1500)
        }
        setBtnDisabled(false)
        toast.error('An unexpected error occurred...')
        return setTimeout(() => {
          window.location.href = '/join'
        }, 1500)
      } else if (stats === 401 && res.error) {
        setBtnDisabled(false)
        toast.error(res.error)
        return setTimeout(() => {
          window.location.href = '/join'
        }, 1500)
      } else if (stats === 200) {
        setBtnDisabled(false)
        return setExamQuestions(res)
      } else if (stats === 500) {
        setBtnDisabled(false)
        toast.error(res.error)
        return setTimeout(() => {
          window.location.href = '/join'
        }, 1500)
      } else {
        setBtnDisabled(false)
        toast.error('An unexpected error occurred...')
        return setTimeout(() => {
          window.location.href = '/join'
        }, 1500)
      }
    } catch (error) {
      setBtnDisabled(false)
      console.error(error)
      toast.error('An unexpected error occurred')
      return setTimeout(() => {
        window.location.href = '/join'
      }, 1500)
    }
  }

  const values = {
    joinModal, setJoinModal, confirmModal, setConfirmModal,
    check, join,
    examQuestions,
    answerState, answerDispatch
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