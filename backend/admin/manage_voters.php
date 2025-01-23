<?php
header('Content-Type: application/json');
session_start();
include '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit;
}

// Handle GET request to fetch the list of pending voters
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Fetch the list of voters awaiting approval
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
}
// Handle POST request to approve or reject voters and convert them to candidates if needed
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate input data
    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
        exit;
    }

    $user_id = $data['user_id'] ?? null;
    $action = $data['action'] ?? null; // 'approve' or 'reject'
    $election_id = $data['election_id'] ?? null; // Optional: if converting to candidate
    $post_id = $data['post_id'] ?? null; // Optional: if converting to candidate

    if (!$user_id || !$action) {
        echo json_encode(["success" => false, "message" => "User ID and action are required"]);
        exit;
    }

    if (!in_array($action, ['approve', 'reject'])) {
        echo json_encode(["success" => false, "message" => "Invalid action"]);
        exit;
    }

    try {
        // Update voter status (approve or reject)
        if ($action === 'approve') {
            // Approve the voter
            $stmt = $conn->prepare("UPDATE users SET verified = TRUE, rejected = FALSE WHERE user_id = ?");
        } else {
            // Reject the voter
            $stmt = $conn->prepare("UPDATE users SET verified = FALSE, rejected = TRUE WHERE user_id = ?");
        }

        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // If approving, check if they should be converted to a candidate
        if ($action === 'approve' && $election_id && $post_id) {
            // Step 1: Check if the voter exists and get their location
            $stmt = $conn->prepare("SELECT u.location_id, u.role FROM users u WHERE u.user_id = ? AND u.role = 'voter'");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $voter_result = $stmt->get_result();

            if ($voter_result->num_rows === 0) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Voter not found or the user is not a voter.'
                ]);
                exit;
            }

            $voter = $voter_result->fetch_assoc();
            $voter_location_id = $voter['location_id'];

            // Step 2: Check if the election exists and if the election is for the voter's location
            $stmt = $conn->prepare("SELECT e.location_id FROM elections e WHERE e.election_id = ? AND e.is_active = TRUE");
            $stmt->bind_param("i", $election_id);
            $stmt->execute();
            $election_result = $stmt->get_result();

            if ($election_result->num_rows === 0) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Election not found or the election is not active.'
                ]);
                exit;
            }

            $election = $election_result->fetch_assoc();
            $election_location_id = $election['location_id'];

            // Step 3: Ensure the election location matches the voter's location
            if ($voter_location_id !== $election_location_id) {
                echo json_encode([
                    'success' => false,
                    'message' => 'The voter cannot run in this election as they are from a different location.'
                ]);
                exit;
            }

            // Step 4: Update the voter to a candidate and link them to the post
            $stmt = $conn->prepare("UPDATE users SET role = 'candidate' WHERE user_id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();

            // Step 5: Insert into candidates table
            $stmt = $conn->prepare("INSERT INTO candidates (user_id, post_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $user_id, $post_id);
            $stmt->execute();

            echo json_encode([
                'success' => true,
                'message' => 'Voter successfully converted to candidate and added to election.'
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'message' => $action === 'approve' ? "Voter approved successfully." : "Voter rejected successfully."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error updating status: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>