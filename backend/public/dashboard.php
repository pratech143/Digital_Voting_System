<?php
session_start();
header('Content-Type: application/json');

// Include database configuration
include '../config/database.php';

// Check if the user is authenticated
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User not authenticated'
    ]);
    exit;
}

// Get user session data with fallback defaults
$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['full_name'] ?? 'Unknown User';
$role = $_SESSION['role'] ?? 'Unknown Role';

// Prepare and send the JSON response
echo json_encode([
    'success' => true,
    'data' => [
        'user_id' => $user_id,
        'user_name' => htmlspecialchars($user_name, ENT_QUOTES, 'UTF-8'),
        'role' => htmlspecialchars($role, ENT_QUOTES, 'UTF-8'),
    ]
]);
