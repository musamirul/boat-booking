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

        public function checkoutFromCart($userId) {
            // Load cart items
            $stmt = $this->conn->prepare("SELECT * FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.user_id = ?");
            $stmt->execute([$userId]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
            if (count($items) === 0) return ['error' => 'Cart is empty'];
        
            // Create booking
            $this->conn->beginTransaction();
            $stmt = $this->conn->prepare("INSERT INTO bookings (user_id, total_amount, status) VALUES (?, 0, 'pending')");
            $stmt->execute([$userId]);
            $bookingId = $this->conn->lastInsertId();
        
            $total = 0;
            foreach ($items as $item) {
                $scheduleId = $item['schedule_id'];
                $ticketTypeId = $item['ticket_type_id'];
                $quantity = $item['quantity'];
        
                // Get price
                $stmtPrice = $this->conn->prepare("SELECT price FROM schedule_prices WHERE schedule_id = ? AND ticket_type_id = ?");
                $stmtPrice->execute([$scheduleId, $ticketTypeId]);
                $price = $stmtPrice->fetchColumn();
                $amount = $quantity * $price;
                $total += $amount;
        
                // Save booking detail
                $stmtDetail = $this->conn->prepare("INSERT INTO booking_details (booking_id, schedule_id, ticket_type_id, quantity, price) VALUES (?, ?, ?, ?, ?)");
                $stmtDetail->execute([$bookingId, $scheduleId, $ticketTypeId, $quantity, $price]);
        
                // Deduct seats
                $stmtSeats = $this->conn->prepare("UPDATE schedules SET available_seats = available_seats - ? WHERE id = ?");
                $stmtSeats->execute([$quantity, $scheduleId]);
            }
        
            // Update total
            $stmtTotal = $this->conn->prepare("UPDATE bookings SET total_amount = ? WHERE id = ?");
            $stmtTotal->execute([$total, $bookingId]);
        
            // Clear cart
            $stmtClear = $this->conn->prepare("DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)");
            $stmtClear->execute([$userId]);
        
            $this->conn->commit();
            return ['success' => true, 'booking_id' => $bookingId, 'total' => $total];
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

        public function getBookingDetails(int $bookingId): array {
            $sql = "SELECT bd.booking_detail_id, b.name AS boat_name, s.departure_time, 
                           tt.name AS ticket_type, bd.quantity, sp.price
                    FROM booking_details bd
                    JOIN bookings bk ON bd.booking_id = bk.booking_id
                    JOIN schedules s ON bd.schedule_id = s.schedule_id
                    JOIN boats b ON s.boat_id = b.boat_id
                    JOIN ticket_types tt ON bd.ticket_type_id = tt.ticket_type_id
                    JOIN schedule_prices sp ON sp.schedule_id = bd.schedule_id AND sp.ticket_type_id = bd.ticket_type_id
                    WHERE bk.booking_id = :booking_id";
        
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':booking_id', $bookingId, PDO::PARAM_INT);
            $stmt->execute();
        
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function getBookingsByUser($userId) {
            $stmt = $this->conn->prepare("
                SELECT 
                    b.booking_id,
                    s.schedule_id,
                    s.departure_time,
                    b.status
                FROM bookings b
                JOIN booking_details bd ON b.booking_id = bd.booking_id
                JOIN schedules s ON bd.schedule_id = s.schedule_id
                WHERE b.user_id = ?
                ORDER BY b.booking_id DESC
                LIMIT 25
            ");
            $stmt->execute([$userId]);
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


        public function createFromApi(int $userId, array $items): ?int {
            try {
                $this->conn->beginTransaction();
        
                $sql = "INSERT INTO bookings (user_id, booking_date, status) VALUES (?, NOW(), 'pending')";
                $stmt = $this->conn->prepare($sql);
                $stmt->execute([$userId]);
                $bookingId = (int)$this->conn->lastInsertId();
        
                $detailSql = "INSERT INTO booking_details (booking_id, schedule_id, ticket_type_id, quantity, price) VALUES (?, ?, ?, ?, ?)";
                $detailStmt = $this->conn->prepare($detailSql);

                $updateSeatsSql = "UPDATE schedules SET available_seats = available_seats - ? WHERE schedule_id = ? AND available_seats >= ?";
                $updateSeatsStmt = $this->conn->prepare($updateSeatsSql);
        
                foreach ($items as $item) {
                    $price = $item['price'] ?? 0;
                    $quantity = $item['quantity'];
                    $scheduleId = $item['schedule_id'];
        
                    // Deduct seats: check if enough seats are available
                    $updateSeatsStmt->execute([$quantity, $scheduleId, $quantity]);
                    if ($updateSeatsStmt->rowCount() === 0) {
                        throw new \Exception("Not enough seats available for schedule ID {$scheduleId}");
                    }
        
                    $detailStmt->execute([
                        $bookingId,
                        $scheduleId,
                        $item['ticket_type_id'],
                        $quantity,
                        $price,
                    ]);
                }
        
                // Clear cart
                $clearCartSql = "DELETE ci FROM cart_items ci
                                 JOIN carts c ON ci.cart_id = c.cart_id
                                 WHERE c.user_id = ?";
                $clearCartStmt = $this->conn->prepare($clearCartSql);
                $clearCartStmt->execute([$userId]);
        
                $this->conn->commit();
                return $bookingId;
            } catch (Exception $e) {
                $this->conn->rollBack();
                error_log("Failed to create booking: " . $e->getMessage());
                return null;
            }
        }

        
    }