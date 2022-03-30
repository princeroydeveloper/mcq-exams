import React, { useContext, useReducer, useState } from 'react'
import { useGlobal } from './GlobalContext'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'

const QuestionContext = React.createContext()

export const useQuestion = () => {
  return useContext(QuestionContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'update_question':
      return {
        ...state,
        question: payload.value
      }
    case 'update_opt_a':
      return {
        ...state,
        opt_a: payload.value
      }
    case 'update_opt_b':
      return {
        ...state,
        opt_b: payload.value
      }
    case 'update_opt_c':
      return {
        ...state,
        opt_c: payload.value
      }
    case 'update_opt_d':
      return {
        ...state,
        opt_d: payload.value
      }
    case 'update_correct_opt':
      return {
        ...state,
        correct_opt: payload.value
      }
    case 'update_qp_id':
      return {
        ...state,
        qp_id: payload.value
      }
    case 'update_marks':
      return {
        ...state,
        marks: payload.value
      }
    case 'update_question_id':
      return {
        ...state,
        question_id: payload.value
      }
    case 'discard':
      return {
        ...state,
        question: '',
        opt_a: '',
        opt_b: '',
        opt_c: '',
        opt_d: '',
        correct_opt: '',
        marks: '',
        question_id: ''
      }
    case 'set_data':
      return {
        ...state,
        question: payload.question,
        opt_a: payload.opt_a,
        opt_b: payload.opt_b,
        opt_c: payload.opt_c,
        opt_d: payload.opt_d,
        correct_opt: payload.correct_opt,
        marks: payload.marks,
        question_id: payload._id
      }
  }
}

function QuestionProvider({ children }) {
  const { setBtnDisabled, API_DOMAIN, progress } = useGlobal()
  const { LOCAL_STORAGE_AUTH_TOKEN_KEY } = useAuth()
  const initialState = {
    question: '',
    opt_a: '',
    opt_b: '',
    opt_c: '',
    opt_d: '',
    correct_opt: '',
    qp_id: '',
    marks: '',
    question_id: ''
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const [totalNo, setTotalNo] = useState([])

  async function save() {
    try {
      setBtnDisabled(true)
      const req = await fetch(`${API_DOMAIN}/question/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        },
        body: JSON.stringify({ ...state })
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
        dispatch({ type: 'update_question_id', payload: { value: res.question_id } })
        setTotalNo(res.total)
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

  async function getPaper() {
    try {
      progress.show()
      const req = await fetch(`${API_DOMAIN}/question_paper/get_total_no_questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        },
        body: JSON.stringify({ qp_id: state.qp_id })
      })
      const stats = req.status
      const res = await req.json()
      if (stats === 400) {
        if (res.errors) {
          progress.hide()
          toast.error(res.errors[0].msg)
          return setTimeout(() => {
            window.location.href = '/'
          }, 800)
        } else if (res.error) {
          progress.hide()
          toast.error(res.error)
          return setTimeout(() => {
            window.location.href = '/'
          }, 800)
        }
        progress.hide()
        toast.error('An unexpected error occurred...')
        return setTimeout(() => {
          window.location.href = '/'
        }, 800)
      } else if (stats === 401 && res.error) {
        return currentUser.signOut()
      } else if (stats === 200 && res.total) {
        progress.hide()
        return setTotalNo(res.total)
      } else if (stats === 500) {
        progress.hide()
        toast.error(res.error)
        return setTimeout(() => {
          window.location.href = '/'
        }, 800)
      } else {
        progress.hide()
        toast.error('An unexpected error occurred...')
        return setTimeout(() => {
          window.location.href = '/'
        }, 800)
      }
    } catch (error) {
      progress.hide()
      console.error(error)
      toast.error('An unexpected error occurred')
      return setTimeout(() => {
        window.location.href = '/'
      }, 800)
    }
  }

  async function get(question_id) {
    try {
      progress.show()
      const req = await fetch(`${API_DOMAIN}/question/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        },
        body: JSON.stringify({ qp_id: state.qp_id, question_id })
      })
      const stats = req.status
      const res = await req.json()
      if (stats === 400) {
        if (res.errors) {
          progress.hide()
          return toast.error(res.errors[0].msg)
        } else if (res.error) {
          progress.hide()
          return toast.error(res.error)
        }
        progress.hide()
        return toast.error('An unexpected error occurred...')
      } else if (stats === 401 && res.error) {
        return currentUser.signOut()
      } else if (stats === 200 && res.data) {
        progress.hide()
        dispatch({ type: 'set_data', payload: res.data })
        return toast.success(res.success)
      } else if (stats === 500) {
        progress.hide()
        return toast.error(res.error)
      } else {
        progress.hide()
        return toast.error('An unexpected error occurred...')
      }
    } catch (error) {
      progress.hide()
      console.error(error)
      return toast.error('An unexpected error occurred')
    }
  }

  const values = {
    state, dispatch,
    save, getPaper, get,
    totalNo
  }

  return (
    <>
      <QuestionContext.Provider value={values}>
        {children}
      </QuestionContext.Provider>
    </>
  )
}

export default QuestionProvider