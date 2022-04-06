import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Flaky from '@mui/icons-material/Flaky'
import { useAuth } from '../contexts/AuthContext';
import TakeMe from './TakeMe';
import { useGlobal } from '../contexts/GlobalContext';
import { useTimer } from 'react-timer-hook'

export default function BrandHeader({ title, options, examDuration, submitExam, timer }) {
  const { currentUser } = useAuth()
  const { progress } = useGlobal()
  const time = new Date()
  time.setSeconds(time.getSeconds() + 600)
  const {
    seconds,
    minutes,
    hours,
    restart
  } = useTimer({ expiryTimestamp: time, onExpire: () => submitExam() })

  React.useEffect(() => {
    if (examDuration !== 0) {
      const newTime = new Date()
      newTime.setSeconds(newTime.getSeconds() + (examDuration * 60))
      restart(newTime)
    }
  }, [examDuration])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Flaky className='mx-2' style={{ fontSize: '35px' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title} - MCQ Exams
          </Typography>
          {options &&
            <>
              <TakeMe fullReload={true} path='/profile'>
                <Button color="inherit" className='mx-2'>Profile</Button>
              </TakeMe>
              <Button color="inherit" className='mx-2' onClick={() => {
                progress.show()
                return setTimeout(() => {
                  currentUser.signOut()
                }, 800)
              }}>SignOut</Button>
            </>
          }
          {(examDuration !== 0 && timer === true) &&
            <div className='exam__timer'>{hours} : {minutes} : {seconds}</div>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}
