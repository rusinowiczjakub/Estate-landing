<?php

require_once __DIR__.'/login.php';
require_once __DIR__.'/src/class/User.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === "POST") {

    if (isset($_POST['password']) && isset($_POST['username'])) {
        $user = User::loadUser($_POST['username']);

        if ($user->passVerify($_POST['password'])) {
            $tokenData = $user->getAccessToken();

            $_SESSION['token'] = $tokenData['token'];
            $_SESSION['userData'] = $tokenData['userData'];

            header("Location: admin.php");
        } else {
            echo json_encode([
                'status' => 0,
                'msg' => 'Nieprawidłowa nazwa użytkownika lub hasło'
            ]);

            return false;
        }
    }

}

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    include_once __DIR__.'/../app/html/loginForm.html';
}