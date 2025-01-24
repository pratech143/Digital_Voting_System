import React, { useState, useEffect } from "react";
import baseApi from "../../Api/baseApi";
import VoterList from "./VoterList";

const AdminDashboard = () => {
  const [electionStage, setElectionStage] = useState("Pre-Election"); // Default stage
  const [search, setSearch] = useState("");
  const [stageCompleted, setStageCompleted] = useState({
    "Pre-Election": false,
    "During Election": false,
    "Post-Election": false,
  });

  const [candidates, setCandidates] = useState([]);
  const [candidateForm, setCandidateForm] = useState({
    post: "",
    name: "",
    party: "",
    symbol: "",
  });
  const [errors, setErrors] = useState({});
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for modal image
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Function to handle image click
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setImageModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setImageModalOpen(false);
    setSelectedImage("");
  };

  const handleAdvanceStage = () => {
    if (electionStage === "Pre-Election") {
      setElectionStage("During Election");
    } else if (electionStage === "During Election") {
      setElectionStage("Post-Election");
    }
  };

  const handleApproval = async (userId) => {
    try {
      const response = await baseApi.post(`admin/manage_voters.php`, {
        action: "approve",
        user_id: userId,
      });

      if (response.data.success) {
        // console.log(response.data);
      } else {
        console.error("Failed to approve voter:", response.data.message);
        
      }
    } catch (error) {
      console.error("Error approving voter:", error);
    }
  };

  const handleRejection = async (userId) => {
    try {
      const response = await baseApi.post(`admin/manage_voters.php`, {
        action: "reject",
        user_id: userId,
      });

      if (response.data.success) {
        // console.log(response.data);
      } else {
        console.error("Failed to approve voter:", response.data.message);
      }
    } catch (error) {
      console.error("Error approving voter:", error);
    }
  };

  const markStageComplete = () => {
    setStageCompleted((prev) => ({
      ...prev,
      [electionStage]: true,
    }));
  };

  const isStageLocked = (stage) => {
    const stages = ["Pre-Election", "During Election", "Post-Election"];
    const currentIndex = stages.indexOf(electionStage);
    const targetIndex = stages.indexOf(stage);

    return targetIndex > currentIndex || !stageCompleted[electionStage];
  };

  const handleCandidateFormChange = (e) => {
    const { name, value } = e.target;
    setCandidateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  useEffect(() => {
    const fetchVotersData = async () => {
      try {
        const response = await baseApi.get(`admin/manage_voters.php`);
        // console.log(response.data);
        if (response.data.success) {
          setVoters(response.data.voters || ["success"]);
        }
      } catch (error) {
        // console.log("Error fetching voter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVotersData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!candidateForm.post.trim()) newErrors.post = "Post is required.";
    if (!candidateForm.name.trim()) newErrors.name = "Name is required.";
    if (!candidateForm.party.trim()) newErrors.party = "Party name is required.";
    if (!candidateForm.symbol.trim()) newErrors.symbol = "Symbol is required.";
    return newErrors;
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      if (!userId || !electionId || !postId) {
        setMessage("Please fill all fields.");
        return;
      }

      setLoading(true);
      setMessage("");

      try {
        const response = await baseApi.post(`admin/manage_voters.php`, {
          user_id: userId,
          action: "approve",
          election_id: electionId,
          post_id: postId,
        });

        if (response.data.success) {
          setMessage(response.data.message);
        } else {
          setMessage(response.data.message || "Failed to add candidate.");
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("An error occurred while adding the candidate.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-200 min-h-screen font-sans p-8">
      {/* Modal to display the full image */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div className="relative bg-white p-4 rounded-lg">
            <img
              src={selectedImage}
              alt="Full view"
              className="w-auto h-auto max-w-[90%] max-h-[80vh] object-contain"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-gray-800 p-2 rounded-full"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Admin Panel
          </h1>
          <input
            type="text"
            placeholder="Search voters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-lg"
          />
        </div>

        {/* Election Stage Selection */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            Select Election Stage
          </h2>
          <div className="flex space-x-4">
            {["Pre-Election", "During Election", "Post-Election"].map((stage) => (
              <button
                key={stage}
                disabled={isStageLocked(stage)}
                onClick={() => setElectionStage(stage)}
                className={`px-6 py-3 rounded-full font-semibold ${isStageLocked(stage)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : electionStage === stage
                    ? "bg-blue-600 text-white"
                    : "bg-blue-400 text-white"
                  }`}
              >
                {stage}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={markStageComplete}
              className="px-6 py-3 rounded-full bg-green-500 text-white font-semibold"
            >
              Mark Current Stage as Complete
            </button>
          </div>
        </div>

        {/* Verify Voters Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Verify Voters</h2>
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <p className="text-lg font-semibold text-gray-700">Loading voters...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {voters
                .filter((voter) =>
                  voter.full_name.toLowerCase().includes(search.toLowerCase())
                )
                .map((voter, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-lg flex flex-col space-y-4"
                  >
                    <img
                      src={`data:image/jpeg/jpg;base64,${voter.voter_id_image}`}
                      alt={`${voter.full_name}'s document`}
                      className="w-full h-40 object-cover rounded-lg border-2 border-blue-500 cursor-pointer"
                      onClick={() => handleImageClick(`data:image/jpeg;base64,${voter.voter_id_image}`)} // On click, open modal
                    />

                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-800">{voter.full_name}</h3>
                      <p className="text-gray-600">Email: {voter.email}</p>
                      <p className="text-gray-600">user Id: {voter.user_id}</p>
                      <div className="flex justify-center space-x-4 mt-4">
                        <button
                          onClick={() => handleApproval(voter.user_id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejection(voter.user_id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

<VoterList/>
        {/* Add Candidate Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Add Candidate</h2>
          <form
            onSubmit={handleAddCandidate}
            className="space-y-6 p-6 bg-white rounded-xl shadow-lg"
          >
            <input
              type="text"
              name="post"
              value={candidateForm.post}
              onChange={handleCandidateFormChange}
              placeholder="Post"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="name"
              value={candidateForm.name}
              onChange={handleCandidateFormChange}
              placeholder="Candidate Name"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="party"
              value={candidateForm.party}
              onChange={handleCandidateFormChange}
              placeholder="Party"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="file"
              name="symbol"
              value={candidateForm.symbol}
              onChange={handleCandidateFormChange}
              placeholder="Symbol"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg"
              >
                Add Candidate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
