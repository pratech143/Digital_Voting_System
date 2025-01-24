<?php
header('Content-Type: application/json');
session_start();
include '../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->prepare("
            SELECT 
                u.user_id, u.full_name, u.email, u.role, u.location_id, u.ward_id, u.verified, u.profile_completed, u.rejected, l.location_name, w.ward_number 
            FROM users u
            LEFT JOIN locations l ON u.location_id = l.location_id
            LEFT JOIN wards w ON u.ward_id = w.ward_id
        ");
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $approvedVoters = [];
            $rejectedVoters = [];
            $pendingVoters = [];

            while ($row = $result->fetch_assoc()) {
                // Fetch the voter ID image
                $voter_id_image_stmt = $conn->prepare("SELECT voter_id_image FROM users WHERE user_id = ?");
                $voter_id_image_stmt->bind_param("i", $row['user_id']);
                $voter_id_image_stmt->execute();
                $voter_id_image_result = $voter_id_image_stmt->get_result();

                if ($voter_id_image_row = $voter_id_image_result->fetch_assoc()) {
                    $row['voter_id_image'] = base64_encode($voter_id_image_row['voter_id_image']);
                }

                // Categorize voters based on their status
                if ($row['verified'] && !$row['rejected'] && $row['role'] == 'voter') {
                    $approvedVoters[] = $row;
                } elseif ($row['rejected']) {
                    $rejectedVoters[] = $row;
                } elseif($row['profile_completed'] && !$row['verified'] && !$row['rejected']) {
                    $pendingVoters[] = $row;
                }
            }

            echo json_encode([
                "success" => true,
                "approved_voters" => $approvedVoters,
                "rejected_voters" => $rejectedVoters,
                "pending_voters" => $pendingVoters
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "No voters found."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error fetching voters: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
