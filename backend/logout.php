<?php

session_start();
include 'config/handle_cors.php';

// Check if the session exists before attempting to clear it
if (isset($_SESSION)) {
    // Clear session variables
    $_SESSION = [];

    // If a session cookie exists, clear it
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(), // Session name
            '', // Clear the cookie value
            time() - 3600, // Set expiration in the past
            $params["path"], // Cookie path
            $params["domain"], // Cookie domain
            $params["secure"], // Secure flag
            $params["httponly"] // HttpOnly flag
        );
    }

    // Destroy the session
    session_destroy();

    // Respond with success
    echo json_encode([
        'success' => true,
        'message' => 'User logged out successfully'
    ]);
} else {
    // Respond with an error if no session exists
    echo json_encode([
        'success' => false,
        'message' => 'No active session to log out from'
    ]);
}

exit;

?>
