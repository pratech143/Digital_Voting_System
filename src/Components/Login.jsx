import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate=useNavigate()
  const[lname,setLname]=useState("")
  const[fname,setFname]=useState("")
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passRegex = /^.{8,}$/;
  const [passType, setPassType] = useState("password")
  const [img, setImg] = useState("hide")
  const [LoginDisplay, setLoginDisplay] = useState("hidden") 
  const [RegDisplay, setRegDisplay] = useState("block")

  const[error,setError]=useState("")
  const[LoginError,setLoginError]=useState("")


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (LoginEmail && LoginPass) {
      try {
        const response = await axios.post('http://localhost/xampp/htdocs/Voting-System/backend/functions/login.php', {
          email: LoginEmail,
          pass: LoginPass,
        });

        if (response.data.status === "success") {
          // Successfully logged in
          console.log("Login successful");
          alert("Logged in Successfully. Redirecting to Dashboard...")
          setTimeout(()=>{
            navigate('/dashboard')
          },300)
          
        }
     else {
          setError(response.data.message); // Display error message
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      }
    }
     else {
      setLoginError("Both Email and Password are required.");
    }
  };

//email and password for login
const [LoginEmail,setLoginEmail]=useState("")
  const [LoginPass,setLoginPass]=useState("")
  

  // function to show and hide password on the input field
  const showPassword = () => {
    setPassType(passType === "password" ? "text" : "password");
    setImg(img === "hide" ? "show" : "hide")
  }

  //function to toggle between login and register page
  const pageTransition = () => {
    setLoginDisplay(LoginDisplay === "hidden" ? "block" : "hidden")
    setRegDisplay(RegDisplay === "block" ?  "hidden" : "block" )
  }

  //function to handle input errors
  const handleInputChange=(e,type)=>{
    switch (type) {
      case "email":
        setError("");
        setEmail(e.target.value)
          if(e.target.value===""){
            setError("email section cannot be empty!!")
            console.log(error);
            
          }
          else if(!emailRegex.test(e.target.value)) {
            setError("email format didnt match!!");
            console.log(error);
            
          }
        break;
        case "pass":
          setError("");
          setPass(e.target.value)
            if(e.target.value===""){
              setError("password section cannot be empty!!")
              console.log(error);
            }
            else if(!passRegex.test(e.target.value)) {
              setError("Password must be atleast 8 characters long!!")
              console.log(error);
            }
          break;
    
      default:
        break;
    }
  }

  //function to send data to backend
  const RegisterSubmit=async (e)=>{
    e.preventDefault();

    if(lname!="" && fname !="" && email !="" && pass != ""){
      try {
        const response = await axios.post('http://localhost/xampp/htdocs/Voting-System/backend/functions/register.php', {
          fname,
          lname,
          email,
          pass,
        });
        console.log('Registration successful:', response.data);
        alert('Registration successful!');
      } catch (err) {
        console.error('Error during registration:', err.response.data);
        setError('Registration failed. Please try again.');
      }
    }else{
      setError("all fields are required")
    }
  }
  return (
    <div>
      <div className=" flex items-center justify-center h-screen bg-blue-to-white">
        <div className={`absolute ${RegDisplay} md:w-[75%] md:h-[85%] border-2 border-gray-300 bg-white rounded-2xl `}>

          {/* regster page starts here */}
          <div className="relative flex w-full h-full flex-col md:flex-row">
            {/* Left Column with Blue Background */}
            <div className="flex-1 bg-bluish text-white flex flex-col items-center justify-center p-6 border-gray-300 rounded-2xl rounded-bl-[25%] md:rounded-bl-none  rounded-br-[15%] md:rounded-tr-[25%] ">
              <img src="/images/logo.png" alt="Logo" className="w-64 mb-6" />
              <h1 className="text-4xl font-semibold mb-4">Welcome to e-मत</h1>
              <p className="text-lg">Already have an account? </p>
              <button
                onClick={pageTransition}
                className="w-[40%] bg-bluish inline text-white py-3 rounded-lg hover:bg-slate-800 focus:outline-none mx-auto"
              >
                Login here
              </button>
            </div>

            {/* Right Column with input fields*/}
            <div className="flex-1 bg-white p-6 flex flex-col justify-center border-gray-300 rounded-2xl">
              <form className="space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold mb-4">Register to e-मत</h1>
                  <p>{error !="" ? <span className="text-red-700">{error}</span> : <span></span>}</p>
                  <input
                    type="text"
                    id="firstName"
                    value={fname}
                    onChange={(e)=>setFname(e.target.value)}
                    placeholder="First name"
                    className="w-[80%] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-slate-300 "
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="lastName"
                    value={lname}
                    onChange={(e)=>setLname(e.target.value)}
                    placeholder="Last name"
                    className="w-[80%] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-slate-300 "
                  />
                </div>
                <div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>handleInputChange(e,"email")}
                    className="w-[80%] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-slate-300 "
                  />
                </div>
                <div className="inline-flex items-center w-[80%] ">
                  <input
                    type={passType}
                    id="password"
                    value={pass}
                    onChange={(e)=>handleInputChange(e,"pass")}
                    placeholder="new Password"
                    className="p-3 rounded-l-lg shadow-sm focus:outline-none bg-slate-300  w-full"
                  />
                  <div className="flex items-center bg-slate-300 pt-[14px] pr-[5px] pb-[15px] rounded-r-lg ">
                    <img
                      src={`icons/${img}.png`}
                      alt="hide icon"
                      className="w-5 cursor-pointer focus:ring-2"
                      onClick={showPassword}
                    />
                  </div>
                </div>

                <button
                
                  onClick={RegisterSubmit}
                  className="w-[40%] bg-bluish inline text-white py-3 rounded-lg hover:bg-slate-800 focus:outline-none mx-auto"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* register form ends here and login form starts here */}

        <div className={`absolute ${LoginDisplay} md:w-[75%] md:h-[85%] border-2 border-gray-300 bg-white rounded-2xl `}>
          <div className="relative flex w-full h-full flex-col-reverse md:flex-row">


            {/* Right Column with input field */}
            <div className="  flex-1 bg-white p-6 flex flex-col justify-center  border-gray-300 rounded-2xl">
              <form className="space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold mb-4">Login to e-मत</h1>
                </div>
                      <p>{LoginError != "" ?
                      <span className="text-red-500">{LoginError}</span> :""}</p>
                <div>
                  <input
                    type="email"
                    id="email"
                    value={LoginEmail}
                    onChange={(e)=>{setLoginEmail(e.target.value)}}
                    placeholder="Email"
                    className="w-[80%] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-slate-300 "
                  />
                </div>

                <div className="inline-flex items-center w-[80%] ">
                  <input
                    type={passType}
                    id="password"
                    value={LoginPass}
                    onChange={(e)=>{setLoginPass(e.target.value)}}
                    placeholder="enter Password"
                    className="p-3 rounded-l-lg shadow-sm focus:outline-none bg-slate-300  w-full"
                  />
                  <div className="flex items-center bg-slate-300 pt-[15px] pr-[5px] pb-[14px] rounded-r-lg ">
                    <img
                      src={`icons/${img}.png`}
                      alt="hide icon"
                      className="w-5 cursor-pointer focus:ring-2"
                      onClick={showPassword}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={handleLoginSubmit}
                  className="w-[40%]  bg-bluish inline text-white py-3 rounded-lg hover:bg-slate-800  focus:outline-none  mx-auto"
                >
                  Login
                </button>

              </form>
            </div>

            <div className="flex-1 bg-bluish text-white flex flex-col items-center justify-center p-6 border-gray-300 rounded-2xl rounded-bl-[25%] md:rounded-br-none  rounded-br-[15%] md:rounded-tl-[25%]">
              <img src="/images/logo.png" alt="Logo" className="w-64 mb-6" />
              <h1 className="text-4xl font-semibold mb-4">Welcome Back to e-मत</h1>
              <p className="text-lg">Don't have an account?{" "}</p>
              <button
                onClick={pageTransition}
                className="w-[40%]  bg-bluish inline text-white py-3 rounded-lg hover:bg-slate-800  focus:outline-none  mx-auto">
                Register here</button>
            </div>

            {/* login form ends here */}
          </div>
        </div>
      </div>

    </div>




  );
};

export default Login;
