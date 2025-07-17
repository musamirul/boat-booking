<?php
namespace App\Models;

use PDO;

class Schedule {
    private PDO $conn;
    private string $table = 'schedules';

    public function __construct(PDO $db) {
        $this->conn = $db;
    }

    public function getAll(): array {
        $stmt = $this->conn->query("SELECT * FROM {$this->table} ORDER BY departure_time ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get schedules for a specific boat
    public function getByBoatId(int $boatId): array {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE boat_id = ? ORDER BY departure_time ASC");
        $stmt->execute([$boatId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //Get on schedule by ID
    public function getById(int $scheduleId): ?array{
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE schedule_id = ?");
        $stmt->execute([$scheduleId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    //Create a new schedule
    public function create(int $boatId, string $departureTime, int $availableSeats): bool {
        $stmt = $this->conn->prepare("INSERT INTO {$this->table} (boat_id, departure_time, available_seats) VALUES (?, ?, ?)");
        return $stmt->execute([$boatId, $departureTime, $availableSeats]);
    }

    //Update available seats after booking
    public function updateAvailableSeats(int $scheduleId, int $newSeatCount): bool{
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET available_seats = ? WHERE schedule_id = ?");
        return $stmt->execute([$newSeatCount, $scheduleId]);
    }

    public function delete(int $scheduleId): bool {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE schedule_id = ?");
        return $stmt->execute([$scheduleId]);
    }

    public function countAll(): int {
        $stmt = $this->conn->query("SELECT COUNT(*) FROM {$this->table}");
        return (int) $stmt->fetchColumn();
    }
}