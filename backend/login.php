<?php 
    header("Content-Type:application/json");
    $dsn = "mysql:host=localhost:8080;dbname=mathattack";
    $username = "phpuser";
    $password = "pa55word";

    $_POST = json_decode(file_get_contents('php://input'), true);
    $website_user = $_POST["username"];
    $website_password = $_POST["password"];

    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $query = 'SELECT * FROM user_list WHERE user = :website_user LIMIT 1';
    $statement = $db->prepare($query);
    $statement->bindValue(':website_user', $website_user);				
    $statement->execute();
    $value = $statement->fetch();		
    $statement->closeCursor();

    echo json_encode($value);
?>