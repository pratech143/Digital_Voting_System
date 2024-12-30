<?php
session_start();
include 'Digital_Voting_System/backend/config/database.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $otp = trim($_POST['otp']);
    $errors = [];

    if (empty($otp)) {
        $errors[] = "OTP is required.";
    } elseif (!isset($_SESSION['otp_code']) || $otp != $_SESSION['otp_code']) {
        $errors[] = "Invalid or expired OTP.";
    }

    if (empty($errors)) {
        $userId = $_SESSION['user_id_temp'];
        $role = $_SESSION['role_temp'];

        $updateQuery = "UPDATE users SET last_login = NOW() WHERE user_id = $userId";
        mysqli_query($conn, $updateQuery);

        $_SESSION['user_id'] = $userId;
        unset($_SESSION['otp_code'], $_SESSION['otp_email'], $_SESSION['user_id_temp'], $_SESSION['role_temp']);

        if ($role === 'admin') {
            header("Location: Digital_Voting_System/backend/admin/dashboard.php");
        } else {
            header("Location: Digital_Voting_System/backend/public/dashboard.php");
        }
        exit();
    }
}
?>

<html>
<head>
    <title>Verify OTP</title>
    <link rel="stylesheet" href="../assets/styles.css">
</head>
<body>
<div class="container">
    <h1>Verify OTP</h1>
    <?php if (!empty($errors)): ?>
        <div class="error-messages">
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
    <form method="POST" action="">
        <div>
            <label for="otp">Enter OTP:</label>
            <input type="text" name="otp" id="otp" required>
        </div>
        <button type="submit">Verify OTP</button>
    </form>
</div>
</body>
</html>