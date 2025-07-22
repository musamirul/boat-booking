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

    // //Create a new schedule
    // public function create(int $boatId, string $departureTime, int $availableSeats): bool {
    //     $stmt = $this->conn->prepare("INSERT INTO {$this->table} (boat_id, departure_time, available_seats) VALUES (?, ?, ?)");
    //     return $stmt->execute([$boatId, $departureTime, $availableSeats]);
    // }
    // Create a new schedule and return the new schedule_id
    public function create(int $boatId, string $departureTime, int $availableSeats): int|false {
        $stmt = $this->conn->prepare(
            "INSERT INTO {$this->table} (boat_id, departure_time, available_seats) 
            VALUES (?, ?, ?)"
        );

        if ($stmt->execute([$boatId, $departureTime, $availableSeats])) {
            return (int)$this->conn->lastInsertId(); // ✅ return new schedule_id
        }

        return false; // ❌ on failure
    }
    
    public function getLastInsertId(): int{
        return (int) $this->conn->lastInsertId();
    }

    //Create a new schedule and return id
    public function createAndReturnId(int $boatId, string $departureTime, int $availableSeats): ?int {
        $stmt = $this->conn->prepare("INSERT INTO {$this->table} (boat_id, departure_time, available_seats) VALUES (?, ?, ?)");
        $success = $stmt->execute([$boatId, $departureTime, $availableSeats]);

        return $success ? (int)$this->conn->lastInsertId() : null;
    }

    // Fix createWithPrices to return schedule_id
    public function createWithPrices(int $boat_id, string $departure_time, int $available_seats, array $prices): ?int {
        try {
            file_put_contents("debug.log", "START createWithPrices\n", FILE_APPEND);
            $this->conn->beginTransaction();
    
            // Insert schedule
            $stmt = $this->conn->prepare("INSERT INTO {$this->table} (boat_id, departure_time, available_seats) VALUES (?, ?, ?)");
            $stmt->execute([$boat_id, $departure_time, $available_seats]);
            $scheduleId = (int)$this->conn->lastInsertId();
    
            file_put_contents("debug.log", "Inserted schedule ID: $scheduleId\n", FILE_APPEND);
    
            // Prepare insert for ticket prices
            $stmt_price = $this->conn->prepare("INSERT INTO schedule_prices (schedule_id, ticket_type_id, price) VALUES (?, ?, ?)");
    
            foreach ($prices as $ticket_type_name => $price_value) {
                file_put_contents("debug.log", "Price: $ticket_type_name => $price_value\n", FILE_APPEND);
                $typeStmt = $this->conn->prepare("SELECT id FROM ticket_types WHERE name = ?");
                $typeStmt->execute([$ticket_type_name]);
                $ticketType = $typeStmt->fetch(PDO::FETCH_ASSOC);
    
                if ($ticketType) {
                    file_put_contents("debug.log", "Found ticket_type_id: {$ticketType['id']}\n", FILE_APPEND);
                    $stmt_price->execute([$scheduleId, $ticketType['id'], $price_value]);
                } else {
                    file_put_contents("debug.log", "Ticket type not found: $ticket_type_name\n", FILE_APPEND);
                }
            }
    
            $this->conn->commit();
            file_put_contents("debug.log", "COMMIT complete\n", FILE_APPEND);
            return $scheduleId;
    
        } catch (\Exception $e) {
            $this->conn->rollBack();
            file_put_contents("debug.log", "ROLLBACK: " . $e->getMessage() . "\n", FILE_APPEND);
            error_log("Error in createWithPrices: " . $e->getMessage());
            return null;
        }
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