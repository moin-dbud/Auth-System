import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext.jsx';
import {
  ShieldCheck,
  MailCheck,
  KeyRound,
  LogIn,
  LogOut,
  Lock,
  UserPlus,
} from 'lucide-react';

const Header = () => {
  const { userData } = useContext(AppContext);

  const Feature = ({ icon, label }) => (
    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md hover:bg-white/20 transition-all duration-200">
      <div className="text-white">{icon}</div>
      <span className="text-white text-sm sm:text-base leading-snug">{label}</span>
    </div>
  );

  const handleLogin = () => {
    window.location.href = '/login';
  };

  if (!userData) {
    return (
      <header className="relative w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl rounded-3xl p-6 sm:p-10 my-8 mx-auto max-w-6xl overflow-hidden">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-2xl sm:text-4xl font-semibold mb-2">
            Heyy, Developer!
            <img src={assets.hand_wave} className="w-8 h-8" alt="wave emoji" />
          </h1>
          <p className="text-sm sm:text-lg font-light text-white/90 max-w-xl mb-6">
            Welcome to your secure authentication dashboard. Manage users, sessions, and security with confidence. Sign up or log in to access all features!
          </p>
          <button
            onClick={handleLogin}
            className="bg-white text-indigo-600 cursor-pointer font-semibold px-6 py-2 rounded-lg shadow hover:bg-indigo-100 transition-all duration-200"
          >
            Login to Access Dashboard.
          </button>
        </div>
        {/* Decorative Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
      </header>
    );
  }

  return (
    <header className="relative w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl rounded-3xl p-6 sm:p-10 my-8 mx-auto max-w-6xl overflow-hidden">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl sm:text-4xl font-semibold mb-2">
          Heyy, {userData ? userData.name : 'Developer'}!
          <img src={assets.hand_wave} className="w-8 h-8" alt="wave emoji" />
        </h1>
        <p className="text-sm sm:text-lg font-light text-white/90 max-w-xl">
          Welcome to your secure authentication dashboard. Manage users, sessions, and security with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Feature icon={<UserPlus size={22} />} label="User Registration with Username, Email & Password" />
        <Feature icon={<ShieldCheck size={22} />} label="Passwords securely hashed using bcrypt" />
        <Feature icon={<MailCheck size={22} />} label="Email Verification on signup" />
        <Feature icon={<KeyRound size={22} />} label="Password Reset via secure token link" />
        <Feature icon={<LogIn size={22} />} label="JWT-based Login & Session Management" />
        <Feature icon={<Lock size={22} />} label="Protected Routes accessible after login" />
        <Feature icon={<LogOut size={22} />} label="Secure Logout & Token Invalidation" />
      </div>

      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
    </header>
  );
};

export default Header;
