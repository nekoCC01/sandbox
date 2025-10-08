<?php
/**
 * Created by PhpStorm.
 * User: daniel.kasai
 * Date: 2021-02-12
 * Time: 14:35
 */

$authOK = false;
$user = $_SERVER['PHP_AUTH_USER'] ?? null;
$password = $_SERVER['PHP_AUTH_PW'] ?? null;

if ($user === null || $password === null) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
    if (is_string($authHeader) && stripos($authHeader, 'basic ') === 0) {
        $decoded = base64_decode(substr($authHeader, 6));
        if ($decoded !== false) {
            [$user, $password] = array_pad(explode(':', $decoded, 2), 2, null);
        }
    }
}

if (isset($user, $password) && $user === strrev((string) $password)) {
    $authOK = true;
}

if (!$authOK) {
    header('WWW-Authenticate: Basic realm="Top Secret Files"');
    header('HTTP/1.0 401 Unauthorized');

    // anything else printed here is only seen if the client hits "Cancel"
    exit;
}
?>

<!-- your password-protected document goes here -->
 <h1>Welcome to the secret place</h1>
