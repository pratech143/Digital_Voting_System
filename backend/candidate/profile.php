<?php
session_start();
header('Content-Type: application/json');
include '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'candidate') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT symbol_image_path FROM candidates WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$current_symbol = null;

if ($result->num_rows > 0) {
    $candidate = $result->fetch_assoc();
    $current_symbol = $candidate['symbol_image_path'];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['symbol'])) {
        echo json_encode(["success" => false, "message" => "Missing party symbol image"]);
        exit;
    }

    $symbol_image = $_FILES['symbol'];
    $upload_dir = '../uploads/symbols/'; 
    $target_file = $upload_dir . basename($symbol_image["name"]);
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    if (!in_array($imageFileType, ['jpg', 'jpeg', 'png', 'gif'])) {
        echo json_encode(["success" => false, "message" => "Only JPG, JPEG, PNG, and GIF files are allowed."]);
        exit;
    }

    if (move_uploaded_file($symbol_image["tmp_name"], $target_file)) {

        $stmt = $conn->prepare("UPDATE candidates SET symbol_image_path = ? WHERE user_id = ?");
        $stmt->bind_param("si", $target_file, $user_id);
        $stmt->execute();

        echo json_encode(["success" => true, "message" => "Party symbol updated successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error uploading the party symbol."]);
    }
    exit;
}
echo json_encode([
    'success' => true,
    'message' => 'Current symbol retrieved successfully.',
    'data' => [
        'current_symbol' => $current_symbol ? $current_symbol : null
    ]
]);

?>