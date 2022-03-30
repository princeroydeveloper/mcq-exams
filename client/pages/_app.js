import AuthProvider from '../contexts/AuthContext'
import GlobalProvider from '../contexts/GlobalContext'
import { ToastContainer } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'
import { createTheme, ThemeProvider } from '@mui/material'
import ProgressOverlay from '../components/ProgressOverlay'
import QuestionPaperProvider from '../contexts/QuestionPaperContext'

function MCQExams({ Component, pageProps }) {
  const customTheme = createTheme({
    typography: {
      'fontFamily': `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
      'fontSize': 14,
      'fontWeightLight': 300,
      'fontWeightRegular': 400,
      'fontWeightMedium': 500
    },
    palette: {
      primary: {
        main: '#3367D5'
      }
    }
  })

  return (
    <>
      <GlobalProvider>
        <AuthProvider>
          <QuestionPaperProvider>
            <ThemeProvider theme={customTheme}>
              <ProgressOverlay />
              <Component {...pageProps} />
            </ThemeProvider>
          </QuestionPaperProvider>
        </AuthProvider>
      </GlobalProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
    </>
  )
}

export default MCQExams
