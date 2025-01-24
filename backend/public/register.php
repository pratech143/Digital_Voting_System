<?php
include '../config/database.php';  
include '../config/mail_config.php';  

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

//error_log(print_r($data, true)); 

if (!$data) {
    echo json_encode(["success" => false, "message" => "data not received"]);
    exit;
}

$name = $data['full_name'] ?? null;
$gender = $data['gender'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (empty($name) || empty($gender) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

$password_hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $conn->prepare("INSERT INTO users (full_name, gender, email, password_hash, role) VALUES (?, ?, ?, ?, 'voter')");
    $stmt->bind_param("ssss", $name, $gender, $email, $password_hash);
    $stmt->execute();

    $otp = rand(100000, 999999);

    $update_stmt = $conn->prepare("UPDATE users SET email_verification_token = ? WHERE email = ?");
    $update_stmt->bind_param("ss", $otp, $email);
    $update_stmt->execute();

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