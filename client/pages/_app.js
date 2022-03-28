import AuthProvider from '../contexts/AuthContext'
import GlobalProvider from '../contexts/GlobalContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalProvider>
        <AuthProvider>
          <Component {...pageProps} />
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

export default MyApp
