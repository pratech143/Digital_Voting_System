import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [passType, setPassType] = useState("password")
  const [img,setImg]=useState("hide")
  const showPassword = () => {
    setPassType(passType === "password" ? "text" : "password");
    setImg(img==="hide" ? "show" :"hide")
  }
  return (
    <div className="flex items-center justify-center h-screen bg-blue-to-white">
      <div className="w-[75%] h-[85%] border-2 border-gray-300 bg-white rounded-2xl ">
        <div className="relative flex w-full h-full">
          {/* Left Column with Blue Background */}
          <div className="flex-1 bg-bluish text-white flex flex-col items-center justify-center p-6  border-gray-300 rounded-2xl rounded-br-[15%] rounded-tr-[25%]">
            <img src="/images/logo.png" alt="Logo" className="w-64 mb-6" />
            <h1 className="text-4xl font-semibold mb-4">Welcome to e-मत</h1>
            <p className="text-lg">
              Already have an account?{" "}
              <Link to="" className="text-blue-300 hover:text-blue-400">
              Login here
              </Link>
            </p>
          </div>

          {/* Right Column with White Background */}
          <div className="flex-1 bg-white p-6 flex flex-col justify-center  border-gray-300 rounded-2xl">
            <form className="space-y-4">
              <div>
                <h1 className="text-2xl font-semibold mb-4">Register to e-मत</h1>

                <input
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  className="w-[80%] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-slate-300 "
                />
              </div>
              <div>

                <input
                  type="text"
                  id="lastName"
                  placeholder="Last name"
                  className="w-[80%] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-slate-300 "
                />
              </div>
              <div>

                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="w-[80%] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-slate-300 "
                />
              </div>
              <div className="inline-flex items-center w-[80%] ">
                <input
                  type={passType}
                  id="password"
                  placeholder="new Password"
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
                className="w-[40%]  bg-bluish inline text-white py-3 rounded-lg hover:bg-slate-800  focus:outline-none  mx-auto"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
