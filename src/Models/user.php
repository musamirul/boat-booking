<?php

namespace App\Models;

use PDO;

class User {
    private PDO $conn;
    private string $table = 'users';

    public function __construct(PDO $db) {
        $this->conn = $db;
    }

    public function getById($userId) {
        $sql = "SELECT 
                    user_id,
                    name,
                    email,
                    role,
                    DATE_FORMAT(created_at, '%d %b %Y %H:%i:%s') AS created_at
                FROM users
                WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function countAll(): int {
        $stmt = $this->conn->query("SELECT COUNT(*) FROM {$this->table}");
        return (int) $stmt->fetchColumn();
    }

    public function findByEmail(string $email):?array{
        $stmt=$this->conn->prepare("SELECT * FROM {$this->table} WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function create(string $name, string $email, string $password): bool{
        $stmt = $this->conn->prepare("INSERT INTO {$this->table} (name,email,password) VALUES (?,?,?)");
        return $stmt->execute([$name,$email,$password]);
    }
}