<?php
session_start();
header('Content-Type: application/json');
include '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'candidate') {
    echo json_encode([
        'success' => false,
        'message' => 'User not authenticated or not a candidate',
    ]);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $conn->prepare("
        SELECT u.user_id, u.full_name, u.role, u.email, u.location_id, u.ward_id, 
               l.location_name, w.ward_number, c.symbol_image_path 
        FROM users u
        LEFT JOIN locations l ON u.location_id = l.location_id
        LEFT JOIN wards w ON u.ward_id = w.ward_id
        LEFT JOIN candidates c ON u.user_id = c.user_id
        WHERE u.user_id = ?");
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
                'location' => $user['location_name'],
                'ward' => $user['ward_number'],
                'symbol_image' => $user['symbol_image_path'] ? $user['symbol_image_path'] : null,
            ],
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Candidate not found',
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching candidate details: ' . $e->getMessage(),
    ]);
}
?>