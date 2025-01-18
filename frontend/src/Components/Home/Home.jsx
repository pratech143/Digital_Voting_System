import React from "react";
import { Link } from "react-router-dom";

const Home = ({ user, handleLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-lg font-bold">
            <Link to="/dashboard" className="hover:text-gray-200">
              Digital Voting System
            </Link>
          </div>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/dashboard"
                className="hover:text-gray-200 cursor-pointer"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:text-gray-200 cursor-pointer"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/elections"
                className="hover:text-gray-200 cursor-pointer"
              >
                Elections
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                className="hover:text-gray-200 cursor-pointer"
              >
                History
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome Section */}
      <main className="flex-1 max-w-6xl mx-auto py-10 px-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h1>
          <p className="text-gray-700">
            Thank you for logging in to the Digital Voting System. Here you can
            manage your profile, participate in elections, and view your voting
            history.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white py-4 px-6 rounded-lg text-center hover:bg-blue-700 shadow-md"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/elections"
            className="bg-green-600 text-white py-4 px-6 rounded-lg text-center hover:bg-green-700 shadow-md"
          >
            View Elections
          </Link>
          <Link
            to="/profile"
            className="bg-yellow-600 text-white py-4 px-6 rounded-lg text-center hover:bg-yellow-700 shadow-md"
          >
            Edit Profile
          </Link>
          <Link
            to="/history"
            className="bg-gray-600 text-white py-4 px-6 rounded-lg text-center hover:bg-gray-700 shadow-md"
          >
            View Voting History
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
