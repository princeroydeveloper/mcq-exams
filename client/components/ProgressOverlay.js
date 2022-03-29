import React from 'react'
import { useGlobal } from '../contexts/GlobalContext'
import { CircularProgress, Container } from '@mui/material'

function ProgressOverlay() {
  const { progressOverlayRef } = useGlobal()

  return (
    <>
      <div id='overlay' ref={progressOverlayRef}>
        <Container className='my-5'>
          <center>
            <CircularProgress />
          </center>
        </Container>
      </div>
    </>
  )
}

export default ProgressOverlay