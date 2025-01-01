<?php
header("Access-Control-Allow-Origin: *");
session_start();

// Include database configuration
include 'Digital_Voting_System/backend/config/database.php';

// Initialize an array to store field errors
$fieldErrors = [];

try {
    // Sanitize and validate input
    $full_name = isset($_POST['name']) ? trim($conn->real_escape_string($_POST['name'])) : null;
    $email = isset($_POST['email']) ? trim($conn->real_escape_string($_POST['email'])) : null;
    $password = isset($_POST['pass']) ? $_POST['pass'] : null;
    $ward_id = isset($_POST['ward_id']) ? intval($_POST['ward_id']) : null;
    $location_id = isset($_POST['location_id']) ? intval($_POST['location_id']) : null;

    // Validate input fields
    if (empty($full_name)) {
        $fieldErrors['name'] = "Full name is required.";
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $fieldErrors['email'] = "Invalid email address.";
    }

    if (empty($password) || strlen($password) < 8 || !preg_match("/[A-Za-z].*\d|\d.*[A-Za-z]/", $password)) {
        $fieldErrors['pass'] = "Password must be at least 8 characters long and include both letters and numbers.";
    }

    // Check for validation errors
    if (!empty($fieldErrors)) {
        echo json_encode(['status' => 'error', 'message' => $fieldErrors], 300);
        exit;
    }

    // Check if email already exists
    $checkEmailQuery = "SELECT 1 FROM users WHERE email = ?";
    $stmt = $conn->prepare($checkEmailQuery);
    if (!$stmt) {
        throw new Exception("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => ['email' => 'Email is already taken. Please use another.']]);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Prepare the SQL query
    $insertQuery = "INSERT INTO users (full_name, email, password_hash, role, ward_id, location_id, verified) 
                    VALUES (?, ?, ?, 'voter', ?, ?, 0)";
    $stmt = $conn->prepare($insertQuery);
    if (!$stmt) {
        throw new Exception("Error preparing statement: " . $conn->error);
    }

    // Bind parameters to prevent SQL injection
    $stmt->bind_param("sssii", $full_name, $email, $hashedPassword, $ward_id, $location_id);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['status' => 200, 'message' => 'Registration successful!', "Success" => true]);
    } else {
        throw new Exception("Error executing query: " . $stmt->error);
    }
} catch (Exception $e) {
    // Catch any exceptions and return error message
    echo json_encode(['status' => 500, 'message' => $e->getMessage(), "Success" => false]);
} finally {
    // Close connection
    if (isset($conn)) {
        $conn->close();
    }
}
?>