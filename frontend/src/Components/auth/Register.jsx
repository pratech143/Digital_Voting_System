// Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import baseApi from "../../Api/baseApi";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from '../../redux/loadingSlice'; 
import Spinner from "../Spinner";
import Form from "../Form";

const Register = ({ toggleView }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "", gender: "" });
  const [error, setError] = useState("");
  const [passType, setPassType] = useState("password");

  const togglePasswordVisibility = () => {
    setPassType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleInputChange = (e, field) => {
    setError("");
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { full_name, email, password, gender } = formData;
    const fieldErrors = {};

    if (!full_name.trim()) fieldErrors.name = "Name is required.";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) fieldErrors.email = "Invalid email address.";
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) fieldErrors.pass = "Password must be at least 8 characters long and include letters and numbers.";
    if (!gender) fieldErrors.gender = "Gender is required.";

    if (Object.keys(fieldErrors).length > 0) {
      setError(fieldErrors);
      return;
    }

    try {
      const response = await baseApi.post("public/register.php", { full_name, email, password, gender });
      if (response.data.status === "exists") {
        setError({ email: "Email is already taken. Please use another email." });
      } else if (response.data.success) {
        alert("Please verify your email to continue");
        navigate("/otp", { state: { email } });
      } else {
        setError({ general: response.data.message });
      }
    } catch {
      setError({ general: "Something went wrong. Please try again." });
    }
  };

  return (
    <Form
      title="Register to e-मत"
      error={error}
      fields={[
        {
          type: "text",
          placeholder: "Full Name",
          value: formData.full_name,
          onChange: (e) => handleInputChange(e, "full_name"),
          errorKey: "name",
        },
        {
          type: "email",
          placeholder: "Email",
          value: formData.email,
          onChange: (e) => handleInputChange(e, "email"),
          errorKey: "email",
        },
        {
          type: passType,
          isPassword: true,
          value: formData.password,
          onChange: (e) => handleInputChange(e, "password"),
          toggleVisibility: togglePasswordVisibility,
          errorKey: "pass",
        },
        {
          options: ["Male", "Female", "Other"],
          value: formData.gender,
          onChange: (e) => handleInputChange(e, "gender"),
          errorKey: "gender",
        },
      ]}
      buttonText="Register"
      onSubmit={handleSubmit}
      toggleViewText="Login here"
      toggleView={toggleView}
    />
  );
};

export default Register;
