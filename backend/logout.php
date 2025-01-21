<?php

session_start();

// CORS headers
header("Access-Control-Allow-Origin:*"); // Frontend URL, adjust if necessary
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_unset(); // clear session variables
session_destroy(); // destroy session
header("Location: login.php");
exit;
?>