<?php
session_start();
header('Content-Type: application/json');
include '../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User not authenticated'
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['full_name'];
$role = $_SESSION['role'];

echo json_encode([
    'success' => true,
    'data' => [
        'user_id' => $user_id,
        'user_name' => $user_name,
        'role' => $role,
    ]
]);