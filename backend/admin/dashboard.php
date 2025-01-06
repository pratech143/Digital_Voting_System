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

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../styles/style.css">
</head>
<body>
    <header>
        <h1>Admin Dashboard</h1>
        <nav>
            <ul>
                <li><a href="dashboard.php">Dashboard</a></li>
                <li><a href="manage_voters.php">Manage Voters</a></li>
                <li><a href="logout.php">Logout</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section>
            <h2>Statistics</h2>
            <p><strong>Total Users:</strong> <?php echo $totalUsersResult['total_users']; ?></p>
            <p><strong>Verified Users:</strong> <?php echo $verifiedUsersResult['verified_users']; ?></p>
            <p><strong>Pending Applications:</strong> <?php echo $pendingUsersResult['pending_users']; ?></p>
        </section>

        <section>
            <h2>Active Elections</h2>
            <?php if (mysqli_num_rows($activeElections) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($election = mysqli_fetch_assoc($activeElections)): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($election['name']); ?></td>
                                <td><?php echo $election['start_date']; ?></td>
                                <td><?php echo $election['end_date']; ?></td>
                                <td><?php echo $election['is_active'] ? 'Active' : 'Inactive'; ?></td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No active elections found.</p>
            <?php endif; ?>
        </section>
    </main>
    <footer>
        <p>&copy; <?php echo date('Y'); ?> Online Voting System</p>
    </footer>
</body>
</html>