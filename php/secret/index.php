<?php
/**
 * Created by PhpStorm.
 * User: daniel.kasai
 * Date: 2021-02-12
 * Time: 14:35
 */

$authOK = false;

$user = $_SERVER['PHP_AUTH_USER'];
$password = $_SERVER['PHP_AUTH_PW'];

if (isset($user) && isset($password) && $user === strrev($password)) {
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