import React from 'react'
import { useGlobal } from '../contexts/GlobalContext'

function ProgressOverlay() {
  const { progressOverlayRef } = useGlobal()

  return (
    <>
      <div id='overlay' ref={progressOverlayRef}>
        Progress Overlay...
      </div>
    </>
  )
}

export default ProgressOverlay