<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for JSON response
header('Content-Type: application/json');

// Get the raw POST data
$json = file_get_contents('php://input');

// Decode the JSON data
$data = json_decode($json, true);

// Check if data is valid
if (!$data) {
    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully',
        'order_id' => $orderId,
        'redirect' => 'order_confirmation.php' // Add this line
    ]);
    
    exit;
}

// Connect to database
$conn = new mysqli('localhost', 'root', '', 'coke_store');

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit;
}

// Start transaction
$conn->begin_transaction();

try {
    // Insert customer data
    $stmt = $conn->prepare("INSERT INTO customers (first_name, last_name, email, phone, address, city, zip, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", 
        $data['customer']['firstName'], 
        $data['customer']['lastName'], 
        $data['customer']['email'], 
        $data['customer']['phone'], 
        $data['customer']['address'], 
        $data['customer']['city'], 
        $data['customer']['zip'], 
        $data['customer']['country']
    );
    $stmt->execute();
    $customerId = $conn->insert_id;
    
    // Insert order
    $stmt = $conn->prepare("INSERT INTO orders (customer_id, total, order_date) VALUES (?, ?, NOW())");
    $stmt->bind_param("id", $customerId, $data['total']);
    $stmt->execute();
    $orderId = $conn->insert_id;
    
    // Insert order items
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, price, size, quantity) VALUES (?, ?, ?, ?, ?, ?)");
    
    foreach ($data['items'] as $item) {
        $stmt->bind_param("iisdsi", 
            $orderId, 
            $item['id'], 
            $item['name'], 
            $item['price'], 
            $item['size'], 
            $item['quantity']
        );
        $stmt->execute();
    }
    
    // Commit transaction
    $conn->commit();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully',
        'order_id' => $orderId
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    
    // Return error response
    echo json_encode([
        'success' => false,
        'message' => 'Error processing order: ' . $e->getMessage()
    ]);
}

// Close connection
$conn->close();
?>