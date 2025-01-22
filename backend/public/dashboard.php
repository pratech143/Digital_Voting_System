<?php
session_start();
header('Content-Type: application/json');

// Include database configuration
ini_set('session.cookie_lifetime', 86400); // 1 day
ini_set('session.gc_maxlifetime', 86400);
include '../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User not authenticated',
    ]);
    exit();
}

// Retrieve user session data
$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['full_name'] ?? 'Unknown User';
$role = $_SESSION['role'] ?? 'Unknown Role';

// Send JSON response
echo json_encode([
    'success' => true,
    'data' => [
        'user_id' => $user_id,
        'user_name' => $user_name,
<<<<<<< HEAD
        'role' =>$role,
    ]
=======
        'role' => $role,
    ],
>>>>>>> e2eedea016960444bf3359dd6a3959f15bd6a05c
]);
?>