import React from "react";
import { Link } from "react-router";

const Dashboard = ({ user, votingStatus, elections, handleLogout }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
    {/* Navigation Bar */}
<nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
  <div className="max-w-6xl mx-auto flex justify-between items-center">
    <div className="text-lg font-bold">
      <Link to="/home" className="hover:text-gray-200">
        Digital Voting System
      </Link>
    </div>
    <ul className="flex space-x-6">
      <li>
        <Link
          to="/home"
          className="hover:text-gray-200 cursor-pointer"
        >
          Home
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


      {/* Dashboard Content */}
      <div className="flex-1 p-6">
        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-2">
            Welcome, {user.name || "User"}!
          </h1>
          <p className="text-gray-600">Your dashboard is ready.</p>
        </div>

        {/* Profile Summary */}
        <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Profile Summary</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded ${
                user.verified
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.verified ? "Verified" : "Unverified"}
            </span>
          </p>
        </div>

        {/* Voting Status */}
        <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">Voting Status</h2>
          <p>
            {votingStatus
              ? "You have already voted in the current election."
              : "You have not voted yet. Make sure to participate!"}
          </p>
          {!votingStatus && (
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Vote Now
            </button>
          )}
        </div>

        {/* Upcoming Elections */}
        <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">Upcoming Elections</h2>
          <ul className="list-disc list-inside">
            {elections.length > 0 ? (
              elections.map((election, index) => (
                <li key={index} className="text-gray-700">
                  <strong>{election.name}</strong> - {election.date}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No upcoming elections available.</p>
            )}
          </ul>
        </div>

        {/* Apply for Verification */}
        <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">Verification</h2>
          <p>
            {user.verified
              ? "You are already verified."
              : "To participate in elections, upload your verification document."}
          </p>
          {!user.verified && (
            <button
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Apply for Verification
            </button>
          )}
        </div>

        {/* Voting History */}
        <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">Voting History</h2>
          <ul className="list-disc list-inside">
            {user.votingHistory && user.votingHistory.length > 0 ? (
              user.votingHistory.map((history, index) => (
                <li key={index} className="text-gray-700">
                  {history.electionName} - {history.date}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No voting history available.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
