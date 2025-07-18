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

        //Get all booking with details
        public function getAllWithDetails(): array {
            $sql = "
                SELECT 
                    b.booking_id,
                    b.booking_date,
                    b.status,
                    u.user_id,
                    u.name AS user_name,
                    bd.schedule_id,
                    bd.ticket_type_id,
                    bd.quantity,
                    bd.price,
                    s.departure_time,
                    bt.name AS boat_name,
                    tt.name AS ticket_type_name
                FROM bookings b
                JOIN users u ON b.user_id = u.user_id
                JOIN booking_details bd ON b.booking_id = bd.booking_id
                JOIN schedules s ON bd.schedule_id = s.schedule_id
                JOIN boats bt ON s.boat_id = bt.boat_id
                JOIN ticket_types tt ON bd.ticket_type_id = tt.ticket_type_id
                ORDER BY b.booking_date DESC
            ";
        
            $stmt = $this->conn->query($sql);
            $rawData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
            // Group by booking_id
            $grouped = [];
        
            foreach ($rawData as $row) {
                $booking_id = $row['booking_id'];
        
                if (!isset($grouped[$booking_id])) {
                    $grouped[$booking_id] = [
                        'booking_id' => $booking_id,
                        'booking_date' => $row['booking_date'],
                        'status' => $row['status'],
                        'user_id' => $row['user_id'],
                        'user_name' => $row['user_name'],
                        'details' => []
                    ];
                }
        
                $grouped[$booking_id]['details'][] = [
                    'schedule_id' => $row['schedule_id'],
                    'departure_time' => $row['departure_time'],
                    'boat_name' => $row['boat_name'],
                    'ticket_type_id' => $row['ticket_type_id'],
                    'ticket_type_name' => $row['ticket_type_name'],
                    'quantity' => $row['quantity'],
                    'price' => $row['price']
                ];
            }
        
            // Reindex to array
            return array_values($grouped);
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

        public function createFromApi(int $user_id, array $items): ?int{
            try{
                $this->conn->beginTransaction();

                //1. Create the booking
                $sql = "INSERT INTO bookings (user_id) VALUES (?)";
                $stmt = $this->conn->prepare($sql);
                $stmt->execute([$user_id]);
                $booking_id = $this->conn->lastInsertId();

                //2. Loop through cart items (each item = 1 schedule + ticket_type + quanitty)
                foreach ($items as $item){
                    $schedule_id = $item['schedule_id'];
                    $ticket_type_id = $item['ticket_type_id'];
                    $quantity = $item['quantity'];

                    //3.Get ticket price
                    $priceSql = "SELECT price FROM schedule_prices WHERE schedule_id = ? AND ticket_type_id = ?";
                    $priceStmt = $this->conn->prepare($priceSql);
                    $priceStmt->execute([$schedule_id,$ticket_type_id]);
                    $price = $priceStmt->fetchColumn();

                    if($price === false){
                        throw new \Exception("Invalid schedule or ticket type");
                    }

                    //4. Add booking details
                    $bdSql = "INSERT INTO booking_details (booking_id, schedule_id, ticket_type_id, quantity, price)
                                VALUES (?,?,?,?,?)";
                    $bdStmt = $this->conn->prepare($bdSql);
                    $bdStmt->execute([$booking_id,$schedule_id,$ticket_type_id,$quantity,$price]);

                    //5. Deduct available seats
                    $deductSql = "UPDATE schedules SET available_seats = available_seats - ? WHERE schedule_id = ? AND available_seats >= ?";
                    $deductStmt = $this->conn->prepare($deductSql);
                    $deducted = $deductStmt->execute([$quantity,$schedule_id,$quantity]);

                    if(!$deducted || $deductStmt->rowCount() === 0){
                        throw new \Exception("Not enough seats available");
                    }
                }

                $this->conn->commit();
                return (int)$booking_id;
            }catch(Exception $e){
                $this->conn->rollBack();
                error_log($e->getMessage());
                return null;
            }
        }

        
    }