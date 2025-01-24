<?php
session_start();
header('Content-Type: application/json');
include '../config/database.php';

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

if (!$conn || $conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection error: " . $conn->connect_error]));
}

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate JSON input
    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
        exit;
    }

    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    if (!$email || !$password) {
        echo json_encode(["success" => false, "message" => "Email and password are required"]);
        exit;
    }

    // Prepare statement
    $stmt = $conn->prepare("SELECT user_id, full_name, password_hash, email_verified_at, role FROM users WHERE email = ?");
    if (!$stmt) {
        die(json_encode(["success" => false, "message" => "Statement preparation failed: " . $conn->error]));
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        exit;
    }

    $user = $result->fetch_assoc();

    if (is_null($user['email_verified_at'])) {
        echo json_encode(["success" => false, "message" => "Email not verified. Please verify your email to log in."]);
        exit;
    }

    if (!password_verify($password, $user['password_hash'])) {
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        exit;
    }

    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user_role'] = $user['role'];
    
    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user" => [
            "id" => $user['user_id'],
            "name" => $user['full_name'],
            "role" => $user['role'],
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>