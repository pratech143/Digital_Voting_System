import React from 'react';

const Profile = ({ user, handleVerify }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">Your Profile</h2>

        {/* Profile Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Name</h3>
              <p className="text-gray-600">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Verification Status</h3>
              <p className={`text-gray-600 ${user.verified ? 'text-green-500' : 'text-red-500'}`}>
                {user.verified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>
        </div>

        {/* Verify Button */}
        {!user.verified && (
          <div className="text-center">
            <button
              onClick={handleVerify}
              className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Verify Now
            </button>
          </div>
        )}

        {/* Additional Action Section */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={() => alert('Change Profile functionality here')}
            className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Change Profile Picture
          </button>
          <button
            onClick={() => alert('Log out functionality here')}
            className="py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
