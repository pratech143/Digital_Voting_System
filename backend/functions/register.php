<?php
session_start();
include 'Digital_Voting_System/backend/config/database.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(403); //not allowed
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
    exit();
}

$user_id = $_SESSION['user_id'];
$query = "SELECT * FROM users WHERE user_id = $user_id";
$result = mysqli_query($conn, $query);

if (!$result || mysqli_num_rows($result) === 0) {
    http_response_code(404); 
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!empty($_FILES['voter_id_image']['name'])) {
        $target_dir = "Digital_Voting_System/backend/uploads/voter_ids/";
        $file_name = uniqid() . "_" . basename($_FILES["voter_id_image"]["name"]);
        $target_file = $target_dir . $file_name;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        $check = getimagesize($_FILES["voter_id_image"]["tmp_name"]);
        if ($check === false) {
            echo json_encode(['status' => 'error', 'message' => 'File is not a valid image.']);
            exit();
        }

        if (!in_array($imageFileType, ['jpg', 'jpeg', 'png'])) {
            echo json_encode(['status' => 'error', 'message' => 'Only JPG, JPEG, and PNG files are allowed.']);
            exit();
        }

        if (move_uploaded_file($_FILES["voter_id_image"]["tmp_name"], $target_file)) {
            $query = "UPDATE users SET voter_id_image_path = '$target_file', verified = 0 WHERE user_id = $user_id";

            if (mysqli_query($conn, $query)) {
                echo json_encode(['status' => 'success', 'message' => 'Application submitted successfully. Awaiting admin approval.']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Database update failed.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'File upload failed.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No file uploaded.']);
    }
} else {
    http_response_code(405); //not allowed
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>