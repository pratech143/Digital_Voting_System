import React, { useState ,useEffect} from "react";
import baseApi from "../../Api/baseApi";

const AdminPanel = () => {
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

  const voters = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      documentPhoto: "https://via.placeholder.com/300",
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await baseApi.get(`admin/manage_voters.php`);
        if (response.data.success) {
          console.log(response.data);
          // Process and set the data here
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  const validateForm = () => {
    const newErrors = {};
    if (!candidateForm.post.trim()) newErrors.post = "Post is required.";
    if (!candidateForm.name.trim()) newErrors.name = "Name is required.";
    if (!candidateForm.party.trim()) newErrors.party = "Party name is required.";
    if (!candidateForm.symbol.trim()) newErrors.symbol = "Symbol is required.";
    return newErrors;
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setCandidates((prev) => [...prev, candidateForm]);
      setCandidateForm({ post: "", name: "", party: "", symbol: "" });
      setErrors({});
    }
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

        {/* Add Candidate Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Add Candidate</h2>
          <form onSubmit={handleAddCandidate} className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">Post</label>
              <input
                type="text"
                name="post"
                value={candidateForm.post}
                onChange={handleCandidateFormChange}
                className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.post
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter post (e.g., Mayor)"
              />
              {errors.post && (
                <p className="text-red-500 text-sm mt-1">{errors.post}</p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={candidateForm.name}
                onChange={handleCandidateFormChange}
                className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter candidate's name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Party</label>
              <input
                type="text"
                name="party"
                value={candidateForm.party}
                onChange={handleCandidateFormChange}
                className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.party
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter party name"
              />
              {errors.party && (
                <p className="text-red-500 text-sm mt-1">{errors.party}</p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Symbol</label>
              <input
                type="file"
                name="symbol"
                value={candidateForm.symbol}
                onChange={handleCandidateFormChange}
                className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.symbol
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter party symbol"
              />
              {errors.symbol && (
                <p className="text-red-500 text-sm mt-1">{errors.symbol}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
            >
              Add Candidate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
