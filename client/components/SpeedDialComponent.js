import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Fab } from '@mui/material';

export default function SpeedDialComponent({ actions, mainClick, title }) {
  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      {actions &&
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.click}
            />
          ))}
        </SpeedDial>
      }
      {!actions &&
        <Fab
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          onClick={mainClick}
          variant='extended'
        >
          <SpeedDialIcon sx={{ mr: 1 }} />
          {title}
        </Fab>
      }
    </Box>
  );
}
