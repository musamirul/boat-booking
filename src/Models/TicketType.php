<?php
namespace App\Models;
use PDO;

class TicketType {
    private PDO $conn;
    private string $table = 'ticket_types';

    public function __construct(PDO $db) {
        $this->conn = $db;
    }

    // ✅ Get All Ticket Types
    public function getAll(): array {
        $stmt = $this->conn->query("SELECT * FROM {$this->table} ORDER BY name ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ✅ Create Ticket Type
    public function create(string $name): bool {
        $stmt = $this->conn->prepare("INSERT INTO {$this->table} (name) VALUES (:name)");
        return $stmt->execute([':name' => $name]);
    }

    // ✅ Update Ticket Type
    public function update(int $id, string $name): bool {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET name=:name WHERE ticket_type_id=:id");
        return $stmt->execute([':name' => $name, ':id' => $id]);
    }

    // ✅ Delete Ticket Type
    public function delete(int $id): bool {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE ticket_type_id=:id");
        return $stmt->execute([':id' => $id]);
    }
}