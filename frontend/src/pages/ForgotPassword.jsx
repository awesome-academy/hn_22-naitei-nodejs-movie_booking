import React, { useState } from "react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (email.trim() === "") return alert("Please enter your email address.");
    alert("OTP has been sent to your email!");
    setStep(2);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      alert("Please fill in all the fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Password confirmation does not match.");
      return;
    }
    alert("Your password has been successfully reset!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-gray-900 font-bold mb-6 text-center text-2xl">
          Forgot Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-xl hover:bg-primary-dull"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">OTP Code</label>
              <input
                type="text"
                placeholder="Enter the OTP code"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-xl hover:bg-primary-dull"
            >
              Reset Password
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-4 text-gray-700">
          Remember your password?{" "}
          <a href="/login" className="text-primary hover:underline">
            Log in now
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
