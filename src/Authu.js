import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const generateCaptcha = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const Authu = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isForgotPassword) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.username === formData.username && captchaInput === captcha) {
        setShowPasswordFields(true);
      } else {
        setError("Invalid username or CAPTCHA");
      }
    } else if (isLogin) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (
        storedUser &&
        ((storedUser.email === formData.email || storedUser.username === formData.email) &&
          storedUser.password === formData.password)
      ) {
        setUser({ username: storedUser.username });
        navigate("/");
      } else {
        setError("Invalid username/email or password");
      }
    } else {
      localStorage.setItem("user", JSON.stringify(formData));
      setUser({ username: formData.username });
      navigate("/");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      let storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.username === formData.username) {
        storedUser.password = newPassword;
        localStorage.setItem("user", JSON.stringify(storedUser));
        alert("Password reset successfully. Please login with your new password.");
        setIsForgotPassword(false);
        setIsLogin(true);
        setShowPasswordFields(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError("User not found");
      }
    } else {
      setError("Passwords do not match");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold">{isForgotPassword ? "Forgot Password" : isLogin ? "Login" : "Sign Up"}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        {(!isLogin || isForgotPassword) && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border p-2"
            required
          />
        )}
        {!isForgotPassword && (
          <input
            type="text"
            name="email"
            placeholder="Email or Username"
            value={formData.email}
            onChange={handleChange}
            className="border p-2"
            required
          />
        )}
        {!isForgotPassword && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2"
            required
          />
        )}
        {isForgotPassword && !showPasswordFields && (
          <>
            <div className="flex items-center gap-2">
              <span className="border p-2 bg-gray-200 font-bold">{captcha}</span>
              <button type="button" onClick={() => setCaptcha(generateCaptcha())} className="text-blue-500">Refresh</button>
            </div>
            <input
              type="text"
              placeholder="Enter CAPTCHA"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="border p-2"
              required
            />
          </>
        )}
        {showPasswordFields && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2"
              required
            />
            <button onClick={handlePasswordReset} className="bg-blue-500 text-white px-4 py-2">Submit</button>
          </>
        )}
        {!showPasswordFields && (
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            {isForgotPassword ? "Reset Password" : isLogin ? "Login" : "Sign Up"}
          </button>
        )}
      </form>
      <button onClick={() => { setIsLogin(!isLogin); setIsForgotPassword(false); }} className="mt-4 text-blue-500">
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
      </button>
      <button onClick={() => { setIsForgotPassword(!isForgotPassword); setIsLogin(false); }} className="mt-2 text-blue-500">
        {isForgotPassword ? "Back to Login" : "Forgot Password?"}
      </button>
    </div>
  );
};

export default Authu;
