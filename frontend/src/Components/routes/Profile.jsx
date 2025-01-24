import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import baseApi from '../../Api/baseApi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await baseApi.post(`public/dashboard.php`, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      
        setUser(response.data);
        

        setLoading(false);
        console.log(response);
      } catch (error) {
        setError('Error fetching user data',error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin border-4 border-t-4 border-blue-600 rounded-full w-16 h-16"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  if (!user) return null;
  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {console.log(user.data)}
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">Your Profile</h2>

        {/* Profile Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Name</h3>
              <p className="text-gray-600">{user.data.user_name}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">{user.data.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Role</h3>
              <p className="text-gray-600">{user.data.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">User Id</h3>
              <p className="text-gray-600">{user.data.user_id}</p>
            </div>
          </div>

          {user.data.role != "admin" && <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Verification Status</h3>
              <p
                className={`text-gray-600 ${(user.data.verified===1)
                    ? 'text-green-500'
                    :  (user.data.profile === 1&& user.data.verified===0 && user.data.rejected===0)
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }`}
              >
                {(user.data.verified===1)
                  ? 'Verified':(user.data.rejected===1)
                  ?'rejected': (user.data.profile === 1&& user.data.verified===0 && user.data.rejected===0)
                    ? 'Pending'
                    : 'Not Verified'}
              </p>
            </div>

          </div>}
        </div>

        {/* Verify Button */}
        {(!user.verified && user.data.role != "admin") && (
          <div className="text-center">
            <Link to="/verify">
              <button

                className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Verify Now
              </button>
            </Link>
          </div>
        )}


      </div>
    </div>
  );
};

export default Profile;