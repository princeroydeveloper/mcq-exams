import Head from "next/head"
import { useState } from "react"
import PrivateRoute from "../components/PrivateRoute"
import { useAuth } from "../contexts/AuthContext"
import { useGlobal } from "../contexts/GlobalContext"

const Profile = () => {
  const { btnDisabled } = useGlobal()
  const { currentUser } = useAuth()
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [cNewPass, setCNewPass] = useState('')

  return (
    <>
      <Head>
        <title>Profile - Your App</title>
      </Head>
      <PrivateRoute>
        Name: <strong>{currentUser.fname} {currentUser.lname}</strong>
        <br />
        Email: <strong>{currentUser.email}</strong>
        <br /><br /><br />
        <input type="password" placeholder="Old Password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
        <br />
        <input type="password" placeholder="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} />
        <br />
        <input type="password" placeholder="Confirm New Password" value={cNewPass} onChange={e => setCNewPass(e.target.value)} /><br /><br />
        <button onClick={() => {
          currentUser.changePassword(oldPass, newPass, cNewPass)
        }} disabled={btnDisabled}>Change Password</button><br /><br />
        <button onClick={currentUser.signOut} disabled={btnDisabled}>SignOut</button>
      </PrivateRoute>
    </>
  )
}

export default Profile