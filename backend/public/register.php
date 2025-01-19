<?php
include '../config/database.php';
include '../config/mail_config.php';
// Set content type for response
header('Content-Type: application/json');

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173"); // Frontend URL, adjust if necessary
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Read the raw POST data (JSON)
$data = json_decode(file_get_contents('php://input'), true);

// If JSON data is not valid
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
    exit;
}

// Extract data from the request
$name = $data['full_name'] ?? null;
$gender = $data['gender'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

// Validate the fields
if (empty($name) || empty($gender) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

// Validate the email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

// Hash the password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Ensure correct path for including database and mail config
include __DIR__ . '/../config/database.php';  // Adjust path based on file location
include __DIR__ . '/../config/mail_config.php';  // Adjust path based on file location

// Insert the new user into the database
try {
    $stmt = $conn->prepare("INSERT INTO users (full_name, gender, email, password_hash, role) VALUES (?, ?, ?, ?, 'voter')");
    $stmt->bind_param("ssss", $name, $gender, $email, $password_hash);
    $stmt->execute();

    // Generate OTP for email verification
    $otp = rand(100000, 999999);

    // Update the user record with the OTP
    $update_stmt = $conn->prepare("UPDATE users SET email_verification_token = ? WHERE email = ?");
    $update_stmt->bind_param("ss", $otp, $email);
    $update_stmt->execute();

    // Send OTP email
    $subject = "Email Verification for Election System";
    $message = "Your OTP code is: $otp";

    if (sendEmail($email, $subject, $message)) {
        echo json_encode([
            "success" => true,
            "message" => "Registration successful. Please verify your email using the OTP sent to $email"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Registration successful, but failed to send OTP email"
        ]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error during registration: " . $e->getMessage()]);
}
?>