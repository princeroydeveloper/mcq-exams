import React, { useContext, useState } from 'react'
import { useAuth } from './AuthContext'
import { useGlobal } from './GlobalContext'
import { toast } from 'react-toastify'

const ResponsesContext = React.createContext()

export const useResponses = () => {
  return useContext(ResponsesContext)
}

function ResponsesProvider({ children }) {
  const { progress, API_DOMAIN } = useGlobal()
  const { LOCAL_STORAGE_AUTH_TOKEN_KEY } = useAuth()
  const [responses, setResponses] = useState([])
  const [scoreData, setScoreData] = useState({})

  async function getList(qp_id) {
    try {
      progress.show()
      const req = await fetch(`${API_DOMAIN}/responses/get_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        },
        body: JSON.stringify({ qp_id })
      })
      const stats = req.status
      const res = await req.json()
      if (stats === 400) {
        if (res.errors) {
          progress.hide()
          setResponses([])
          toast.error(res.errors[0].msg)
          return setTimeout(() => {
            window.location.href = '/'
          }, 1500)
        } else if (res.error) {
          progress.hide()
          setResponses([])
          toast.error(res.error)
          return setTimeout(() => {
            window.location.href = '/'
          }, 1500)
        }
        progress.hide()
        setResponses([])
        toast.error('An unexpected error occurred...')
        return setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      } else if (stats === 401 && res.error) {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        return window.location.href = '/signin'
      } else if (stats === 200) {
        progress.hide()
        return setResponses(res)
      } else if (stats === 500) {
        progress.hide()
        setResponses([])
        toast.error(res.error)
        return setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      } else {
        progress.hide()
        setResponses([])
        toast.error('An unexpected error occurred...')
        return setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      }
    } catch (error) {
      progress.hide()
      setResponses([])
      console.error(error)
      toast.error('An unexpected error occurred')
      return setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    }
  }

  async function getScore(qp_id, answer_id) {
    try {
      progress.show()
      const req = await fetch(`${API_DOMAIN}/responses/get_score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        },
        body: JSON.stringify({ qp_id, answer_id })
      })
      const stats = req.status
      const res = await req.json()
      if (stats === 400) {
        if (res.errors) {
          progress.hide()
          toast.error(res.errors[0].msg)
          return setTimeout(() => {
            window.location.href = '/'
          }, 1500)
        } else if (res.error) {
          progress.hide()
          toast.error(res.error)
          return setTimeout(() => {
            window.location.href = '/'
          }, 1500)
        }
        progress.hide()
        toast.error('An unexpected error occurred...')
        return setTimeout(() => {
          window.location.href = '/'
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
          window.location.href = '/'
        }, 1500)
      } else {
        progress.hide()
        toast.error('An unexpected error occurred...')
        return setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      }
    } catch (error) {
      progress.hide()
      console.error(error)
      toast.error('An unexpected error occurred')
      return setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    }
  }

  const values = {
    getList,
    responses,
    getScore, scoreData
  }

  return (
    <>
      <ResponsesContext.Provider value={values}>
        {children}
      </ResponsesContext.Provider>
    </>
  )
}

export default ResponsesProvider