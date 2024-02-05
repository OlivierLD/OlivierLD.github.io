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
          echo("Will connect on ".$database." ...<br/>");
        }
        $link = new mysqli($dbhost, $username, $password, $database);
      
        if ($link->connect_errno) {
          echo("Oops, errno:".$link->connect_errno."...<br/>");
          die("Connection failed: " . $conn->connect_error);
        } else {
          if ($verbose) {
            echo("Connected.<br/>");
          }
        }
      
        $sql = 'UPDATE PC_NUMBERS A SET A.AMOUNT = A.AMOUNT + 1 WHERE A.ID = \'NB_VIEWS\';';
        
        if ($verbose) {
          echo('Performing instruction <code>'.$sql.'</code><br/>');
        }
      
        if ($link->query($sql) === TRUE) {
          echo "OK. Table Updated<br/>";
        } else {
          echo "ERROR: " . $sql . "<br/>" . $link->error . "<br/>";
        }
  
        // On ferme !
        $link->close();
        if ($verbose) {
          echo("Closed DB<br/>".PHP_EOL);
        }
      } catch (Throwable $e) {
        echo "Captured Throwable for connection : " . $e->getMessage() . "<br/>" . PHP_EOL;
        throw $e;
      }
 }

try {
    $json = file_get_contents('php://input'); 
    $data = json_decode($json, true);

    // $data = $_POST;
    // Check if data is available
    if ($data !== null) {
        // Access the data and perform operations
        $content = $data['content'];
        // Perform further processing or respond to the request
        if ($VERBOSE) {
            echo "PHP received '" . $content . "', from " . $json . PHP_EOL; // $data displays as 'Array'...
        }
        // Update the DB here
        try {
            incrementViews($dbhost, $username, $password, $database, $VERBOSE);
        } catch (Throwable $spitout) {
            echo "Captured Throwable for incrementViews : " . $spitout->getMessage() . PHP_EOL;

        }
        echo "{ 'status': 'OK' }" . PHP_EOL;
        http_response_code(201);
    } else {
        // JSON decoding failed
        http_response_code(400); // Bad Request
        echo "{ 'error': 'Invalid JSON data' }";
    }
} catch (Throwable $e) {
    echo "Captured Throwable for nbViews.php : " . $e . "<br/>" . PHP_EOL;
}
?>
