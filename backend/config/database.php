<?php
header("Access-Control-Allow-Origin: *");
$servername = 'localhost';
$dbname = 'election_system'; 
$username = 'root':
$password = '';
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
