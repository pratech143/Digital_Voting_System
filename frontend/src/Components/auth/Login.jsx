// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import baseApi from "../../Api/baseApi";
import { startLoading, stopLoading } from '../../redux/loadingSlice'; 
import Spinner from "../Spinner";
import Form from "../Form";

const Login = ({ toggleView }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ loginEmail: "", loginPass: "" });
  const [loginError, setLoginError] = useState("");
  const [passType, setPassType] = useState("password");

  const togglePasswordVisibility = () => {
    setPassType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleInputChange = (e, field) => {
    setLoginError("");
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { loginEmail, loginPass } = formData;
    const fieldErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(loginEmail)) fieldErrors.loginEmail = "Invalid email address.";
    if (!loginPass.trim()) fieldErrors.loginPass = "Password is required.";

    if (Object.keys(fieldErrors).length > 0) {
      setLoginError(fieldErrors);
      return;
    }

    try {
      const response = await baseApi.post("public/login.php", { email: loginEmail, pass: loginPass });
      if (response.data.success) {
        alert("Logged in Successfully. Redirecting to Dashboard...");
        navigate("/dashboard");
      } else {
        setLoginError({ general: response.data.message });
      }
    } catch {
      setLoginError({ general: "Something went wrong. Please try again." });
    }
  };

  return (
    <Form
      title="Login to e-मत"
      error={loginError}
      fields={[
        {
          type: "email",
          placeholder: "Email",
          value: formData.loginEmail,
          onChange: (e) => handleInputChange(e, "loginEmail"),
        },
        {
          type: passType,
          isPassword: true,
          value: formData.loginPass,
          onChange: (e) => handleInputChange(e, "loginPass"),
          toggleVisibility: togglePasswordVisibility,
        },
      ]}
      buttonText="Login"
      onSubmit={handleSubmit}
      toggleViewText="Register here"
      toggleView={toggleView}
    />
  );
};

export default Login;
