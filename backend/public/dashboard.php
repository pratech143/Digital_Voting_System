<?php
session_start();
header('Content-Type: application/json');

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

    $stmt = $conn->prepare("SELECT user_id, full_name, role, email , profile_completed,verified FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'data' => [
                'user_id' => $user['user_id'],
                'user_name' => $user['full_name'],
                'role' => $user['role'],
                'email' => $user['email'],
                'profile'=> $user['profile_completed'],
                'verified'=>$user['verified']
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