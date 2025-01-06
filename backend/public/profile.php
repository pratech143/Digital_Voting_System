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

    $name = $data['full_name'] ?? null;
    $gender = $data['gender'] ?? null;
    $location_id = $data['location_id'] ?? null;
    $ward_id = $data['ward_id'] ?? null;
    $role = $data['role'] ?? null;
    $voter_id_image = $data['voter_id_image'] ?? null;

    if (empty($name) || empty($gender) || empty($location_id) || empty($role) || empty($voter_id_image)) {
        echo json_encode(["success" => false, "message" => "All required fields must be provided"]);
        exit;
    }

    try {
        $upload_dir = '../uploads/voter_ids/';
        $voter_id_image_path = $upload_dir . basename($voter_id_image['name']);
        move_uploaded_file($voter_id_image['tmp_name'], $voter_id_image_path);
        
        $stmt = $conn->prepare("UPDATE users SET full_name = ?, gender = ?, location_id = ?, ward_id = ?, role = ?, voter_id_image_path = ?, profile_completed = TRUE WHERE user_id = ?");
    }
}