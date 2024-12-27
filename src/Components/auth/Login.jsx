import React from 'react'

function Login() {
     const [email,setEmail]=useState("")
     const [pass,setPass]=useState("")
     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     const passRegex = /^.{8,}$/;
      // function to show and hide password on the input field
  const showPassword = () => {
    setPassType(passType === "password" ? "text" : "password");
    setImg(img === "hide" ? "show" : "hide")
  }

    //function to toggle between login and register page
    const pageTransition = () => {
        setDisplay(display === "hidden" ? "block" : "hidden")
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

  return (
    <div className={`absolute ${display} w-[75%] h-[85%] border-2 border-gray-300 bg-white rounded-2xl `}>
          <div className="relative flex w-full h-full flex-col-reverse md:flex-row">


            {/* Right Column with input field */}
            <div className="  flex-1 bg-white p-6 flex flex-col justify-center  border-gray-300 rounded-2xl">
              <form className="space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold mb-4">Login to e-मत</h1>
                </div>
                      <p>{error != "" ?
                      <span>{error}</span> :""}</p>
                <div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-[80%] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-slate-300 "
                  />
                </div>

                <div className="inline-flex items-center w-[80%] ">
                  <input
                    type={passType}
                    id="password"
                    value={pass}
                    onChange={handleInputChange}
                    placeholder="enter Password"
                    className="p-3 rounded-l-lg shadow-sm focus:outline-none bg-slate-300  w-full"
                  />
                  <div className="flex items-center bg-slate-300 pt-[15px] pr-[5px] pb-[15px] rounded-r-lg ">
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
  )
}

export default Login