import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Authu = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(isLogin ? { username: formData.email } : { username: formData.username });
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold">{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        {!isLogin && <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="border p-2" />}
        <input type="email" name="email" placeholder="Email or Username" value={formData.email} onChange={handleChange} className="border p-2" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="mt-4 text-blue-500">
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default Authu;