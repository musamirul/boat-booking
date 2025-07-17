<?php
namespace App\Controllers;

use App\Models\User;
use App\Models\Boat;
use App\Models\Schedule;
use App\Models\Bookings;
use App\Models\Payments;
use PDO;

class AdminController {
    private PDO $conn;

    public function __construct(PDO $db) {
        $this->conn = $db;
    }

    public function dashboardSummary(): array {
        $userModel = new User($this->conn);
        $boatModel = new Boat($this->conn);
        $scheduleModel = new Schedule($this->conn);
        $bookingModel = new Bookings($this->conn);
        $paymentModel = new Payments($this->conn);

        return [
            'total_users' => $userModel->countAll(),
            'total_boats' => $boatModel->countAll(),
            'total_schedules' => $scheduleModel->countAll(),
            'total_bookings' => $bookingModel->countAll(),
            'total_payments' => $paymentModel->sumPaidAmount(),
        ];
    }
}