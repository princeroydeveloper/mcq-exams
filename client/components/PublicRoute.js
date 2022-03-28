import React, { useEffect, useState } from 'react'
import { useGlobal } from '../contexts/GlobalContext'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'

function PublicRoute({ children }) {
  const { progress } = useGlobal()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    progress.hide()
    try {
      if (Object.keys(currentUser).length > 0) {
        return router.replace('/')
      }
      return setLoading(false)
    } catch (error) {
      console.error(error)
      return setLoading(false)
    }
  }, [])

  return (
    <>
      {loading &&
        <>
          Hang on...authenticating...
        </>
      }
      {!loading && children}
    </>
  )
}

export default PublicRoute