<?php
session_start();
include 'Digital_Voting_System/backend/config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: Digital_Voting_System/backend/public/login.php");
    exit();
}

$pendingApplicationsQuery = "SELECT user_id, full_name, email, voter_id_image_path FROM users WHERE verified = 0 AND voter_id_image_path IS NOT NULL";
$pendingApplications = mysqli_query($conn, $pendingApplicationsQuery);

$totalUsersQuery = "SELECT COUNT(*) AS total_users FROM users";
$totalUsersResult = mysqli_fetch_assoc(mysqli_query($conn, $totalUsersQuery));

$verifiedUsersQuery = "SELECT COUNT(*) AS verified_users FROM users WHERE verified = 1";
$verifiedUsersResult = mysqli_fetch_assoc(mysqli_query($conn, $verifiedUsersQuery));

$pendingUsersQuery = "SELECT COUNT(*) AS pending_users FROM users WHERE verified = 0 AND voter_id_image_path IS NOT NULL";
$pendingUsersResult = mysqli_fetch_assoc(mysqli_query($conn, $pendingUsersQuery));

$activeElectionsQuery = "SELECT * FROM elections WHERE is_active = 1";
$activeElections = mysqli_query($conn, $activeElectionsQuery);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'], $_POST['election_id'])) {
    $election_id = intval($_POST['election_id']);
    $action = $_POST['action'];

    if ($action === 'deactivate') {
        $updateQuery = "UPDATE elections SET is_active = 0 WHERE election_id = $election_id";
    } elseif ($action === 'activate') {
        $updateQuery = "UPDATE elections SET is_active = 1 WHERE election_id = $election_id";
    }

    if (isset($updateQuery) && mysqli_query($conn, $updateQuery)) {
        header("Location: dashboard.php");
        exit();
    } else {
        $error_message = "Failed to update election status.";
    }
}

$postsQuery = "SELECT p.*, l.name AS location_name, w.ward_number FROM posts p 
               LEFT JOIN locations l ON p.location_id = l.location_id 
               LEFT JOIN wards w ON p.ward_id = w.ward_id";
$posts = mysqli_query($conn, $postsQuery);

$candidatesQuery = "SELECT c.*, u.full_name, p.name AS post_name FROM candidates c 
                   LEFT JOIN users u ON c.user_id = u.user_id 
                   LEFT JOIN posts p ON c.post_id = p.post_id";
$candidates = mysqli_query($conn, $candidatesQuery);

$votesQuery = "SELECT v.vote_id, v.voter_id_hash, c.full_name AS candidate_name, e.name AS election_name 
              FROM votes v 
              LEFT JOIN candidates c ON v.candidate_id = c.candidate_id 
              LEFT JOIN elections e ON c.election_id = e.election_id";
$votes = mysqli_query($conn, $votesQuery);

$auditLogsQuery = "SELECT * FROM audit_logs";
$auditLogs = mysqli_query($conn, $auditLogsQuery);
?>

<html>
<head>
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../styles/style.css">
</head>
<body>
    <header>
        <h1>Admin Dashboard</h1>
        <nav>
            <ul>
                <li><a href="Digital_Voting_System/backend/admin/dashboard.php">Dashboard</a></li>
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
            <h2>Pending Voter Applications</h2>
            <?php if (mysqli_num_rows($pendingApplications) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Voter ID Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($application = mysqli_fetch_assoc($pendingApplications)): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($application['full_name']); ?></td>
                                <td><?php echo htmlspecialchars($application['email']); ?></td>
                                <td>
                                    <a href="Digital_Voting_System/backend/uploads/voter_ids/<?php echo basename($application['voter_id_image_path']); ?>" target="_blank">View Image</a>
                                </td>
                                <td>
                                    <form method="POST">
                                        <input type="hidden" name="user_id" value="<?php echo $application['user_id']; ?>">
                                        <button type="submit" name="action" value="verify">Verify</button>
                                        <button type="submit" name="action" value="reject">Reject</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No pending applications.</p>
            <?php endif; ?>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($election = mysqli_fetch_assoc($activeElections)): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($election['name']); ?></td>
                                <td><?php echo $election['start_date']; ?></td>
                                <td><?php echo $election['end_date']; ?></td>
                                <td><?php echo $election['is_active'] ? 'Active' : 'Inactive'; ?></td>
                                <td>
                                    <form method="POST">
                                        <input type="hidden" name="election_id" value="<?php echo $election['election_id']; ?>">
                                        <button type="submit" name="action" value="deactivate">Deactivate</button>
                                        <button type="submit" name="action" value="activate">Activate</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No active elections found.</p>
            <?php endif; ?>
        </section>

        <section>
            <h2>Posts Management</h2>
            <?php if (mysqli_num_rows($posts) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Ward</th>
                            <th>Reserved For</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($post = mysqli_fetch_assoc($posts)): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($post['name']); ?></td>
                                <td><?php echo htmlspecialchars($post['location_name']); ?></td>
                                <td><?php echo $post['ward_number'] ? $post['ward_number'] : 'N/A'; ?></td>
                                <td><?php echo $post['reserved_for']; ?></td>
                                <td>
                                    <form method="POST">
                                        <input type="hidden" name="post_id" value="<?php echo $post['post_id']; ?>">
                                        <button type="submit" name="action" value="edit">Edit</button>
                                        <button type="submit" name="action" value="delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No posts found.</p>
            <?php endif; ?>
        </section>

        <section>
            <h2>Candidates Management</h2>
            <?php if (mysqli_num_rows($candidates) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Candidate Name</th>
                            <th>Post</th>
                            <th>Symbol Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($candidate = mysqli_fetch_assoc($candidates)): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($candidate['full_name']); ?></td>
                                <td><?php echo htmlspecialchars($candidate['post_name']); ?></td>
                                <td>
                                    <a href="Digital_Voting_System/backend/uploads/symbols/<?php echo basename($candidate['symbol_image_path']); ?>" target="_blank">View Image</a>
                                </td>
                                <td>
                                    <form method="POST">
                                        <input type="hidden" name="candidate_id" value="<?php echo $candidate['candidate_id']; ?>">
                                        <button type="submit" name="action" value="edit">Edit</button>
                                        <button type="submit" name="action" value="delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No candidates found.</p>
            <?php endif; ?>
        </section>

        <section>
            <h2>Votes Management</h2>
            <?php if (mysqli_num_rows($votes) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Vote ID</th>
                            <th>Voter ID Hash</th>
                            <th>Candidate</th>
                            <th>Election</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($vote = mysqli_fetch_assoc($votes)): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($vote['vote_id']); ?></td>
                                <td><?php echo htmlspecialchars($vote['voter_id_hash']); ?></td>
                                <td><?php echo htmlspecialchars($vote['candidate_name']); ?></td>
                                <td><?php echo htmlspecialchars($vote['election_name']); ?></td>
                                <td>
                                    <form method="POST">
                                        <input type="hidden" name="vote_id" value="<?php echo $vote['vote_id']; ?>">
                                        <button type="submit" name="action" value="delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No votes found.</p>
            <?php endif; ?>
        </section>

        <section>
            <h2>Audit Logs</h2>
            <?php if (mysqli_num_rows($auditLogs) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Action</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($log = mysqli_fetch_assoc($auditLogs)): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($log['user_id']); ?></td>
                                <td><?php echo htmlspecialchars($log['action']); ?></td>
                                <td><?php echo $log['timestamp']; ?></td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No audit logs found.</p>
            <?php endif; ?>
        </section>

    </main>

    <footer>
        <p>&copy; <?php echo date('Y'); ?> Online Voting System</p>
    </footer>
</body>
</html>