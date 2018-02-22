<?php

require_once __DIR__.'/../../../config.php';

class User {
    private $id;
    private $username;
    private $email;
    private $password;
    private $passOptions;
    private $accessToken;
    private $conn;

    public function __construct()
    {
        $this->conn = new PDO('mysql:host='.DB_HOST.';dbname='. DB_NAME, DB_USERNAME, DB_PASSWORD);
        $this->passOptions = [
            'cost' => 11,
            'salt' => uniqid(mt_rand(), true)
        ];
    }

    public function passVerify($password)
    {
        if(password_verify($password, $this->password) === true){
            return true;
        }else{
            return false;
        }
    }

    public static function loadUser($username)
    {
        $conn = new PDO('mysql:host='.DB_HOST.';dbname='. DB_NAME, DB_USERNAME, DB_PASSWORD);
        $stmt = $conn->prepare('SELECT * FROM user WHERE username=:username');
        $result = $stmt->execute(
            ['username' => $username]
        );

        if ($result === true && $stmt->rowCount() > 0){
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $loadedUser = new User();
            $loadedUser->id = $row['id'];
            $loadedUser->username = $row['username'];
            $loadedUser->pass = $row['hashed_password'];
            $loadedUser->email = $row['email'];

            return $loadedUser;
        }
        return null;
    }


    public function setPass($newPass)
    {
        $hashedPass = password_hash($newPass, PASSWORD_BCRYPT, $this->passOptions);
        $this->password = $hashedPass;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @param mixed $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @return array
     */
    public function getAccessToken()
    {
        /* Create a part of token using secretKey and other stuff */
        $tokenGeneric = SECRET_KEY.$_SERVER["SERVER_NAME"]; // It can be 'stronger' of course

        /* Encoding token */
        $token = hash('sha256', $tokenGeneric.time());

        return array('token' => $token, 'userData' => $this->username);
    }


}