import React, { useState } from 'react';
import axios from 'axios';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate OTP (optional)
    if (!otp.trim()) {
      setError('OTP is required.');
      return;
    }

    // Send OTP to server for verification using axios
    try {
      const response = await axios.post(
        'http://localhost/xampp/htdocs/Voting-System/backend/functions/verify-otp.php', 
        { otp }
      );

      if (response.data.status === 'success') {
        setIsSuccess(true);
        setError('');
        alert('OTP Verified Successfully!');
        // Optionally redirect or perform other actions after success
      } else {
        setError('Invalid OTP. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setIsSuccess(false);
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

        <button type="submit" className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200">
          Submit OTP
        </button>
      </form>
    </div>
  );
};

export default OTP;