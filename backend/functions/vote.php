<?php
session_start();
header('Content-Type: application/json');
include '../config/database.php';

if ($_SESSION['user_role'] !== 'voter' && $_SESSION['user_role'] !== 'candidate') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit;
}

$user_id = $_SESSION['user_id']; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['post_id']) || !isset($_POST['candidate_id'])) {
        echo json_encode(["success" => false, "message" => "Missing post or candidate ID"]);
        exit;
    }

    $post_id = $_POST['post_id'];
    $candidate_id = $_POST['candidate_id'];

    $stmt = $conn->prepare("SELECT ward_id, location_id FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Voter not found."]);
        exit;
    }

    $voter = $result->fetch_assoc();
    $voter_ward_id = $voter['ward_id'];
    $voter_location_id = $voter['location_id'];

    //if the candidate exists for the given post and is from the same ward as the voter
    $stmt = $conn->prepare("
        SELECT c.candidate_id, p.ward_id 
        FROM candidates c
        JOIN posts p ON c.post_id = p.post_id
        WHERE p.post_id = ? AND c.candidate_id = ?
    ");
    $stmt->bind_param("ii", $post_id, $candidate_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Invalid candidate for this post."]);
        exit;
    }

    $candidate = $result->fetch_assoc();
    $candidate_ward_id = $candidate['ward_id'];

    if ($voter_ward_id !== $candidate_ward_id) {
        echo json_encode(["success" => false, "message" => "You can only vote for candidates in your ward."]);
        exit;
    }

    $voter_id_hash = hash('sha256', $user_id . $post_id . $candidate_id . time());

    try {
        $stmt = $conn->prepare("SELECT * FROM votes WHERE voter_id_hash = ?");
        $stmt->bind_param("s", $voter_id_hash);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "You have already voted for this candidate."]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO votes (voter_id_hash, candidate_id) VALUES (?, ?)");
        $stmt->bind_param("si", $voter_id_hash, $candidate_id);
        $stmt->execute();

        echo json_encode(["success" => true, "message" => "Vote cast successfully!"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error casting vote: " . $e->getMessage()]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>