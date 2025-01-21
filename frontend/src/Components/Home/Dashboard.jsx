import React, { useState } from 'react';

// Sample data for candidates and election results (Replace with real data)
const candidates = [
  { name: 'John Doe', party: 'Party A', image: 'path-to-image-1', logo: 'path-to-logo-1', votes: 500000 },
  { name: 'Jane Smith', party: 'Party B', image: 'path-to-image-2', logo: 'path-to-logo-2', votes: 600000 },
  { name: 'Alice Johnson', party: 'Party C', image: 'path-to-image-3', logo: 'path-to-logo-3', votes: 200000 },
  { name: 'Bob Brown', party: 'Party D', image: 'path-to-image-4', logo: 'path-to-logo-4', votes: 150000 },
  // Add more candidates as needed
];

const totalVotes = 1500000; // Total votes casted (sample value)

const ElectionDashboard = () => {
  const [search, setSearch] = useState('');

  // Sort candidates by votes in descending order
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  // Calculate vote percentages
  const calculatePercentage = (votes) => ((votes / totalVotes) * 100).toFixed(2);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-200 min-h-screen font-sans p-8">
      <div className="max-w-screen-xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 flex-col sm:flex-row">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight text-center sm:text-left">Election Dashboard</h1>
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 sm:mt-0 p-3 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72 text-lg"
          />
        </div>

        {/* Election Results Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Election Results</h2>
          <div className="flex flex-col sm:flex-row justify-between space-x-0 sm:space-x-6 mb-8">
            {/* Top Two Candidates */}
            <div className="bg-white p-8 rounded-xl shadow-lg w-full sm:w-1/2 flex items-center space-x-6">
              <div className="flex-1">
                <img
                  src={sortedCandidates[0].image}
                  alt={sortedCandidates[0].name}
                  className="w-20 h-20 rounded-full object-cover shadow-lg"
                />
              </div>
              <div className="flex-1 text-center">
                <h3 className="text-xl font-semibold text-gray-800">{sortedCandidates[0].name}</h3>
                <p className="text-gray-600">{sortedCandidates[0].party}</p>
                <p className="text-lg font-semibold text-blue-600">{sortedCandidates[0].votes} Votes</p>
                <p className="text-md text-gray-500">{calculatePercentage(sortedCandidates[0].votes)}%</p>
              </div>
              <div className="flex-1">
                <img
                  src={sortedCandidates[1].image}
                  alt={sortedCandidates[1].name}
                  className="w-20 h-20 rounded-full object-cover shadow-lg"
                />
              </div>
            </div>
            {/* Candidate Votes Comparison */}
            <div className="flex justify-center items-center sm:w-1/3 mt-4 sm:mt-0">
              <div className="w-1/3 h-0.5 bg-gray-400"></div>
              <p className="text-xl font-semibold text-gray-700 mx-4">
                {sortedCandidates[0].votes} - {calculatePercentage(sortedCandidates[0].votes)}% vs{' '}
                {sortedCandidates[1].votes} - {calculatePercentage(sortedCandidates[1].votes)}%
              </p>
              <div className="w-1/3 h-0.5 bg-gray-400"></div>
            </div>
          </div>

          {/* Votes by Party */}
          <div className="bg-white p-8 rounded-xl shadow-lg w-full sm:w-1/2 mb-8">
            <h3 className="text-xl font-semibold text-gray-600">Votes by Party</h3>
            <div className="h-64 bg-gray-200 rounded-xl mt-4">
              {/* Placeholder for graph */}
              <p className="text-center text-2xl text-gray-500 py-28">Graph Placeholder</p>
            </div>
          </div>
        </div>

        {/* Candidate List Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Other Candidates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCandidates
              .filter((candidate, index) => index > 1)
              .filter((candidate) =>
                candidate.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((candidate, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-6"
                >
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-20 h-20 rounded-full object-cover shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{candidate.name}</h3>
                    <p className="text-gray-600">{candidate.party}</p>
                    <p className="text-lg font-semibold text-blue-600">{candidate.votes} Votes</p>
                    <p className="text-md text-gray-500">{calculatePercentage(candidate.votes)}%</p>
                  </div>
                  <img
                    src={candidate.logo}
                    alt={`${candidate.party} Logo`}
                    className="w-14 h-14 object-contain ml-auto"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Analytics Section */}
        <div>
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-600">Voter Turnout</h3>
              <div className="h-64 bg-gray-200 rounded-xl mt-4">
                {/* Placeholder for graph */}
                <p className="text-center text-2xl text-gray-500 py-28">Graph Placeholder</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-600">Votes by Region</h3>
              <div className="h-64 bg-gray-200 rounded-xl mt-4">
                {/* Placeholder for graph */}
                <p className="text-center text-2xl text-gray-500 py-28">Graph Placeholder</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-600">Votes by Age Group</h3>
              <div className="h-64 bg-gray-200 rounded-xl mt-4">
                {/* Placeholder for graph */}
                <p className="text-center text-2xl text-gray-500 py-28">Graph Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionDashboard;
