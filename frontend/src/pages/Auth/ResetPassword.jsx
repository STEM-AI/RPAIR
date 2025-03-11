import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logoWrite-re.png";
import bgimg from "../../assets/imgs/aboutus/bg.png";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = ["Send Code", "Verify Code", "Reset Password"];

const ResetPassword = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/\d/.test(newPassword)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(newPassword)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[!@#$%^&*]/.test(newPassword)) {
      setError("Password must contain at least one special character (!@#$%^&*)");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please include a valid email address so we can get back to you");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      // First check if email exists
      const checkEmailResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/password/forget-password/${email}/`
      );
      
      if (checkEmailResponse.status === 200) {
        try {
          // Send verification code using the email from response
          const verificationResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/password/send-verification-code/`,
            { email: checkEmailResponse.data.email }
          );

          if (verificationResponse.status === 200) {
            setMessage("Email sent successfully! Please check your inbox.");
            setActiveStep(1);
            setError("");
          }
        } catch (verificationError) {
          setError("Failed to send verification code. Please try again.");
          setMessage("");
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError("Email not found. Please check your email address.");
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || "Invalid email format");
      } else {
        setError("An error occurred. Please try again later.");
      }
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/password/verify-code/`,
        {
          email,
          code: verificationCode,
        }
      );

      if (response.status === 200) {
        setMessage("Code verified successfully!");
        setActiveStep(2);
        setError("");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setError(error.response.data.message || "Invalid verification code");
      } else {
        setError("Failed to verify code. Please try again.");
      }
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/user/password/reset-password/`,
        {
          email,
          new_password: newPassword,
        }
      );

      if (response.status === 200) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setError(error.response.data.message || "Invalid password format");
      } else {
        setError("Failed to reset password. Please try again.");
      }
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <form className="grid gap-y-4" onSubmit={handleSendCode}>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                required
                aria-describedby="email-error"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-cyan-800 hover:bg-cyan-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Send Code"}
            </button>
          </form>
        );

      case 1:
        return (
          <form className="grid gap-y-4" onSubmit={handleVerifyCode}>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                disabled
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-gray-700 text-sm font-bold mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                required
              />
            </div>

            <button
              type="submit"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-cyan-800 hover:bg-cyan-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Verify Code"}
            </button>
          </form>
        );

      case 2:
        return (
          <form className="grid gap-y-4" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                disabled
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:shadow-md border border-gray-300 rounded py-2 px-4 block w-full"
                required
              />
            </div>

            <button
              type="submit"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-cyan-800 hover:bg-cyan-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Reset Password"}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="relative py-14"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute bg-gray-50 inset-0 bg-opacity-50 z-0"></div>
      <div id="loginForm" className="relative flex bg-white rounded-2xl mb-10 shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl border-2 border-cyan-600">
        <div className="hidden lg:block lg:w-1/3 bg-cover bg-gradient-to-br from-cyan-800 to-cyan-400">
          <div className="flex items-center py-16 flex-col">
            <img src={logo} alt="Logo" className="w-60" />
            <Link
              to={"/register"}
              className="text-center text-white font-bold py-2 border border-white w-36 rounded-full"
            >
              Sign Up
            </Link>
          </div>
        </div>
        
        <div className="w-full p-8 lg:w-1/2 flex flex-col mx-auto">
          <div className="p-4 sm:p-7">
            <div className="text-center mb-8">
              <h1 className="block text-2xl font-bold text-gray-800">
                {activeStep === 0 ? "Forgot Password?" : "Reset Password"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Remember your password? 
                <Link className="text-blue-600 decoration-2 hover:underline font-medium ml-1" to="/login">
                  Login here
                </Link>
              </p>
            </div>

            <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <div className="mt-5">
              {getCurrentForm()}

              {error && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              )}
              {message && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="success">{message}</Alert>
                </Box>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
