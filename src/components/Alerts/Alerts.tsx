import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Alert, AlertTitle, Box, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Alerts: React.FC = () => {
  const { alerts, clearAlerts } = useFinance();

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={alerts.length > 0}>
        <Alert 
          severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={clearAlerts}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          <AlertTitle>IMPORTANTE</AlertTitle>
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {alerts.map((alert, index) => (
              <Box key={index} sx={{ py: 0.5 }}>
                {alert}
              </Box>
            ))}
          </Box>
        </Alert>
      </Collapse>
    </Box>
  );
};

export default Alerts;