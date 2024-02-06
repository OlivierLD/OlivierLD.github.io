<?php
// phpinfo();

$username = "passecc128";
$password = "zcDmf7e53eTs";
$database = "passecc128";
$dbhost = "passecc128.mysql.db";

$VERBOSE = false;

/*
 * Receive POST data from php: 
 * https://www.tutorialspoint.com/how-to-receive-json-post-with-php
 */

 function incrementViews($dbhost, $username, $password, $database, $verbose) {
    try {
        // $link = mysqli_init();
        if ($verbose) {
          echo("[ Will connect on ".$database." ...] ");
        }
        $link = new mysqli($dbhost, $username, $password, $database);
      
        if ($link->connect_errno) {
          echo("[Oops, errno:".$link->connect_errno."...] ");
          die("Connection failed: " . $conn->connect_error);
        } else {
          if ($verbose) {
            echo("[Connected.] ");
          }
        }
      
        $sql = 'UPDATE PC_NUMBERS A SET A.AMOUNT = A.AMOUNT + 1 WHERE A.ID = \'NB_VIEWS\';';
        
        if ($verbose) {
          echo('[Performing instruction ['.$sql.']] ');
        }
      
        if ($link->query($sql) === TRUE) {
          echo "[OK. Table Updated] ";
        } else {
          echo "[ERROR: " . $sql . "<br/>" . $link->error . "] ";
        }
  
        // On ferme !
        $link->close();
        if ($verbose) {
          echo("[Closed DB] ".PHP_EOL);
        }
    } catch (Throwable $e) {
        echo "[ Captured Throwable for connection : " . $e->getMessage() . "] " . PHP_EOL;
        throw $e;
    }
}

function keepTrack($dbhost, $username, $password, $database, 
                   $ip, $appCodeName, $appName, $product, $appVersion,
                   $language, $platform, $userAgent, $latitude, $longitude, $verbose) {
    try {
        // $link = mysqli_init();
        if ($verbose) {
            echo("[ Will connect on ".$database." ...] ");
        }
        $link = new mysqli($dbhost, $username, $password, $database);
        
        if ($link->connect_errno) {
            echo("[Oops, errno:".$link->connect_errno."...] ");
            die("Connection failed: " . $conn->connect_error);
        } else {
            if ($verbose) {
            echo("[Connected.] ");
            }
        }
        if ($latitude == null) {
            $latitude = 'NULL';
        }
        if ($longitude == null) {
            $longitude = 'NULL';
        }
        $sql = "INSERT INTO PC_TRACKER (EVENT_DATE, CLIENT_IP, APP_CODE_NAME, BROWSER_NAME, PRODUCT, BROWSER_VERSION, BROWSER_LANGUAGE, PLATFORM, USER_AGENT, LATITUDE, LONGITUDE) 
                VALUES (CURRENT_TIMESTAMP(), '$ip', '$appCodeName', '$appName', '$product', '$appVersion', '$language', '$platform', '$userAgent', $latitude, $longitude);";
        
        if ($verbose) {
            echo('[Performing instruction ['.$sql.']] ');
        }
        
        if ($link->query($sql) === TRUE) {
            echo "[OK. Row Created] ";
        } else {
            echo "[ERROR: " . $sql . "<br/>" . $link->error . "] ";
        }

        // On ferme !
        $link->close();
        if ($verbose) {
            echo("[Closed DB] ".PHP_EOL);
        }
    } catch (Throwable $e) {
        echo "[ Captured Throwable for connection : " . $e->getMessage() . "] " . PHP_EOL;
        throw $e;
    }                
}

try {
    try {
        // See https://stackoverflow.com/questions/3003145/how-to-get-the-client-ip-address-in-php for more
        $ip = "";
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        echo "[Client IP: $ip]" . PHP_EOL;
    } catch (Throwable $e) {
        echo "[Captured Throwable for the client addr : " . $e . "] " . PHP_EOL;
    }

    $json = file_get_contents('php://input'); 
    $data = json_decode($json, true);

    // $data = $_POST;
    // Check if data is available
    if ($data !== null) {
        // Access the data and perform operations
        // $content = $data['content'];
        $appCodeName = $data['appCodeName'];
        $appName = $data['appName'];
        $product = $data['product'];
        $appVersion = $data['appVersion'];
        $language = $data['language'];
        $platform = $data['platform'];
        $userAgent = $data['userAgent']; 
        $latitude = $data['latitude'];
        $longitude = $data['longitude'];

        // Perform further processing or respond to the request
        if ($VERBOSE) {
            echo "[PHP received '" . $content . "', from " . $json . "] " . PHP_EOL; // $data displays as 'Array'...
        }
        // Update the DB here
        try {
            incrementViews($dbhost, $username, $password, $database, $VERBOSE);
        } catch (Throwable $spitout) {
            echo "[Captured Throwable for incrementViews : " . $spitout->getMessage() . "] " . PHP_EOL;
        }
        try {
            keepTrack($dbhost, $username, $password, $database, $ip, $appCodeName, $appName, $product, $appVersion,
                      $language, $platform, $userAgent, $latitude, $longitude, $VERBOSE);
        } catch (Throwable $spitout) {
            echo "[Captured Throwable for incrementViews : " . $spitout->getMessage() . "] " . PHP_EOL;
        }

        echo " { 'status': 'OK' }" . PHP_EOL;
        http_response_code(201);
    } else {
        // JSON decoding failed
        http_response_code(400); // Bad Request
        echo " { 'error': 'Invalid JSON data' }";
    }
} catch (Throwable $e) {
    echo "[Captured Throwable for nbViews.php : " . $e . "] " . PHP_EOL;
}
?>
