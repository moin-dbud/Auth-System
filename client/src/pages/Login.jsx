import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setIsLoggedIn, getUserData } = useContext(AppContext);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      console.log(`Attempting to ${state === "Sign Up" ? "register" : "login"} with email: ${email}`);

      if (state === "Sign Up") {
        console.log('Sending registration request...');
        const { data } = await axios.post("/api/auth/register", {
          name,
          email,
          password,
        });

        console.log('Registration response:', data);

        if (data.success) {
          // Store the token in localStorage with the correct key
          if (data.token) {
            localStorage.setItem('token', data.token);
            console.log('Token stored in localStorage');
          }
          toast.success(data.message || 'Registration successful');
          setIsLoggedIn(true);
          await getUserData();
          navigate("/");
        } else {
          toast.error(data.message || 'Registration failed');
        }
      } else {
        console.log('Sending login request...');
        const { data } = await axios.post("/api/auth/login", {
          email,
          password,
        });

        console.log('Login response:', data);

        if (data.success) {
          // Store the token in localStorage
          if (data.token) {
            localStorage.setItem('token', data.token);
            console.log('Token stored in localStorage');
          }
          toast.success(data.message || 'Login successful');
          setIsLoggedIn(true);
          console.log('⏳ Calling getUserData...');
          await getUserData();
          console.log('✅ getUserData finished, navigating...');
          navigate("/");
        }
        else {
          toast.error(data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      toast.error(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <h1
        onClick={() => navigate("/")}
        className="text-3xl absolute left-5 sm:left-20 top-5 w-3
         sm:w-52 font-bold text-gray-800 cursor-pointer  max-sm:text-2xl max-md:flex-1 h-auto"
      >
        Auth System
      </h1>
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300">
        <h2 className="text-3xl font-semibold text-white text-center mb-3 ">
          {state === "Sign Up" ? "Create account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email ID"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password "
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password
          </p>

          <button
            className="w-full px-5 py-2.5 rounded-full bg-indigo-500 text-white disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-center text-gray-400 text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer "
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-center text-gray-400 text-xs mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer "
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
