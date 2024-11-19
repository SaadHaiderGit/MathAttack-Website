<?php 
    header("Content-Type:application/json");
    $dsn = "mysql:host=localhost;dbname=mathattack";
    $username = "phpuser";
    $password = "pa55word";

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $_POST = json_decode(file_get_contents('php://input'), true);
        $table_name = $_POST["table_name"];
    
        //CHANGE THIS TO FIND TABLE TYPE, OR TO FORCE RELOCATE PEOPLE TO HOME.php IF THEY DIRECTLY ACCESS THIS PHP FILE
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