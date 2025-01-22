<?php
header('Content-Type: application/json');
session_start();
include '../config/database.php';

// Check if the user is an admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the input data (election name, start date, end date)
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
        exit;
    }

    $election_name = $data['election_name'] ?? null;
    $start_date = $data['start_date'] ?? null;
    $end_date = $data['end_date'] ?? null;
    $is_active = $data['is_active'] ?? false;

    // Validate the inputs
    if (empty($election_name) || empty($start_date) || empty($end_date)) {
        echo json_encode(["success" => false, "message" => "All fields are required"]);
        exit;
    }

    if (strtotime($start_date) >= strtotime($end_date)) {
        echo json_encode(["success" => false, "message" => "Start date must be before the end date"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO elections (election_name, start_date, end_date, is_active) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $election_name, $start_date, $end_date, $is_active);

        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Election created successfully"
        ]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error creating election: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>