<?php

    namespace App\Models;

    use PDO;

    class Payments {
        private PDO $conn;
        private string $table = 'payments';

        public function __construct(PDO $db){
            $this->conn = $db;
        }

        //Create a new payment
        // public function create(int $booking_id, string $payment_method, float $amount, string $transaction_id, string $status, ?string $paid_at = null): bool{
        //     $sql = "INSERT INTO {$this->table} (booking_id, payment_method, amount, transaction_id, status, paid_at)
        //     VALUES (?,?,?,?,?,?)";
        //     $stmt = $this->conn->prepare($sql);
        //     return $stmt->execute([$booking_id, $payment_method, $amount, $transaction_id, $status, $paid_at]);
        // }
        public function recordPayment($bookingId, $amount, $method) {
            $stmt = $this->conn->prepare("INSERT INTO payments (booking_id, amount, payment_method, status) VALUES (?, ?, ?, 'paid')");
            $stmt->execute([$bookingId, $amount, $method]);
        
            // Update booking status
            $stmt2 = $this->conn->prepare("UPDATE bookings SET status = 'paid' WHERE booking_id = ?");
            $stmt2->execute([$bookingId]);
        
            return ['success' => true];
        }
        
        public function create(int $bookingId, string $method, float $amount, string $txnId): bool {
            $sql = "INSERT INTO {$this->table} (booking_id, payment_method, amount, transaction_id, status, paid_at) VALUES (?,?,?,?,?,NOW())";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([$bookingId, $method, $amount, $txnId, 'paid']);
        }

        //Get payment by booking ID
        public function getByBookingId(int $booking_id): ?array{
            $sql = "SELECT * FROM {$this->table} WHERE booking_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$booking_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
        }

        //Update payment status and paid_at (after successful callback)
        // public function updateStatus(int $payment_id, string $status, ?string $paid_at = null): bool{
        //     $sql = "UPDATE {$this->table} SET status = ?, paid_at = ? WHERE payment_id = ?";
        //     $stmt = $this->conn->prepare($sql);
        //     return $stmt->execute([$status,$paid_at,$payment_id]);
        // }
        public function updateStatus(int $paymentId, string $status): bool {
            $stmt = $this->conn->prepare("UPDATE {$this->table} SET status = ? WHERE payment_id = ?");
            return $stmt->execute([$status, $paymentId]);
        }

        //delete a payment
        public function delete(int $payment_id): bool{
            $sql = "DELETE FROM {$this->table} WHERE payment_id = ?";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([$payment_id]);
        }

        public function sumPaidAmount(): float {
            $stmt = $this->conn->query("SELECT SUM(amount) FROM {$this->table} WHERE status = 'paid'");
            return (float) $stmt->fetchColumn();
        }
    }