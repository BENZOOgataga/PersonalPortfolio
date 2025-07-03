<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name'], $data['email'], $data['subject'], $data['message'])) {
    http_response_code(400);
    exit('Missing fields');
}

$webhookURL = 'https://discord.com/api/webhooks/XXX/YYY'; // keep this secret

$payload = json_encode([
    'embeds' => [[
        'title' => '📧 New Contact Form Submission',
        'color' => 0x5A78FF,
        'fields' => [
            ['name' => '👤 Name', 'value' => $data['name'], 'inline' => true],
            ['name' => '📧 Email', 'value' => $data['email'], 'inline' => true],
            ['name' => '📝 Subject', 'value' => $data['subject']],
            ['name' => '💬 Message', 'value' => substr($data['message'], 0, 1000)],
        ],
        'timestamp' => date(DATE_ATOM),
        'footer' => ['text' => 'LyraStudio Contact Form']
    ]]
]);

$ch = curl_init($webhookURL);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

http_response_code(200);
echo 'OK';

// Log the response for debugging
file_put_contents('webhook.log', date('Y-m-d H:i:s') . " - Response: $response\n", FILE_APPEND);