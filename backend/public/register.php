<?php
header("Access-Control-Allow-Origin: *");
session_start();
require_once 'Digital_Voting_System/backend/config/database.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $full_name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['pass'];
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $role = 'voter';
    $ward_id = isset($_POST['ward_id']) ? intval($_POST['ward_id']) : null;
    $location_id = isset($_POST['location_id']) ? intval($_POST['location_id']) : null;

    $fieldErrors = [];
    if (empty($full_name)) $fieldErrors['name'] = "Full name is required.";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $fieldErrors['email'] = "Invalid email address.";
    if (strlen($password) < 8 || !preg_match("/[A-Za-z].*\d|\d.*[A-Za-z]/", $password)) {
        $fieldErrors['pass'] = "Password must be at least 8 characters long and include letters and numbers.";
    }

    $checkEmailQuery = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $checkEmailQuery);

    if ($result->num_rows > 0) {
        $fieldErrors['email'] = "Email is already taken. Please use another.";
    }

    if (!empty($fieldErrors)) {
        echo json_encode(['status' => 'error', 'message' => $fieldErrors]);
        $conn->close();
        exit;
    }

    $insertQuery = "INSERT INTO users (full_name, email, password_hash, role, ward_id, location_id, verified) 
                    VALUES ('$full_name', '$email', '$hashedPassword', '$role', " . 
                    ($ward_id ?? 'NULL') . ", " . ($location_id ?? 'NULL') . ", 0)";

    if (mysqli_query($conn, $insertQuery)) {
        echo json_encode(['status' => 'success', 'message' => 'Registration successful!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Registration failed.']);
    }

    $conn->close();
}
?>