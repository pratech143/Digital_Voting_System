import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseApi from '@/Api/baseApi';

const VoterList = ({ className }) => {
  const [voters, setVoters] = useState({
    approved: [],
    rejected: [],
    pending: [],
  });
  const [search, setSearch] = useState({
    approved: '',
    rejected: '',
    pending: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await baseApi.get(`admin/listVoters.php`);
        console.log(response.data)
        if (response.data.success) {
          setVoters({
            approved: response.data.approved_voters,
            rejected: response.data.rejected_voters,
            pending: response.data.pending_voters,
          });
        } else {
          setError(response.data.message,'Failed to fetch voters.');
        }
      } catch (err) {
        setError('An error occurred while fetching voters.');
      } finally {
        setLoading(false);
      }
    };

    fetchVoters();
  }, []);

  const handleSearchChange = (e, category) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [category]: e.target.value,
    }));
  };

  const filterVoters = (category) => {
    const keyword = search[category].toLowerCase();
    return voters[category].filter(
      (voter) =>
        voter.full_name.toLowerCase().includes(keyword) ||
        voter.email.toLowerCase().includes(keyword)
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Loading voters...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 font-semibold">{error}</div>
      </div>
    );

  return (
    <div className={`p-4 bg-gray-50 rounded-lg shadow ${className}`}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Voter Management</h1>

      {/* Approved Voters */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-green-600 mb-4">Approved Voters</h2>
        <input
          type="text"
          placeholder="Search approved voters..."
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={search.approved}
          onChange={(e) => handleSearchChange(e, 'approved')}
        />
        {filterVoters('approved').length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterVoters('approved').map((voter) => (
              <li
                key={voter.user_id}
                className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center text-center"
              >
                <img
                  src={`data:image/jpeg;base64,${voter.voter_id_image}`}
                  alt={`${voter.full_name}'s voter ID`}
                  className="w-20 h-20 rounded-full mb-3"
                />
                <strong className="text-gray-700">{voter.full_name}</strong>
                <p className="text-sm text-gray-500">{voter.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No approved voters found.</p>
        )}
      </section>

      {/* Rejected Voters */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Rejected Voters</h2>
        <input
          type="text"
          placeholder="Search rejected voters..."
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          value={search.rejected}
          onChange={(e) => handleSearchChange(e, 'rejected')}
        />
        {filterVoters('rejected').length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterVoters('rejected').map((voter) => (
              <li
                key={voter.user_id}
                className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center text-center"
              >
                <img
                  src={`data:image/jpeg;base64,${voter.voter_id_image}`}
                  alt={`${voter.full_name}'s voter ID`}
                  className="w-20 h-20 rounded-full mb-3"
                />
                <strong className="text-gray-700">{voter.full_name}</strong>
                <p className="text-sm text-gray-500">{voter.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No rejected voters found.</p>
        )}
      </section>

      {/* Pending Voters */}
      <section>
        <h2 className="text-xl font-semibold text-yellow-600 mb-4">Pending Voters</h2>
        <input
          type="text"
          placeholder="Search pending voters..."
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={search.pending}
          onChange={(e) => handleSearchChange(e, 'pending')}
        />
        {filterVoters('pending').length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterVoters('pending').map((voter) => (
              <li
                key={voter.user_id}
                className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center text-center"
              >
                <img
                  src={`data:image/jpeg;base64,${voter.voter_id_image}`}
                  alt={`${voter.full_name}'s voter ID`}
                  className="w-20 h-20 rounded-full mb-3"
                />
                <strong className="text-gray-700">{voter.full_name}</strong>
                <p className="text-sm text-gray-500">{voter.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No pending voters found.</p>
        )}
      </section>
    </div>
  );
};

export default VoterList;
