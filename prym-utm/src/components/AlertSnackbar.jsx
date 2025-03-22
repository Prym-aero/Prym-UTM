import React, { useState, useEffect } from "react";
import { Snackbar, Slide, LinearProgress } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const TransitionLeft = (props) => <Slide {...props} direction="left" />;

const AlertSnackbar = ({ alert, setAlert }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (alert.open) {
      setProgress(100);
      const interval = setInterval(() => {
        setProgress((oldProgress) => (oldProgress > 0 ? oldProgress - 1 : 0));
      }, 30); // Adjust speed (30ms for 3s total)

      setTimeout(() => {
        setAlert({ ...alert, open: false });
        clearInterval(interval);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [alert.open]);

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={() => setAlert({ ...alert, open: false })}
      TransitionComponent={TransitionLeft}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <div style={{ width: "300px" }}>
        <MuiAlert
          elevation={6}
          variant="filled"
          
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </MuiAlert>
        <LinearProgress
          variant="determinate"
          value={progress}
          style={{ height: "4px" }}
        />
      </div>
    </Snackbar>
  );
};

export default AlertSnackbar;
