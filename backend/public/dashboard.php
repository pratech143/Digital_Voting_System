<?php
session_start();
include 'Digital_Voting_System/backend/config/database.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$query = "SELECT full_name, email, verified FROM users WHERE user_id = $user_id";
$result = mysqli_query($conn, $query);

if (!$result || mysqli_num_rows($result) === 0) {
    die("User not found.");
}

$user = mysqli_fetch_assoc($result);
?>

<html>
<head>
    <title>User Dashboard</title>
    <link rel="stylesheet" href="../assets/styles.css">
</head>
<body>
<header>
    <h1>Welcome, <?php echo htmlspecialchars($user['full_name']); ?>!</h1>
</header>
<nav>
    <ul>
        <li><a href="profile.php">Profile</a></li>
        <li><a href="notifications.php">Notifications</a></li>
        <li><a href="results.php">Election Results</a></li>
        <li><a href="vote.php">Vote</a></li>
        <li><a href="logout.php">Logout</a></li>
    </ul>
</nav>
<main>
    <section>
        <p>Email: <?php echo htmlspecialchars($user['email']); ?></p>
        <p>Status: <?php echo $user['verified'] ? 'Verified Voter' : 'Not Verified'; ?></p>
    </section>
</main>
</body>
</html>
