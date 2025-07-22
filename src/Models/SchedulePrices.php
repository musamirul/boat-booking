<?php
    namespace App\Models;

    use PDO;

    class SchedulePrices{
        private PDO $conn;
        private string $table = 'schedule_prices';

        public function __construct(PDO $db){
            $this->conn = $db;
        }

        public function getByScheduleId(int $scheduleId): array{
            $stmt = $this->conn->prepare(
                "SELECT sp.*, tt.name AS ticket_type_name
                FROM {$this->table} sp
                JOIN ticket_types tt ON sp.ticket_type_id = tt.ticket_type_id
                WHERE sp.schedule_id = ?"
                );
            $stmt->execute([$scheduleId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function setPrice(int $scheduleId, int $ticketTypeId, float $price): bool{
            $stmt = $this->conn->prepare(
                "INSERT INTO {$this->table} (schedule_id, ticket_type_id, price) 
                    VALUES (?,?,?)");
            return $stmt->execute([$scheduleId, $ticketTypeId, $price]);
        }
        
        public function deleteBySchedule(int $scheduleId): bool{
            $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE schedule_id = ?");
            return $stmt->execute([$scheduleId]);
        }
    }