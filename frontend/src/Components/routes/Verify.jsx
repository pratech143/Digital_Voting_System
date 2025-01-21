import React, { useState } from "react";
import axios from "axios";
import baseApi from "../../Api/baseApi";

function VoterVerificationForm() {
  const [formData, setFormData] = useState({
    vdcOrMunicipality: "",
    municipalityName: "",
    wardNumber: "",
    voterCard: null,
    userId:"",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // VDC or Municipality validation
    if (!formData.vdcOrMunicipality) {
      newErrors.vdcOrMunicipality = "Please select VDC or Municipality.";
    }

    // Municipality Name validation (min 3 characters, only letters and spaces)
    if (!formData.municipalityName) {
      newErrors.municipalityName = "Municipality name is required.";
    } else if (!/^[a-zA-Z\s]{3,}$/.test(formData.municipalityName)) {
      newErrors.municipalityName =
        "Municipality name must be at least 3 characters and only letters.";
    }

    // Ward Number validation (positive integers only)
    if (!formData.wardNumber) {
      newErrors.wardNumber = "Ward number is required.";
    } else if (!/^[1-9][0-9]*$/.test(formData.wardNumber)) {
      newErrors.wardNumber = "Ward number must be a positive number.";
    }

    if (!formData.userId) {
      newErrors.userId = "user id is required.";
    } else if (!/^[1-9][0-9]*$/.test(formData.userId)) {
      newErrors.userId = "user id must be a positive number.";
    }

    // Voter Card validation (must be an image file)
    if (!formData.voterCard) {
      newErrors.voterCard = "Please upload your voter card.";
    } else if (
      !["image/jpeg", "image/png", "image/jpg"].includes(formData.voterCard.type)
    ) {
      newErrors.voterCard = "Only JPEG, PNG, and JPG files are allowed.";
    } else if (formData.voterCard.size > 2 * 1024 * 1024) {
      newErrors.voterCard = "File size must be less than 2MB.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepare FormData to send file and other data
      const formDataToSend = new FormData();
      formDataToSend.append("location_type", formData.vdcOrMunicipality);
      formDataToSend.append("location_name", formData.municipalityName);
      formDataToSend.append("ward_number", formData.wardNumber);
      formDataToSend.append("voter_id_image", formData.voterCard);
      formDataToSend.append("user_id", formData.userId);
      formDataToSend.append("role", "voter");
      console.log(formDataToSend);
      console.log(formData.voterCard);

      try {
        const response = await baseApi.post(`public/profile.php`, formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );



        if (response.data.success) {
          setMessage("You will receive mail about verification.");
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Voter Verification
        </h2>
        {message && (
          <p className="text-center text-green-600 font-semibold mb-4">
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* VDC or Municipality */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Choose Local level
            </label>
            <select
              name="vdcOrMunicipality"
              value={formData.vdcOrMunicipality}
              onChange={handleChange}
              className={`block w-full px-4 py-3 border ${errors.vdcOrMunicipality
                  ? "border-red-500"
                  : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
            >
              <option value="">Choose an option</option>
              <option value="VDC">VDC</option>
              <option value="Municipality">Municipality</option>
              <option value="Sub-Metropolitian City">Sub-Metropolitian City</option>
              <option value="Metropolitian City">Metropolitian City</option>
            </select>
            {errors.vdcOrMunicipality && (
              <p className="text-red-500 text-sm mt-2">
                {errors.vdcOrMunicipality}
              </p>
            )}
          </div>

          {/* Municipality Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Municipality/VDC Name
            </label>
            <input
              type="text"
              name="municipalityName"
              value={formData.municipalityName}
              onChange={handleChange}
              placeholder="Enter municipality name"
              className={`block w-full px-4 py-3 border ${errors.municipalityName ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
            />
            {errors.municipalityName && (
              <p className="text-red-500 text-sm mt-2">
                {errors.municipalityName}
              </p>
            )}
          </div>

          {/* Ward Number */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Ward Number
            </label>
            <input
              type="number"
              name="wardNumber"
              value={formData.wardNumber}
              onChange={handleChange}
              placeholder="Enter ward number"
              className={`block w-full px-4 py-3 border ${errors.wardNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
            />
            {errors.wardNumber && (
              <p className="text-red-500 text-sm mt-2">{errors.wardNumber}</p>
            )}
          </div>
          {/* user id*/}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              user Id
            </label>
            <input
              type="number"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="Enter userId"
              className={`block w-full px-4 py-3 border ${errors.userId ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
            />
            {errors.userId && (
              <p className="text-red-500 text-sm mt-2">{errors.userId}</p>
            )}
          </div>

          {/* Voter Card Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Voter Card Scan
            </label>
            <input
              type="file"
              name="voterCard"
              onChange={handleChange}
              accept="image/*"
              className={`block w-full px-4 py-3 ${errors.voterCard ? "border-red-500" : "border-gray-300"
                } text-gray-700 bg-gray-50 border rounded-lg shadow-sm focus:outline-none`}
            />
            {errors.voterCard && (
              <p className="text-red-500 text-sm mt-2">{errors.voterCard}</p>
            )}
          </div>

          <input
            type="text"
            name="role"
            value="voter" readOnly

            className={`block w-full px-4 py-3 border ${errors.municipalityName ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700`}
          />

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-400 transition-all"
            >
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VoterVerificationForm;
