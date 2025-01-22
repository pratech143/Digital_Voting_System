<?php
header('Content-Type: application/json');
session_start();
include '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized access."]);
    exit();
}

try {
    $totalUsersQuery = $conn->prepare("SELECT COUNT(*) AS total_users FROM users");
    $totalUsersQuery->execute();
    $totalUsersResult = $totalUsersQuery->get_result()->fetch_assoc();

    $verifiedUsersQuery = $conn->prepare("SELECT COUNT(*) AS verified_users FROM users WHERE verified = 1");
    $verifiedUsersQuery->execute();
    $verifiedUsersResult = $verifiedUsersQuery->get_result()->fetch_assoc();

    $pendingUsersQuery = $conn->prepare("SELECT COUNT(*) AS pending_users FROM users WHERE verified = 0 AND voter_id_image_path IS NOT NULL");
    $pendingUsersQuery->execute();
    $pendingUsersResult = $pendingUsersQuery->get_result()->fetch_assoc();

    $activeElectionsQuery = $conn->prepare("SELECT election_id, election_name FROM elections WHERE is_active = 1");
    $activeElectionsQuery->execute();
    $activeElectionsResult = $activeElectionsQuery->get_result();

    $response = [
        "success" => true,
        "data" => [
            "total_users" => $totalUsersResult['total_users'],
            "verified_users" => $verifiedUsersResult['verified_users'],
            "pending_users" => $pendingUsersResult['pending_users'],
            "active_elections" => []
        ]
    ];

    while ($election = $activeElectionsResult->fetch_assoc()) {
        $response['data']['active_elections'][] = [
            'election_id' => $election['election_id'],
            'election_name' => $election['election_name']
        ];
    }

    echo json_encode($response);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error fetching data: " . $e->getMessage()
    ]);
}
?>