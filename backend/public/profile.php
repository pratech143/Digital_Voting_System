<?php
header('Content-Type: application/json');
session_start();
include '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if required files and data are present
    if (!isset($_FILES['voter_id_image']) || !isset($_POST['user_id'])) {
        echo json_encode(["success" => false, "message" => "Missing image or user_id"]);
        exit;
    }

    $user_id = $_SESSION['user_id'] ?? null;

    if (!$user_id) {
        echo json_encode(["success" => false, "message" => "User not authenticated"]);
        exit;
    }

    // Get other form data
    $location_name = $_POST['location_name'] ?? null;
    $location_type = $_POST['location_type'] ?? null;
    $ward_number = $_POST['ward_number'] ?? null;
    $role = $_POST['role'] ?? null;

    if (empty($location_name) || empty($location_type) || empty($ward_number) || empty($role)) {
        echo json_encode(["success" => false, "message" => "All fields are required"]);
        exit;
    }

    try {
        $voter_id_image = $_FILES['voter_id_image'];

        // Check for upload errors
        if ($voter_id_image['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("Error uploading file: " . $voter_id_image['error']);
        }

        // Read the image file as binary data
        $image_data = file_get_contents($voter_id_image['tmp_name']);

        // Fetch the user's current rejection status
        $stmt = $conn->prepare("SELECT rejected FROM users WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user['rejected'] == 1) {
            // Reset rejection status to 0
            $update_rejected_status = $conn->prepare("UPDATE users SET rejected = 0 WHERE user_id = ?");
            $update_rejected_status->bind_param("i", $user_id);
            $update_rejected_status->execute();
        }

        // Fetch or insert location
        $stmt = $conn->prepare("SELECT location_id FROM locations WHERE location_name = ? AND location_type = ?");
        $stmt->bind_param("ss", $location_name, $location_type);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $location_id = $result->fetch_assoc()['location_id'];
        } else {
            $insert_location = $conn->prepare("INSERT INTO locations (location_name, location_type) VALUES (?, ?)");
            $insert_location->bind_param("ss", $location_name, $location_type);
            $insert_location->execute();
            $location_id = $insert_location->insert_id;
        }

        // Fetch or insert ward
        $stmt = $conn->prepare("SELECT ward_id FROM wards WHERE ward_number = ? AND location_id = ?");
        $stmt->bind_param("ii", $ward_number, $location_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $ward_id = $result->fetch_assoc()['ward_id'];
        } else {
            $insert_ward = $conn->prepare("INSERT INTO wards (ward_number, location_id) VALUES (?, ?)");
            $insert_ward->bind_param("ii", $ward_number, $location_id);
            $insert_ward->execute();
            $ward_id = $insert_ward->insert_id;
        }

        // Update user profile with the image and other details
        $stmt = $conn->prepare("
            UPDATE users 
            SET location_id = ?, ward_id = ?, role = ?, voter_id_image = ?, profile_completed = TRUE, verified = FALSE 
            WHERE user_id = ?
        ");
        $stmt->bind_param("iisss", $location_id, $ward_id, $role, $image_data, $user_id);
        $stmt->send_long_data(3, $image_data); // Send binary data
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Profile updated successfully. Awaiting admin approval."
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "message" => "Error updating profile: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
