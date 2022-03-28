import Head from 'next/head'
import PrivateRoute from '../components/PrivateRoute'

const Home = () => {
  return (
    <>
      <Head>
        <title>Dashboard - Your App</title>
      </Head>
      <PrivateRoute>
        Hello, User
        <br />
        <button onClick={() => {
          window.location.href = '/profile'
        }}>Profile</button>
      </PrivateRoute>
    </>
  )
}

export default Home