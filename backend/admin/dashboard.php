<?php
header("Access-Control-Allow-Origin: *");
session_start();
include '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: Digital_Voting_System/backend/public/login.php");
    exit();
}

$totalUsersQuery = "SELECT COUNT(*) AS total_users FROM users";
$totalUsersResult = mysqli_fetch_assoc(mysqli_query($conn, $totalUsersQuery));

$verifiedUsersQuery = "SELECT COUNT(*) AS verified_users FROM users WHERE verified = 1";
$verifiedUsersResult = mysqli_fetch_assoc(mysqli_query($conn, $verifiedUsersQuery));

$pendingUsersQuery = "SELECT COUNT(*) AS pending_users FROM users WHERE verified = 0 AND voter_id_image_path IS NOT NULL";
$pendingUsersResult = mysqli_fetch_assoc(mysqli_query($conn, $pendingUsersQuery));

$activeElectionsQuery = "SELECT * FROM elections WHERE is_active = 1";
$activeElections = mysqli_query($conn, $activeElectionsQuery);
?>