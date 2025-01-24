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
            WHERE u.verified = FALSE AND u.rejected = FALSE AND u.profile_completed = TRUE
        ");
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $voters = [];
            while ($row = $result->fetch_assoc()) {
                $voter_id_image_stmt = $conn->prepare("SELECT voter_id_image FROM users WHERE user_id = ?");
                $voter_id_image_stmt->bind_param("i", $row['user_id']);
                $voter_id_image_stmt->execute();
                $voter_id_image_result = $voter_id_image_stmt->get_result();

                if ($voter_id_image_row = $voter_id_image_result->fetch_assoc()) {
                    $row['voter_id_image'] = base64_encode($voter_id_image_row['voter_id_image']);
                }

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
}

//POST request to approve or reject voter
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
        exit;
    }

    $user_id = $data['user_id'] ?? null;
    $action = $data['action'] ?? null; 
    $election_id = $data['election_id'] ?? null; // Optional candidate conversion
    $post_id = $data['post_id'] ?? null; // Optional candidate conversion

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
            $stmt = $conn->prepare("UPDATE users SET verified = TRUE, rejected = FALSE WHERE user_id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();

            if ($election_id && $post_id) {
                $stmt = $conn->prepare("SELECT location_id FROM users WHERE user_id = ? AND role = 'voter'");
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $voter_result = $stmt->get_result();

                if ($voter_result->num_rows === 0) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Voter not found or not eligible.'
                    ]);
                    exit;
                }

                $voter = $voter_result->fetch_assoc();
                $voter_location_id = $voter['location_id'];
                $stmt = $conn->prepare("SELECT location_id FROM elections WHERE election_id = ? AND is_active = TRUE");
                $stmt->bind_param("i", $election_id);
                $stmt->execute();
                $election_result = $stmt->get_result();

                if ($election_result->num_rows === 0) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Election not found or inactive.'
                    ]);
                    exit;
                }

                $election = $election_result->fetch_assoc();
                $election_location_id = $election['location_id'];

                if ($voter_location_id !== $election_location_id) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Voter cannot run in this election due to location mismatch.'
                    ]);
                    exit;
                }

                $stmt = $conn->prepare("UPDATE users SET role = 'candidate' WHERE user_id = ?");
                $stmt->bind_param("i", $user_id);
                $stmt->execute();

                $stmt = $conn->prepare("INSERT INTO candidates (user_id, post_id) VALUES (?, ?)");
                $stmt->bind_param("ii", $user_id, $post_id);
                $stmt->execute();

                echo json_encode([
                    'success' => true,
                    'message' => 'Voter approved and converted to candidate successfully.'
                ]);
                exit;
            }

            echo json_encode([
                'success' => true,
                'message' => 'Voter approved successfully.'
            ]);
        } else {
  
            $stmt = $conn->prepare("UPDATE users SET verified = FALSE, rejected = TRUE WHERE user_id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Voter rejected successfully."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error processing request: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>