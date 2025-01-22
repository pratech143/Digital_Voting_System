<?php
$servername = 'localhost';
$dbname = 'election_system';
$username = 'root';
$password = '';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// CORS configuration
$allowed_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_domains = ['http://localhost:5173']; // Specify allowed domains

if (in_array($allowed_origin, $allowed_domains)) {
    header('Access-Control-Allow-Origin: ' . $allowed_origin); // Set the allowed origin dynamically
    header('Access-Control-Allow-Credentials: true');          // Allow credentials
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Allowed methods
    header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allowed headers
} else {
    header('HTTP/1.1 403 Forbidden'); // Deny access for other origins
    echo json_encode(["message" => "Origin not allowed"]);
    exit();
}

// Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // Cache the preflight response for 1 day
    http_response_code(200);
    exit();
}

// Continue with normal request handling...
?>