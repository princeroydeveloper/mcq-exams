import React, { useContext, useEffect, useRef, useState } from 'react'
import $ from 'jquery'

const GlobalContext = React.createContext()

export const useGlobal = () => {
  return useContext(GlobalContext)
}

function GlobalProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const API_DOMAIN = 'http://localhost:5000'
  const [btnDisabled, setBtnDisabled] = useState(false)
  const progressOverlayRef = useRef()
  const [progress, setProgress] = useState({})

  useEffect(() => {
    setProgress({
      show: () => {
        return $(progressOverlayRef.current).fadeIn()
      },
      hide: () => {
        return $(progressOverlayRef.current).fadeOut()
      }
    })
    setLoading(false)
  }, [])

  const values = {
    API_DOMAIN,
    btnDisabled, setBtnDisabled,
    progressOverlayRef,
    progress
  }

  return (
    <>
      <GlobalContext.Provider value={values}>
        {!loading && children}
      </GlobalContext.Provider>
    </>
  )
}

export default GlobalProvider