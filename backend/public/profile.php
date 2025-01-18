<?php
header('Content-Type: application/json');
session_start();
include '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
        exit;
    }

    $user_id = $_SESSION['user_id'] ?? null;

    if (!$user_id) {
        echo json_encode(["success" => false, "message" => "User not authenticated"]);
        exit;
    }

    $location_name = $data['location_name'] ?? null;
    $location_type = $data['location_type'] ?? null;
    $ward_number = $data['ward_number'] ?? null;
    $role = $data['role'] ?? null;
    $voter_id_image_base64 = $data['voter_id_image'] ?? null;

    if (empty($location_name) || empty($location_type) || empty($ward_number) || empty($role) || empty($voter_id_image_base64)) {
        echo json_encode(["success" => false, "message" => "All fields are required"]);
        exit;
    }

    try {
        $upload_dir = '../uploads/voter_ids/';
        $image_data = base64_decode($voter_id_image_base64);

        if (!$image_data) {
            throw new Exception("Invalid voter ID image data");
        }

        $image_name = "voter_" . $user_id . "_" . time() . ".png";
        $voter_id_image_path = $upload_dir . $image_name;

        if (!file_put_contents($voter_id_image_path, $image_data)) {
            throw new Exception("Failed to save voter ID image");
        }

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

        $stmt = $conn->prepare("
            UPDATE users 
            SET location_id = ?, ward_id = ?, role = ?, voter_id_image_path = ?, profile_completed = TRUE, verified = FALSE 
            WHERE user_id = ?
        ");
        $stmt->bind_param("iissi", $location_id, $ward_id, $role, $voter_id_image_path, $user_id);
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Profile updated successfully. Awaiting admin approval."
        ]);
    } 
    catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error updating profile: " . $e->getMessage()]);
    }
}
 else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}

?>