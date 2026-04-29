<?php
$servername = "db";
$username = "root";
$password = "example";

// Verbindung herstellen (wir nutzen die MySQLi-Erweiterung)
$conn = new mysqli($servername, $username, $password);

// Verbindung prüfen
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}
echo "<h1>Erfolg!</h1>";
echo "Die Verbindung zur MariaDB-Datenbank steht.";
?>
