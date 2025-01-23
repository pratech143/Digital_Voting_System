<?php
header('Content-Type: application/json');
include '../config/database.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $location_id = $data['location'] ?? null;
    $ward_id = $data['ward'] ?? null;
    $start_date = $data['start_date'] ?? null;
    $end_date = $data['end_date'] ?? null;

    if (!$location_id || !$ward_id || !$start_date || !$end_date) {
        echo json_encode(["success" => false, "message" => "All fields are required"]);
        exit;
    }

    try {
        $election_name = "Election for Location " . $location_id . " Ward " . $ward_id;
        $is_active = true;
        
        $stmt = $conn->prepare("INSERT INTO elections (election_name, start_date, end_date, is_active) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $election_name, $start_date, $end_date, $is_active);
        $stmt->execute();
        $election_id = $stmt->insert_id;

        $stmt = $conn->prepare("
            SELECT c.candidate_id, u.full_name, p.name AS post_name 
            FROM candidates c
            JOIN users u ON c.user_id = u.user_id
            JOIN posts p ON c.post_id = p.post_id
            WHERE p.location_id = ? AND p.ward_id = ?
        ");
        $stmt->bind_param("ii", $location_id, $ward_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $candidates = [];
        while ($row = $result->fetch_assoc()) {
            $candidates[] = $row;
        }

        if (empty($candidates)) {
            echo json_encode(["success" => false, "message" => "No candidates found for this ward and location"]);
            exit;
        }

        foreach ($candidates as $candidate) {
            $stmt = $conn->prepare("INSERT INTO election_candidates (election_id, candidate_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $election_id, $candidate['candidate_id']);
            $stmt->execute();
        }

        echo json_encode(["success" => true, "message" => "Election created successfully."]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error creating election: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>