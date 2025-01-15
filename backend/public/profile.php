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
    $name = $_SESSION['full_name'] ?? null;
    $gender = $_SESSION['gender'] ?? null;

    if (!$user_id) {
        echo json_encode(["success" => false, "message" => "User not authenticated"]);
        exit;
    }
    
    $location_id = $data['location_id'] ?? null;
    $ward_id = $data['ward_id'] ?? null;
    $role = $data['role'] ?? null;
    $voter_id_image = $data['voter_id_image'] ?? null;

    if (empty($location_id) || empty($role) || empty($voter_id_image)) {
        echo json_encode(["success" => false, "message" => "All required fields must be provided"]);
        exit;
    }

    try {
        // upload Voter image
        $upload_dir = '../uploads/voter_ids/';
        $voter_id_image_path = $upload_dir . basename($voter_id_image['name']);
        move_uploaded_file($voter_id_image['tmp_name'], $voter_id_image_path);

        // update profile
        $stmt = $conn->prepare("UPDATE users SET location_id = ?, ward_id = ?, role = ?, voter_id_image_path = ?, profile_completed = TRUE WHERE user_id = ?, full_name = ? gender = ?");
        $stmt->bind_param("ssssssi", $location_id, $ward_id, $role, $voter_id_image_path, $user_id, $full_name, $gender);
        $stmt->execute();

        //awaiting admin verification
        $stmt_status = $conn->prepare("UPDATE users SET status = 'awaiting_admin_approval' WHERE user_id = ?");
        $stmt_status->bind_param("i", $user_id);
        $stmt_status->execute();

        echo json_encode([
            "success" => true,
            "message" => "Profile updated successfully. Awaiting admin approval."
        ]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error updating profile: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>