import React, { useEffect, useState } from 'react'
import { useGlobal } from '../contexts/GlobalContext'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { CircularProgress, Container } from '@mui/material'

function PrivateRoute({ children }) {
  const { progress } = useGlobal()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    progress.hide()
    try {
      if (Object.keys(currentUser).length > 0) {
        return setLoading(false)
      }
      return router.replace('/signin')
    } catch (error) {
      console.error(error)
      return router.replace('/signin')
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

export default PrivateRoute