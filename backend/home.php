<?php 
    header("Content-Type:application/json");
    $dsn = "mysql:host=mathattack-db.c5com8eu61dl.us-east-2.rds.amazonaws.com;dbname=mathattack";
    $username = "phpuser";
    $password = "pa55word";

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $_POST = json_decode(file_get_contents('php://input'), true);
        $table_name = $_POST["table_name"];
    
        
        $db = new PDO($dsn, $username, $password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $query = "SELECT * FROM $table_name ORDER BY score DESC, time ASC";
        $statement = $db->prepare($query);
        //$statement->bindValue(':table_name', $table_name);				
        $statement->execute();
        $value = $statement->fetchAll();		
        $statement->closeCursor();

        echo json_encode($value);
    }

    else {
        header("Location:./home.html");
    }
?>