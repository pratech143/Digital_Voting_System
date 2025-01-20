<?php
header('Content-Type: application/json');
include '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
        exit;
    }
    error_log("Received Email: $email");
    error_log("Received OTP: $otp");
    $email = $data['email'] ?? null;
    $otp = $data['otp'] ?? null;

    if (!$email || !$otp) {
        echo json_encode(["success" => false, "message" => "Email and OTP are required"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND email_verification_token = ?");
        $stmt->bind_param("ss", $email, $otp);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $update_stmt = $conn->prepare("UPDATE users SET email_verified_at = NOW(), email_verification_token = NULL WHERE email = ?");
            $update_stmt->bind_param("s", $email);
            $update_stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "OTP verified successfully. Your email has been verified."
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid OTP or email."]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error verifying OTP: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>