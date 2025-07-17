<?php
    namespace App\Models;

    use PDO;

    class BookingDetails {
        private PDO $conn;
        private string $table = 'booking_details';

        public function __construct(PDO $db){
            $this->conn = $db;
        }

        //create a new booking detail
        public function create(int $booking_id, int $schedule_id, int $ticket_type_id, int $quantity, float $price):bool{
            $sql = "INSERT INTO {$this->table} 
                (booking_id, schedule_id, ticket_type_id, quantity, price)
                VALUES (?,?,?,?,?)";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([$booking_id, $schedule_id, $ticket_type_id, $quantity, $price]);
        }

        //Get all details for a booking
        public function getByBookingId(int $booking_id): array{
            $sql = "SELECT * FROM {$this->table} WHERE booking_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$booking_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        //Delete etails by booking_id
        public function deleteByBookingId(int $booking_id): bool{
            $sql = "DELETE FROM {$this->table} WHERE booking_id = ?";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([$booking_id]);
        }

        //Get total price for a booking
        public function getTotalAmount(int $booking_id): float{
            $sql = "SELECT SUM(price * quantity) AS total FROM {$this->table} WHERE booking_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$booking_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ? (float)$result['total'] : 0.00;
        }

        public function getAll(): array{
            $sql = "SELECT * FROM {$this->table} ORDER BY booking_id DESC";
            $stmt = $this->conn->query($sql);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function createFromApi(int $booking_id, int $schedule_id, int $ticket_type_id, int $quantity, float $price): bool {
            $sql = "INSERT INTO {$this->table} 
                    (booking_id, schedule_id, ticket_type_id, quantity, price) 
                    VALUES (:booking_id, :schedule_id, :ticket_type_id, :quantity, :price)";
        
            $stmt = $this->conn->prepare($sql);
        
            return $stmt->execute([
                ':booking_id' => $booking_id,
                ':schedule_id' => $schedule_id,
                ':ticket_type_id' => $ticket_type_id,
                ':quantity' => $quantity,
                ':price' => $price
            ]);
        }
    }