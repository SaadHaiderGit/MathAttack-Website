<?php 
    header("Content-Type:application/json");
    $dsn = "mysql:host=localhost;dbname=demo_registration";
    $username = "phpuser";
    $password = "pa55word";

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $_POST = json_decode(file_get_contents('php://input'), true);
        $type = $_POST["type"];
        
         if ($type == "validate") {                      //validate all values  
            $umid = $_POST["umid"];
            $first_name = $_POST["first_name"];
            $last_name = $_POST["last_name"];
            $email = $_POST["email"];
            $phone_number = $_POST["phone_number"];

            $check_umid = preg_match('/^\d{8}$/', $umid);
            $check_first_name = preg_match('/^[a-zA-Z]+$/', $first_name);
            $check_last_name = preg_match('/^[a-zA-Z]+$/', $last_name);
            $check_email = filter_var($email, FILTER_VALIDATE_EMAIL);
            $check_phone_number = preg_match('/^\d{3}-\d{3}-\d{4}$/', $phone_number);

            $response['umid'] = $check_umid;
            $response['first_name'] = $check_first_name;
            $response['last_name'] = $check_last_name;
            $response['email'] = $check_email;
            $response['phone_number'] = $check_phone_number;

            $result = json_encode($response);
            echo $result;
        }
        

        else if ($type == "matching_umid") {               //check if umid already is registered for a time slot 
            $umid = $_POST["umid"];

            $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = 'SELECT * FROM time_slot_booking WHERE umid = :umid LIMIT 1';
            $statement = $db->prepare($query);
            $statement->bindValue(':umid', $umid);				
            $statement->execute();
            $value = $statement->fetch();		
            $statement->closeCursor();

            echo json_encode($value);
        }


        else if ($type == "post_to_db") {                  //save time slot for a new umid
            $slot = $_POST["slot"];
            $umid = $_POST["umid"];
            $first_name = $_POST["first_name"];
            $last_name = $_POST["last_name"];
            $project_title = $_POST["project_title"];
            $email = $_POST["email"];
            $phone_number = $_POST["phone_number"];

            $db = new PDO($dsn, $username, $password);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = 'INSERT INTO time_slot_booking (slot, umid, first_name, last_name, project_title, email, phone_number)
                        VALUES (?, ?, ?, ?, ?, ?, ?)';
            $statement = $db->prepare($query);				
            $statement->execute([$slot, $umid, $first_name, $last_name, $project_title, $email, $phone_number]);		
            $statement->closeCursor();
            echo json_encode("Your registration has been saved.");
        }

        else {
            try {
                $db = new PDO($dsn, $username, $password);
                $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $query = 'SELECT * FROM time_slot_booking';
                $statement = $db->prepare($query);				
                $statement->execute();
                $value = $statement->fetchAll();		
                $statement->closeCursor();
                echo json_encode($value);
    
            } catch(PDOException $e) {
                echo json_encode("Connection failed: " . $e->getMessage());
            }
        }
    }


    else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {       //for existing umid, update the time slot (and other values)
        $_PUT = json_decode(file_get_contents('php://input'), true);
        $slot = $_PUT["slot"];
        $umid = $_PUT["umid"];
        $first_name = $_PUT["first_name"];
        $last_name = $_PUT["last_name"];
        $project_title = $_PUT["project_title"];
        $email = $_PUT["email"];
        $phone_number = $_PUT["phone_number"];

        $db = new PDO($dsn, $username, $password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $query = 'UPDATE time_slot_booking SET slot=?, first_name=?, last_name=?, project_title=?, email=?, phone_number=?
                    WHERE umid=?';
        $statement = $db->prepare($query);				
        $statement->execute([$slot, $first_name, $last_name, $project_title, $email, $phone_number, $umid]);		
        $statement->closeCursor();
        echo json_encode("Your registration has been updated.");

        /*$response['slot'] = $slot;
        $response['umid'] = $umid;
        $response['first_name'] = $first_name;
        $response['last_name'] = $last_name;
        $response['project_title'] = $project_title;
        $response['email'] = $email;
        $response['phone_number'] = $phone_number;
        $result = json_encode($response);
        echo $result;*/
    }


    else {                                                  //check registrations per time slot (used to disable full slots)
        
    }
?>
