<?php
require_once __DIR__ . '/../init.php';

use App\Controllers\AdminController;

$admin = new AdminController($db);
$summary = $admin->dashboardSummary();

echo "📊 Admin Dashboard Summary:\n";
print_r($summary);