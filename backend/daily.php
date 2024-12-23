<?php 
    //Used by daily.js, whenever someone navigates the site and the daily challenge needs to be updated

    header("Content-Type:application/json");
    $dsn = "mysql:host=localhost:8080;dbname=mathattack";
    $username = "phpuser";
    $password = "pa55word";

   
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $_POST = json_decode(file_get_contents('php://input'), true);
        $type = $_POST["type"];

         //check the date
        if ($type == "date_check") {
            $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = "SELECT * FROM server_date LIMIT 1";
            $statement = $db->prepare($query);
            $statement->execute();
            $value = $statement->fetch();		
            $statement->closeCursor();
            echo json_encode($value);
        }
        
        else if ($type == "extract_questions") {
            $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = "SELECT * FROM daily_bank";
            $statement = $db->prepare($query);
            $statement->execute();
            $value = $statement->fetchAll();		
            $statement->closeCursor();
            echo json_encode($value);
        }
    }

    else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $_PUT = json_decode(file_get_contents('php://input'), true);
        $type = $_PUT["type"];

        if ($type == "server_date") {
            $date = $_PUT["date"];

            $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = "UPDATE server_date SET date=? 
                WHERE id=0";
            $statement = $db->prepare($query);				
            $statement->execute([$date]);		
            $statement->closeCursor();
            echo json_encode("Updated the date to $date!");
        }

        else if ($type == "daily_bank") {
            $id = $_PUT["id"];
            $question = $_PUT["question"];

            $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = "UPDATE daily_bank SET question=? 
                WHERE id=?";
            $statement = $db->prepare($query);				
            $statement->execute([$question, $id]);		
            $statement->closeCursor();
            echo json_encode("question $id is changed to this equation: $question");
            
        }
        
    }

    //empty the daily leaderboard on a new day
    else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $_DELETE = json_decode(file_get_contents('php://input'), true);

        $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = "DELETE from leaderboard_daily";
            $statement = $db->prepare($query);				
            $statement->execute();		
            $statement->closeCursor();
            echo json_encode("Daily leaderboard has been emptied!");
    }

    else {
        header("Location:./home.html");
    }
?>