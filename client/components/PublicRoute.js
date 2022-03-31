import React, { useEffect, useState } from 'react'
import { useGlobal } from '../contexts/GlobalContext'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { CircularProgress, Container } from '@mui/material'

function PublicRoute({ children }) {
  const { progress } = useGlobal()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    progress.hide()
    try {
      if (Object.keys(currentUser).length > 0) {
        if (currentUser.role === 'teacher') {
          return router.replace('/')
        }
        return router.replace('/join')
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
          <Container className='my-5'>
            <center>
              <CircularProgress />
            </center>
          </Container>
        </>
      }
      {!loading && children}
    </>
  )
}

export default PublicRoute