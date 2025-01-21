import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import baseApi from "../../Api/baseApi";
import { useDispatch, useSelector } from 'react-redux'; // Import hooks for Redux
import { startLoading, stopLoading } from '../../redux/loadingSlice'; // Import the actions
import Spinner from '../Spinner';


const InputField = ({ type, placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={className}
  />
);

const PasswordField = ({ passType, value, onChange, toggleVisibility, className }) => (
  <div className="inline-flex items-center w-[80%]">
    <input
      type={passType}
      placeholder="Enter Password"
      value={value}
      onChange={onChange}
      className={`p-3 bg-slate-300 rounded-l-lg w-full ${className}`}
    />
    <button
      type="button"
      onClick={toggleVisibility}
      className="bg-slate-300 p-3 rounded-r-lg"
    >
      <img
        src={`icons/${passType === "password" ? "hide" : "show"}.png`}
        alt="Toggle visibility"
        className="w-7"
      />
    </button>
  </div>
);

const SelectField = ({ options, value, onChange, className }) => (
  <select
    value={value}
    onChange={onChange}
    className={`p-3 bg-slate-300 rounded-lg w-[80%] ${className}`}
  >
    <option value="" disabled>
      Select Gender
    </option>
    {options.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ))}
  </select>
);

const Form = ({
  title,
  error,
  fields,
  buttonText,
  onSubmit,
  toggleViewText,
  toggleView,
  loading,
}
) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    <h1 className="text-2xl font-semibold mb-4">{title}</h1>
    {error.general && <p className="text-red-700">{error.general}</p>}
    {console.log(error)}
    {fields.map(({ type, placeholder, value, onChange, isPassword, errorKey, options }, index) => (
      <div key={index} className="space-y-1">
        {isPassword ? (
          <PasswordField
            passType={type}
            value={value}
            onChange={onChange}
            toggleVisibility={fields[index].toggleVisibility}
          />
        ) : options ? (
          <SelectField
            options={options}
            value={value}
            onChange={onChange}
            className="w-[80%] p-3 bg-slate-300 rounded-lg"
          />
        ) : (
          <InputField
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-[80%] p-3 bg-slate-300 rounded-lg"
          />
        )}
        {error[errorKey] && <p className="text-red-700">{error[errorKey]}</p>}
      </div>
    ))}
  
    <button
  type="submit"
  disabled={loading} // Disable the button during loading
  className={`w-[40%] bg-bluish text-white py-3 rounded-lg hover:bg-slate-800 mx-auto ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
>
  {loading ? <Spinner size={20} className="inline-block" /> : buttonText}
</button>

    {toggleViewText && (
      <button type="button" onClick={toggleView} className="text-bluish">
        {toggleViewText}
      </button>
    )}
  </form>
);


const Login = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.isLoading);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    gender: "",
    loginEmail: "",
    loginPass: "",
  });
  const [view, setView] = useState("login");
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passType, setPassType] = useState("password");

  const togglePasswordVisibility = () => {
    setPassType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleInputChange = (e, field) => {
    setError("");
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e, isRegister) => {
    e.preventDefault();

    const { full_name, email, password, gender, loginEmail, loginPass } = formData;
    const fieldErrors = {};

    // Input validation
    if (isRegister) {
      if (!full_name.trim()) fieldErrors.name = "Name is required.";
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) fieldErrors.email = "Invalid email address.";
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        fieldErrors.password = "Password must be at least 8 characters long and include letters and numbers.";
      }
      if (!gender) fieldErrors.gender = "Gender is required.";
    } else {
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(loginEmail)) fieldErrors.loginEmail = "Invalid email address.";
      if (!loginPass.trim()) fieldErrors.loginPass = "Password is required.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      if (isRegister) {
        setError(fieldErrors);
      } else {
        setLoginError(fieldErrors);
      }
      return;
    }

    const endpoint = isRegister ? "register.php" : "login.php";
    const data = isRegister
      ? { full_name, email, password, gender }
      : { email: loginEmail, password: loginPass };

    // Start loading spinner

    dispatch(startLoading());

    try {
      const response = await baseApi.post(`public/${endpoint}`, data);
      console.log(response.data);
      console.log(data)
      if (response.data.success) {
        if (!isRegister) {
          
          navigate("/dashboard");
        } else {
          
          navigate("/otp", { state: { email } });
        }
      } else {
        setError({ general: response.data.message });
      }
    } catch {
      setError({ general: "Something went wrong. Please try again." });
    } finally {
      // Stop loading spinner\

      dispatch(stopLoading());
    }
  };


  const toggleView = () => setView((prev) => (prev === "login" ? "register" : "login"));

  return (
    <div className="flex items-center justify-center h-screen bg-blue-to-white">
      <div className="absolute md:w-[75%] md:h-[85%] border-2 border-gray-300 bg-white rounded-2xl">
        <div className="relative flex flex-col md:flex-row w-full h-full">
          {view === "register" ? (
            <div className="flex-1 bg-bluish text-white flex flex-col items-center justify-center p-6 border-gray-300 rounded-2xl rounded-bl-[25%] md:rounded-bl-none rounded-br-[15%] md:rounded-tr-[25%]">
              <img src="/images/logo.png" alt="Logo" className="w-64 mb-6" />
              <h1 className="text-4xl font-semibold mb-4">Welcome to e-मत</h1>
              <p className="text-lg">Already have an account?</p>
              <button
                onClick={toggleView}
                className="w-[40%] bg-bluish text-white py-3 rounded-lg hover:bg-slate-800 mx-auto"
              >
                Login here
              </button>
            </div>
          ) : (
            <div className="flex-1 order-2 bg-bluish text-white flex flex-col items-center justify-center p-6 border-gray-300 rounded-2xl rounded-bl-[25%] md:rounded-br-none rounded-br-[15%] md:rounded-tl-[25%]">
              <img src="/images/logo.png" alt="Logo" className="w-64 mb-6" />
              <h1 className="text-4xl font-semibold mb-4">Welcome Back to e-मत</h1>
              <p className="text-lg">Don't have an account?</p>
              <button
                onClick={toggleView}
                className="w-[40%] bg-bluish text-white py-3 rounded-lg hover:bg-slate-800 mx-auto"
              >
                Register here
              </button>
            </div>
          )}
          <div className="flex-1 bg-white p-6 flex flex-col justify-center">
            {view === "register" ? (
              <Form
                title="Register to e-मत"
                error={error}
                fields={[
                  {
                    type: "text",
                    placeholder: "name",
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
                    errorKey: "password",
                  },
                  {
                    options: ["Male", "Female", "Other"],
                    value: formData.gender,
                    onChange: (e) => handleInputChange(e, "gender"),
                    errorKey: "gender",
                  },
                ]}
                buttonText="Register"
                onSubmit={(e) => handleSubmit(e, true)}
                loading={loading}
                

              />



            ) : (
              <Form
                className="order-1"
                title="Login to e-मत"
                error={loginError}
                fields={[
                  {
                    type: "email",
                    placeholder: "Email",
                    value: formData.loginEmail,
                    errorKey: "loginEmail",
                    onChange: (e) => handleInputChange(e, "loginEmail"),
                  },
                  {
                    type: passType,
                    isPassword: true,
                    errorKey: "loginPass",
                    value: formData.loginPass,
                    onChange: (e) => handleInputChange(e, "loginPass"),
                    toggleVisibility: togglePasswordVisibility,
                  },
                ]}
                buttonText="Login"
                onSubmit={(e) => handleSubmit(e, false)}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;