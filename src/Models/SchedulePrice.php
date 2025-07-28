<?php
namespace App\Models;

use PDO;

class SchedulePrice {
    private PDO $conn;
    private string $table = 'schedule_prices';

    public function __construct(PDO $db) {
        $this->conn = $db;
    }

    public function getBySchedule(int $scheduleId): array {
        $stmt = $this->conn->prepare("SELECT sp.*, tt.name as ticket_type_name 
                                      FROM {$this->table} sp 
                                      JOIN ticket_types tt ON sp.ticket_type_id = tt.ticket_type_id 
                                      WHERE sp.schedule_id = ?");
        $stmt->execute([$scheduleId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(int $scheduleId, int $ticketTypeId, float $price): bool {
        $stmt = $this->conn->prepare("INSERT INTO {$this->table} (schedule_id, ticket_type_id, price) VALUES (?, ?, ?)");
        return $stmt->execute([$scheduleId, $ticketTypeId, $price]);
    }

    public function delete(int $id): bool {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE schedule_price_id = ?");
        return $stmt->execute([$id]);
    }

    public function update(int $id, float $price): bool {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET price = ? WHERE schedule_price_id = ?");
        return $stmt->execute([$price, $id]);
    }
}