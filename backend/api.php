<?php
// Simulate a simple response for now
header('Access-Control-Allow-Origin: *'); // Enable CORS for all origins
header('Content-Type: application/json'); // Set the response type to JSON

// Simulated data
$data = [
    ['id' => 1, 'name' => 'Alice', 'votes' => 120],
    ['id' => 2, 'name' => 'Bob', 'votes' => 98],
];

// Return the data as JSON
echo json_encode($data);
?>
