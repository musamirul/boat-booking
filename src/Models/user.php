<?php

namespace App\Models;

use PDO;

class User {
    private PDO $conn;
    private string $table = 'users';

    public function __construct(PDO $db) {
        $this->conn = $db;
    }

    public function getById(int $id): ?array {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE user_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function countAll(): int {
        $stmt = $this->conn->query("SELECT COUNT(*) FROM {$this->table}");
        return (int) $stmt->fetchColumn();
    }
}