<?php
header("Access-Control-Allow-Origin: *");
session_start();
include 'Digital_Voting_System/backend/config/database.php';
include 'Digital_Voting_System/backend/config/mail_config.php';

$errors = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($email)) {
        $errors[] = "Email is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }
    if (empty($password)) {
        $errors[] = "Password is required.";
    }

    if (empty($errors)) {
        $query = "SELECT user_id, full_name, password_hash, email_verified_at, verified, role FROM users WHERE email = '$email'";
        $result = mysqli_query($conn, $query);

        if ($result && mysqli_num_rows($result) > 0) {
            $user = mysqli_fetch_assoc($result);

            if (password_verify($password, $user['password_hash'])) {
                if (is_null($user['email_verified_at'])) {
                    $errors[] = "Your email is not verified. Check your inbox.";
                } elseif (!$user['verified']) {
                    $errors[] = "Your account is not yet verified by the admin.";
                } else {
                    $otp = random_int(100000, 999999);

                    $_SESSION['otp_email'] = $email;
                    $_SESSION['otp_code'] = $otp;
                    $_SESSION['user_id_temp'] = $user['user_id'];
                    $_SESSION['role_temp'] = $user['role'];

                    if (send_otp_email($email, $otp)) {
                        header("Location: verify-otp.php");
                        exit();
                    } else {
                        $errors[] = "Failed to send OTP. Please try again.";
                    }
                }
            } else {
                $errors[] = "Invalid email or password.";
            }
        } else {
            $errors[] = "No account found with that email.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Login</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="container">
    <h1>Login to Online Voting System</h1>
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
            <label for="email">Email:</label>
            <input type="email" name="email" id="email" required>
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" name="password" id="password" required>
        </div>
        <button type="submit">Send OTP</button>
    </form>
</div>
</body>
</html>