import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the PHP backend
        axios.get('http://localhost/Voting-System/backend/api.php')
            .then(response => {
                setCandidates(response.data); // Store the data in state
            })
            .catch(err => {
                setError(err.message); // Handle any errors
            });
    }, []);

    return (
        <div>
            <h1>Candidate List</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <ul>
                {candidates.map(candidate => (
                    <li key={candidate.id}>
                        {candidate.name}: {candidate.votes} votes
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Candidates;
