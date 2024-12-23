<?php 
    //Used in game_pages and in admin.html

    header("Content-Type:application/json");
    $dsn = "mysql:host=localhost:8080;dbname=mathattack";
    $username = "phpuser";
    $password = "pa55word";

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $_POST = json_decode(file_get_contents('php://input'), true);
        $type = $_POST["type"];

        if ($type == "check") {                 //check if user is in leaderboard; return values if found
            $table_name = $_POST["table_name"];
            $user = $_POST["user"];
        
            $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = "SELECT * FROM $table_name WHERE user = :user ORDER BY score DESC, time ASC";
            $statement = $db->prepare($query);
            $statement->bindValue(':user', $user);				
            $statement->execute();
            $value = $statement->fetch();		
            $statement->closeCursor();
            echo json_encode($value);
        }


        else if ($type == "save") {                 //save user to the leaderboard
            $table_name = $_POST["table_name"];
            $user = $_POST["user"];
            $score = $_POST["score"];
            $time = $_POST["time"];
        
            $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = "INSERT INTO $table_name (user, score, time) VALUES (?, ?, ?)";
            $statement = $db->prepare($query);				
            $statement->execute([$user, $score, $time]);		
            $statement->closeCursor();
            echo json_encode("Saved $user to the leaderboard $table_name.");
        }
    }

    else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $_PUT = json_decode(file_get_contents('php://input'), true);
        $table_name = $_PUT["table_name"];
        $user = $_PUT["user"];
        $score = $_PUT["score"];
        $time = $_PUT["time"];

        $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = "UPDATE $table_name SET score=?, time=? 
                WHERE user=?";
            $statement = $db->prepare($query);				
            $statement->execute([$score, $time, $user]);		
            $statement->closeCursor();
            echo json_encode("Updated $user's rank in the leaderboard $table_name.");
    }

    else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $_DELETE = json_decode(file_get_contents('php://input'), true);
        $table_name = $_DELETE["table_name"];
        $user = $_DELETE["user"];

        $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = "DELETE from $table_name
                WHERE user=?";
            $statement = $db->prepare($query);				
            $statement->execute([$user]);		
            $statement->closeCursor();
            echo json_encode("Deleted $user's ranking from the leaderboard $table_name.");
    }

    else {
        header("Location:./home.html");
    }
?>