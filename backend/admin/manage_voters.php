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
            SELECT u.user_id, u.full_name, u.email, u.role, u.location_id, u.ward_id, u.voter_id_image_path, u.verified, u.profile_completed, l.location_name, w.ward_number
            FROM users u
            LEFT JOIN locations l 
            ON u.location_id = l.location_id
            LEFT JOIN wards w
            ON u.ward_id = w.ward_id
            WHERE u.status = 'awaiting_admin_approval'
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
    $status = $data['status'] ?? null;

    if (!$user_id || !$status) {
        echo json_encode(["success" => false, "message" => "User ID and status are required"]);
        exit;
    }

    if (!in_array($status, ['verified', 'rejected'])) {
        echo json_encode(["success" => false, "message" => "Invalid status"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("UPDATE users SET status = ?, verified = ? WHERE user_id = ?");
        $verified = ($status === 'verified') ? 1 : 0;
        $stmt->bind_param("sii", $status, $verified, $user_id);
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Voter status updated successfully."
        ]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error updating status: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>