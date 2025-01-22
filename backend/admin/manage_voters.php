<?php
header('Content-Type: application/json');
session_start();
include '../config/database.php';

if ($_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->prepare("
            SELECT u.user_id, u.full_name, u.email, u.role, u.location_id, u.ward_id, 
                   u.voter_id_image_path, u.verified, u.profile_completed, u.rejected, 
                   l.location_name, w.ward_number
            FROM users u
            LEFT JOIN locations l ON u.location_id = l.location_id
            LEFT JOIN wards w ON u.ward_id = w.ward_id
            WHERE u.verified = FALSE AND u.rejected = FALSE AND u.profile_completed = TRUE
        ");
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $voters = [];
            while ($row = $result->fetch_assoc()) {
                $voters[] = $row;
            }

            echo json_encode([
                "success" => true,
                "voters" => $voters
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "No voters are awaiting approval."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error fetching voters: " . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
        exit;
    }

    $user_id = $data['user_id'] ?? null;
    $action = $data['action'] ?? null; // 'approve' or 'reject'

    if (!$user_id || !$action) {
        echo json_encode(["success" => false, "message" => "User ID and action are required"]);
        exit;
    }

    if (!in_array($action, ['approve', 'reject'])) {
        echo json_encode(["success" => false, "message" => "Invalid action"]);
        exit;
    }

    try {
        if ($action === 'approve') {
            // Approve the voter
            $stmt = $conn->prepare("UPDATE users SET verified = TRUE, rejected = FALSE WHERE user_id = ?");
        } else {
            // Reject the voter
            $stmt = $conn->prepare("UPDATE users SET verified = FALSE, rejected = TRUE WHERE user_id = ?");
        }

        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => $action === 'approve' ? "Voter approved successfully." : "Voter rejected successfully."
        ]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error updating status: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>