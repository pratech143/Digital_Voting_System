<?php
$servername = 'localhost';
$dbname = 'election_system';
$username = 'root';
$password = '';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$allowed_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($allowed_origin, ['http://localhost:5173','http://localhost:5174'])) {
    header('Access-Control-Allow-Origin: ' . $allowed_origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
} else {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(["message" => "Origin not allowed"]);
    exit;
}

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

?>