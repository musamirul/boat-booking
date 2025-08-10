<?php
require_once __DIR__ . '/../init.php';

use App\Config\Database;

try {
    $db = (new Database())->connect();
    echo "✅ Database connection successful!<br>";

    // Optional: Show existing tables
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "📦 Tables:<br>";
    foreach ($tables as $table) {
        echo "- $table<br>";
    }

} catch (PDOException $e) {
    echo "❌ DB Error: " . $e->getMessage();
}