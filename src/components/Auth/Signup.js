import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const Signup = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendDelay, setResendDelay] = useState(0);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await authService.signup(mobileNumber, password);
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await authService.verifySignupOtp(mobileNumber, otp);
      navigate("/login");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResendOtp = async () => {
    try {
      await authService.resendOtp(mobileNumber);
      setResendDelay((resendDelay) =>
        resendDelay === 0 ? 1 : resendDelay * 2
      ); // Exponential backoff
      setTimeout(() => setResendDelay(0), resendDelay * 60000);
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Background màu xám nhạt
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
              Signup
            </Typography>
            <Box component="form" onSubmit={handleSignup} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="mobileNumber"
                label="Mobile Number"
                name="mobileNumber"
                autoComplete="mobile"
                autoFocus
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                disabled={isOtpSent}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isOtpSent}
              />
              {!isOtpSent ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              ) : (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="otp"
                    label="OTP"
                    name="otp"
                    autoComplete="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 1, mb: 2 }}
                    onClick={handleResendOtp}
                    disabled={resendDelay > 0}
                  >
                    {resendDelay > 0
                      ? `Resend OTP in ${resendDelay} minutes`
                      : "Resend OTP"}
                  </Button>
                </>
              )}
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2" onClick={() => navigate("/login")}>
                    Already have an account? Login
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
