<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../config/database.php';
include '../config/mail_config.php';

$email = 'aprabhat80@gmail.com'; 
$subject = 'Test Email from Election System';
$message = 'This is a test email to verify the email functionality.';

if (sendEmail($email, $subject, $message)) {
    echo 'Email sent successfully!';
} else {
    echo 'Failed to send email.';
}

?>