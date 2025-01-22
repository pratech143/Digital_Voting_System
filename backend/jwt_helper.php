<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require '../vendor/autoload.php'; // Ensure the JWT library is loaded
include '../config/jwt_config.php'; // Include the JWT configuration

// Generate a JWT token
function generate_jwt($payload) {
    $payload['iat'] = time(); // Issued at
    $payload['exp'] = time() + 3600; // Expiration time (1 hour)

    return JWT::encode($payload, JWT_SECRET_KEY, JWT_ALGORITHM);
}

// Decode and validate a JWT token
function decode_jwt($token) {
    try {
        return JWT::decode($token, new Key(JWT_SECRET_KEY, JWT_ALGORITHM));
    } catch (Exception $e) {
        return null; // Return null if token is invalid or expired
    }
}
?>