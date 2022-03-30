import React, { useContext, useEffect, useState } from 'react'
import { useGlobal } from './GlobalContext'
import { toast } from 'react-toastify'
import jwt from 'jsonwebtoken'

const AuthContext = React.createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

function AuthProvider({ children }) {
  const LOCAL_STORAGE_AUTH_TOKEN_KEY = 'auth-token'
  const { API_DOMAIN, setBtnDisabled } = useGlobal()
  const [currentUser, setCurrentUser] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      if (localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)) {
        const userData = jwt.decode(localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY))
        userData.signOut = signOutUser
        userData.changePassword = changePasswordUser
        setCurrentUser(userData)
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
      return window.location.href = '/signin'
    }
    setLoading(false)
  }, [])

  async function signIn(email, password) {
    try {
      setBtnDisabled(true)
      const req = await fetch(`${API_DOMAIN}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
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
        localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN_KEY, res.success)
        return window.location.href = '/'
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

  async function signUp(email, password, fname, lname, role) {
    try {
      setBtnDisabled(true)
      const req = await fetch(`${API_DOMAIN}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, fname, lname, role })
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
        localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN_KEY, res.success)
        toast.success(res.message)
        toast.success('Redirecting to dashboard in a moment...')
        return setTimeout(() => {
          window.location.href = '/'
        }, 2000)
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

  async function changePasswordUser(oldPass, newPass, cnewPass) {
    try {
      setBtnDisabled(true)
      const req = await fetch(`${API_DOMAIN}/auth/change_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
        },
        body: JSON.stringify({ old: oldPass, new: newPass, cnew: cnewPass })
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
        toast.success(res.success)
        return setTimeout(() => {
          localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
          window.location.href = '/signin'
        }, 1000)
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

  async function forgotPassword(email) {
    try {
      setBtnDisabled(true)
      const req = await fetch(`${API_DOMAIN}/auth/forgot_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
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
        setBtnDisabled(false)
        return toast.success(res.success)
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

  async function signOutUser() {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
    return window.location.href = '/signin'
  }

  const values = {
    LOCAL_STORAGE_AUTH_TOKEN_KEY,
    currentUser,
    signIn, forgotPassword, signUp
  }

  return (
    <>
      <AuthContext.Provider value={values}>
        {!loading && children}
      </AuthContext.Provider>
    </>
  )
}

export default AuthProvider