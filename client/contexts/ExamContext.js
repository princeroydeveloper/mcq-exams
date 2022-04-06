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
  const [submitModal, setSubmitModal] = useState(false)
  const { setBtnDisabled, API_DOMAIN, progress } = useGlobal()
  const { LOCAL_STORAGE_AUTH_TOKEN_KEY } = useAuth()
  const [examQuestions, setExamQuestions] = useState([])
  const [answerState, answerDispatch] = useReducer(answerReducer, [])
  const [examDuration, setExamDuration] = useState(0)
  const [attemptedExams, setAttemptedExams] = useState([])
  const [scoreData, setScoreData] = useState([])

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
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        return window.location.href = '/signin'
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
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        return window.location.href = '/signin'
      } else if (stats === 200) {
        setConfirmModal(false)
        setBtnDisabled(false)
        setExamDuration(res.duration)
        return setExamQuestions(res.questions)
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

  async function submit(code) {
    try {
      setBtnDisabled(true)
      const req = await fetch(`${API_DOMAIN}/exam/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        },
        body: JSON.stringify({ qp_id: code, answers: answerState })
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
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        return window.location.href = '/signin'
      } else if (stats === 200) {
        setConfirmModal(false)
        setBtnDisabled(false)
        toast.success(res.success)
        return setTimeout(() => {
          window.location.href = '/join'
        }, 1500)
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

  async function getAttemptedExams() {
    try {
      progress.show()
      const req = await fetch(`${API_DOMAIN}/exam/get_attempted_exams`, {
        method: 'POST',
        headers: {
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        }
      })
      const stats = req.status
      const res = await req.json()
      if (stats === 400) {
        if (res.errors) {
          setAttemptedExams([])
          progress.hide()
          return toast.error(res.errors[0].msg)
        } else if (res.error) {
          setAttemptedExams([])
          progress.hide()
          return toast.error(res.error)
        }
        setAttemptedExams([])
        progress.hide()
        return toast.error('An unexpected error occurred...')
      } else if (stats === 401 && res.error) {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        return window.location.href = '/signin'
      } else if (stats === 200) {
        progress.hide()
        return setAttemptedExams(res)
      } else if (stats === 500) {
        setAttemptedExams([])
        progress.hide()
        return toast.error(res.error)
      } else {
        setAttemptedExams([])
        progress.hide()
        return toast.error('An unexpected error occurred...')
      }
    } catch (error) {
      setAttemptedExams([])
      progress.hide()
      console.error(error)
      return toast.error('An unexpected error occurred')
    }
  }

  async function getScore(code) {
    try {
      progress.show()
      const req = await fetch(`${API_DOMAIN}/exam/get_score`, {
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
          progress.hide()
          toast.error(res.errors[0].msg)
          return setTimeout(() => {
            window.location.href = '/join'
          }, 1500)
        } else if (res.error) {
          progress.hide()
          toast.error(res.error)
          return setTimeout(() => {
            window.location.href = '/join'
          }, 1500)
        }
        progress.hide()
        toast.error('An unexpected error occurred...')
        return setTimeout(() => {
          window.location.href = '/join'
        }, 1500)
      } else if (stats === 401 && res.error) {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        return window.location.href = '/signin'
      } else if (stats === 200) {
        progress.hide()
        return setScoreData(res)
      } else if (stats === 500) {
        progress.hide()
        toast.error(res.error)
        return setTimeout(() => {
          window.location.href = '/join'
        }, 1500)
      } else {
        progress.hide()
        toast.error('An unexpected error occurred...')
        return setTimeout(() => {
          window.location.href = '/join'
        }, 1500)
      }
    } catch (error) {
      progress.hide()
      console.error(error)
      toast.error('An unexpected error occurred')
      return setTimeout(() => {
        window.location.href = '/join'
      }, 1500)
    }
  }

  const values = {
    joinModal, setJoinModal, confirmModal, setConfirmModal, submitModal, setSubmitModal,
    check, join, submit, getAttemptedExams, getScore,
    examQuestions, examDuration,
    answerState, answerDispatch,
    attemptedExams, setAttemptedExams, scoreData
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