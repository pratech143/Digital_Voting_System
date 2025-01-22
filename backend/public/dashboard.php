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

$user_id = $_SESSION['user_id'];

try {
    // Fetch user details from the database
    $stmt = $conn->prepare("SELECT user_id, full_name, role, email FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Send JSON response
        echo json_encode([
            'success' => true,
            'data' => [
                'user_id' => $user['user_id'],
                'user_name' => $user['full_name'],
                'role' => $user['role'],
                'email' => $user['email'],
            ],
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'User not found',
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching user details: ' . $e->getMessage(),
    ]);
}
?>