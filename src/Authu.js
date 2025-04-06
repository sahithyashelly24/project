import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "./authu.css";
import { Home } from "lucide-react";

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
    <div className="auth-container">
      <nav className="navbar">
      <Link to="/" className="nav-left"><Home size={24} strokeWidth={3} /></Link>
        <h1 className="nav-center">Cognitive Vox</h1>
      </nav>
      <div className="auth-card">
        <h2 className="auth-title">{isForgotPassword ? "Forgot Password" : isLogin ? "Login" : "Sign Up"}</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          {(!isLogin || isForgotPassword) && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
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
              required
            />
          )}
          {isForgotPassword && !showPasswordFields && (
            <>
              <div className="captcha-container">
                <span className="captcha-text">{captcha}</span>
                <button type="button" onClick={() => setCaptcha(generateCaptcha())} className="captcha-refresh">Refresh</button>
              </div>
              <input
                type="text"
                placeholder="Enter CAPTCHA"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
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
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button onClick={handlePasswordReset} className="auth-button">Submit</button>
            </>
          )}
          {!showPasswordFields && (
            <button type="submit" className="auth-button">
              {isForgotPassword ? "Reset Password" : isLogin ? "Login" : "Sign Up"}
            </button>
          )}
        </form>
        <button onClick={() => { setIsLogin(!isLogin); setIsForgotPassword(false); }} className="auth-switch">
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
        <button onClick={() => { setIsForgotPassword(!isForgotPassword); setIsLogin(false); }} className="auth-forgot">
          {isForgotPassword ? "Back to Login" : "Forgot Password?"}
        </button>
      </div>
    </div>
  );
};

export default Authu;