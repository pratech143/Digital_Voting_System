import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux'; // Import hooks for Redux
import { startLoading, stopLoading } from '../../redux/loadingSlice'; // Import the actions
import Spinner from '../Spinner';
import baseApi from '@/Api/baseApi';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const loading = useSelector((state) => state.loading.isLoading); // Access loading state from Redux
  const dispatch = useDispatch(); // Hook to dispatch actions

  const location = useLocation();
  const email = location.state?.email;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate OTP
    if (!otp.trim()) {
      setError('OTP is required.');
      return;
    }

    // Start loading (show spinner)
    dispatch(startLoading());

    try {
      const response = await baseApi.post(`functions/verify-otp.php`, {email,otp});

      if (response.data.success) {
        setIsSuccess(true);
        setError('');
        alert('OTP Verified Successfully! Please Login to continue');
        navigate('/');
      } else {
        setError('Invalid OTP. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      setError(error.message);
      setIsSuccess(false);
    } finally {
      // Stop loading (hide spinner)
      dispatch(stopLoading());
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
      <img src="/path-to-your-logo.png" alt="Logo" className="w-24 mx-auto mb-6" />
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Verify Your Email</h2>
      <p className="text-center text-gray-600 mb-6">
        An email has been sent to your email address. Please enter the OTP below.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="otp" className="block text-gray-700 font-medium mb-2">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleChange}
            maxLength="6"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {isSuccess && <p className="text-green-500 text-sm text-center mb-4">OTP Verified Successfully!</p>}

        {/* Show the spinner if loading is true */}
        {loading && <Spinner size={48} className="mb-4" />}

        <button type="submit" className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200">
          Submit OTP
        </button>
      </form>
    </div>
  );
};

export default OTP;
