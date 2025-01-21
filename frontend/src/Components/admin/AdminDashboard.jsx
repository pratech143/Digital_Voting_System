import React, { useState } from "react";

const AdminPanel = () => {
  const [electionStage, setElectionStage] = useState("Pre-Election"); // Default stage
  const [search, setSearch] = useState("");
  const [stageCompleted, setStageCompleted] = useState({
    "Pre-Election": false,
    "During Election": false,
    "Post-Election": false,
  });

  const voters = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      documentPhoto: "https://via.placeholder.com/300", // Placeholder for document photo
      age: 30,
      address: "123 Main St, Cityville",
      verified: false,
    },
    {
      name: "Bob Brown",
      email: "bob@example.com",
      documentPhoto: "https://via.placeholder.com/300",
      age: 45,
      address: "456 Elm St, Townville",
      verified: true,
    },
    // Add more voters as needed
  ];

  const handleAdvanceStage = () => {
    if (electionStage === "Pre-Election") {
      setElectionStage("During Election");
    } else if (electionStage === "During Election") {
      setElectionStage("Post-Election");
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

    // Allow advancing to the next stage or accessing the current stage, lock otherwise
    if (targetIndex === currentIndex + 1 && stageCompleted[electionStage]) {
      return false;
    }
    return targetIndex > currentIndex || !stageCompleted[electionStage];
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-200 min-h-screen font-sans p-8">
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
                className={`px-6 py-3 rounded-full font-semibold ${
                  isStageLocked(stage)
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {voters
              .filter((voter) =>
                voter.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((voter, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg flex flex-col space-y-4"
                >
                  <img
                    src={voter.documentPhoto}
                    alt={`${voter.name}'s document`}
                    className="w-full h-40 object-cover rounded-lg border-2 border-blue-500"
                  />
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">{voter.name}</h3>
                    <p className="text-gray-600">Email: {voter.email}</p>
                    <p className="text-gray-600">Age: {voter.age}</p>
                    <p className="text-gray-600">Address: {voter.address}</p>
                  </div>
                  <button
                    className={`w-full py-2 rounded-full text-white ${
                      voter.verified ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {voter.verified ? "Verified" : "Verify"}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
