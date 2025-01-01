<?php
header("Access-Control-Allow-Origin: *");
session_start();
require_once 'Digital_Voting_System/backend/config/database.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$query = "SELECT * FROM users WHERE user_id = $user_id";
$result = mysqli_query($conn, $query);

if (!$result || mysqli_num_rows($result) === 0) {
    die("User not found.");
}

$user = mysqli_fetch_assoc($result);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['apply_voter_id'])) {
    if (!empty($_FILES['voter_id_image']['name'])) {
        $target_dir = "Digital_Voting_System/backend/uploads/voter_ids/";
        $file_name = uniqid() . "_" . basename($_FILES["voter_id_image"]["name"]);
        $target_file = $target_dir . $file_name;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        $check = getimagesize($_FILES["voter_id_image"]["tmp_name"]);
        if ($check === false) {
            $error_message = "File is not an image.";
        } elseif (!in_array($imageFileType, ['jpg', 'png', 'jpeg'])) {
            $error_message = "Only JPG, JPEG, and PNG files are allowed.";
        } elseif (move_uploaded_file($_FILES["voter_id_image"]["tmp_name"], $target_file)) {
            $query = "UPDATE users SET voter_id_image_path = '$target_file', verified = 0 WHERE user_id = $user_id";
            if (mysqli_query($conn, $query)) {
                $success_message = "Application submitted successfully. Waiting for admin approval.";
            } else {
                $error_message = "Database update failed.";
            }
        } else {
            $error_message = "There was an error uploading your file.";
        }
    } else {
        $error_message = "Please upload a voter ID image.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
    <link rel="stylesheet" href="../styles/style.css">
</head>
<body>
    <header>
        <h1>Your Profile</h1>
        <nav>
            <ul>
                <li><a href="dashboard.php">Dashboard</a></li>
                <li><a href="notification.php">Notifications</a></li>
                <li><a href="result.php">Results</a></li>
                <li><a href="logout.php">Logout</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section>
            <h2>Personal Details</h2>
            <p><strong>Name:</strong> <?php echo htmlspecialchars($user['full_name']); ?></p>
            <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
            <p><strong>Verification Status:</strong> 
                <?php echo $user['verified'] ? 'Verified Voter' : 'Not Verified'; ?>
            </p>
            <?php if ($user['voter_id_image_path']): ?>
                <p><strong>Voter ID Application:</strong> Pending Approval</p>
            <?php endif; ?>
        </section>

        <section>
            <h2>Apply for Digital Voter ID</h2>
            <?php if (!$user['verified']): ?>
                <form method="POST" enctype="multipart/form-data">
                    <label for="voter_id_image">Upload Voter ID Image:</label>
                    <input type="file" name="voter_id_image" id="voter_id_image" accept=".jpg,.jpeg,.png">
                    <button type="submit" name="apply_voter_id">Apply</button>
                </form>
                <?php if (isset($success_message)): ?>
                    <p class="success"><?php echo $success_message; ?></p>
                <?php elseif (isset($error_message)): ?>
                    <p class="error"><?php echo $error_message; ?></p>
                <?php endif; ?>
            <?php else: ?>
                <p>You are already verified as a voter.</p>
            <?php endif; ?>
        </section>
    </main>

    <footer>
        <p>&copy; <?php echo date('Y'); ?> Online Voting System.</p>
    </footer>
</body>
</html>
