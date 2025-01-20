<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User not authenticated'
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['full_name'];
$user_role = $_SESSION['user_role'];

echo json_encode([
    'success' => true,
    'data' => [
        'user_id' => $user_id,
        'user_name' => $user_name,
        'user_role' => $user_role,
    ]
]);