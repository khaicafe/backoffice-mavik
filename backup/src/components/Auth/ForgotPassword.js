import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
    //   await authService.sendOtp(mobileNumber);
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await authService.verifyOtpAndResetPassword(mobileNumber, otp, password);
      navigate('/login');
    } catch (error) {
      console.error('Error verifying OTP or resetting password:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
        paddingTop: '20%',
        backgroundColor: '#3f51b5', // Background màu xanh dương
      }}
    >
    <Container  component="main" maxWidth="xs">
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Forgot Password
      </Typography>
      {!isOtpSent ? (
        <>
          <TextField
            label="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSendOtp} fullWidth>
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleVerifyOtp} fullWidth>
            Verify OTP & Reset Password
          </Button>
        </>
      )}
      </Paper>
    </Container>
    </Box>
  );
};

export default ForgotPassword;
