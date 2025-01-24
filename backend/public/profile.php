<?php
header('Content-Type: application/json');
session_start();
include '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['voter_id_image']) || !isset($_POST['user_id'])) {
        echo json_encode(["success" => false, "message" => "Missing image or user_id"]);
        exit;
    }

    // Get user ID from session
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

        // Validate the uploaded file
        if ($voter_id_image['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("Error uploading file: " . $voter_id_image['error']);
        }

        // Ensure the file is an image (basic validation)
        $file_info = getimagesize($voter_id_image['tmp_name']);
        if (!$file_info) {
            throw new Exception("Uploaded file is not a valid image.");
        }

        // Read the image binary data
        $image_data = file_get_contents($voter_id_image['tmp_name']);
        if (!$image_data) {
            throw new Exception("Failed to read image file contents.");
        }

        // Fetch or insert the location
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

        // Fetch or insert the ward
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

        // Update the user's profile with the provided data
        $stmt = $conn->prepare("
            UPDATE users 
            SET location_id = ?, ward_id = ?, role = ?, voter_id_image = ?, profile_completed = TRUE, verified = FALSE 
            WHERE user_id = ?
        ");
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        // Bind the parameters and send binary image data
        $stmt->bind_param("iibsi", $location_id, $ward_id, $role, $image_data, $user_id);

        if (!$stmt->execute()) {
            throw new Exception("Failed to execute statement: " . $stmt->error);
        }

        echo json_encode([
            "success" => true,
            "message" => "Profile updated successfully. Awaiting admin approval."
        ]);
    } catch (Exception $e) {
        // Log the error and return a JSON response
        error_log("Error: " . $e->getMessage());
        echo json_encode([
            "success" => false,
            "message" => "Error updating profile: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>