import axios from "axios";
import { useState } from "react";
import AlertSnackbar from "../components/AlertSnackbar";
import { Navigate } from "react-router-dom";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [Alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { email }
      );
      console.log("OTP sent successfully:", response.data);
      setMessage(response.data.message);
      showAlert(response.data.message, "success");
      setStep(2);
    } catch (error) {
      console.error("Error sending OTP:", error);
      showAlert("Error sending OTP", "error");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email, // Make sure email is included
        otp,   // Ensure OTP is correctly inputted
      });
  
      console.log("OTP Verified Successfully:", response.data);
      setStep(3);
      setMessage(response.data.message);
      showAlert(response.data.message, "success");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };
  

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/reset-password",
        { email, password }
      );
      console.log("Password reset successfully:", response.data);
      setMessage(response.data.message);
      showAlert(response.data.message, "success");
      Navigate("/");
    } catch (error) {
      console.log("error in resetting password:", error);
      showAlert("Error resetting password", "error");
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          {step === 1
            ? "Forgot Password"
            : step === 2
            ? "Verify OTP"
            : "Reset Password"}
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full p-2 mb-2 border rounded"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 mb-2 border rounded"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 mb-2 border rounded"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 mb-2 border rounded"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              className={`w-full py-2 rounded ${
                newPassword &&
                confirmPassword &&
                newPassword === confirmPassword
                  ? "bg-red-500 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
              disabled={
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
            >
              Reset Password
            </button>
          </>
        )}

        {message && <p className="text-red-500 mt-2">{message}</p>}
      </div>

      <AlertSnackbar alert={Alert} setAlert={setAlert} />
    </>
  );
};

export default ResetPassword;
