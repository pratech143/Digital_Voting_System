<?php
function send_otp_email($recipientEmail, $otp) {
    $subject = "Your Login OTP";
    $message = "Dear User,\n\nYour One-Time Password is: $otp\n\nPlease use this OTP within 5 minutes.\n\nThank you,\nDeveloper Team";
    $headers = "From: noreply@e-mat.com\r\n";
    $headers .= "Reply-To: noreply@e-election.com\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($recipientEmail, $subject, $message, $headers)) {
        return true;
    } else {
        return false;
    }
}
?>