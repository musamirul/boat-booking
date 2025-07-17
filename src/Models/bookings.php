<?php
    namespace App\Models;

    use PDO;

    class Bookings {
        private PDO $conn;
        private string $table = 'bookings';

        public function __construct(PDO $db){
            $this->conn = $db;
        }

        public function create(int $user_id, string $status ='pending'): bool {
            $sql = "INSERT INTO {$this->table} (user_id, status) VALUES (?,?)";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([$user_id, $status]);
        }

        //Get all booking
        public function getAll(): array{
            $sql = "SELECT * FROM {$this->table} ORDER BY booking_date DESC";
            $stmt = $this->conn->query($sql);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        //Get booking by ID
        public function getById(int $booking_id): ?array{
            $sql = "SELECT * FROM {$this->table} WHERE booking_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$booking_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
        }

        //update booking sttus
        public function updateStatus(int $booking_id, string $status): bool {
            $allowed = ['pending','paid','cancelled'];
            if (!in_array($status, $allowed)) return false;

            $sql = "UPDATE {$this->table} SET status = ? WHERE booking_id = ?";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([$status, $booking_id]);
        }

        //Delete booking
        public function delete(int $booking_id): bool{
            $sql = "DELETE FROM {$this->table} WHERE booking_id = ?";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([$booking_id]);
        }

        public function countAll(): int {
            $stmt = $this->conn->query("SELECT COUNT(*) FROM {$this->table}");
            return (int) $stmt->fetchColumn();
        }

        public function createFromApi(int $user_id, string $status = 'pending'): ?int {
            $sql = "INSERT INTO {$this->table} (user_id, booking_date, status) 
                    VALUES (:user_id, NOW(), :status)";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        
            if ($stmt->execute()) {
                return (int) $this->conn->lastInsertId();
            }
        
            return null;
        }

        
    }