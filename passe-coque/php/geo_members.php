<?php

$username = "passecc128";
$password = "zcDmf7e53eTs";
$database = "passecc128";
$dbhost = "passecc128.mysql.db";

$VERBOSE = false;

/*
 * Get users' positions and other stuff from table PC_TRACKER, in JSON format.
 * No HTML involved, absolutely none.
 */

function getPositions($dbhost, $username, $password, $database, $verbose) {
    try {
        $link = new mysqli($dbhost, $username, $password, $database);
        
        if ($link->connect_errno) {
            echo("[Oops, errno:".$link->connect_errno."...] ");
            die("Connection failed: " . $conn->connect_error);
        } else {
            if ($verbose) {
                echo("[Connected.] ");
            }
        }
        $sql = "SELECT DISTINCT LATITUDE, LONGITUDE, PLATFORM, BROWSER_LANGUAGE FROM PC_TRACKER WHERE LATITUDE IS NOT NULL AND LONGITUDE IS NOT NULL;";
        if ($verbose) {
            echo('[Performing instruction ['.$sql.']] ');
        }
        
        $result = mysqli_query($link, $sql);
        if ($verbose) {
            echo ("Returned " . $result->num_rows . " row(s)<br/>");
        }

        $json_result = "[";
        $first = true;
        while ($table = mysqli_fetch_array($result)) { // go through each row that was returned in $result
            $next_element = "{ \"latitude\": " . $table[0] . ", \"longitude\": " . $table[1] . ", \"platform\": \"" . $table[2] . "\", \"lang\": \"" . $table[3] . "\" } ";
            // echo $next_element . "<br/>" . PHP_EOL;
            $json_result = $json_result . ($first ? "" : ", ") . $next_element;
            $first = false;
        }
        $json_result = $json_result . "]";

        // On ferme !
        $link->close();
        if ($verbose) {
            echo("[Closed DB] ".PHP_EOL);
            echo "Finally, returning $json_result";
        }
        return $json_result;

    } catch (Throwable $e) {
        echo "[ Captured Throwable for connection : " . $e->getMessage() . "] " . PHP_EOL;
        throw $e;
    }                
    return null;
}

try {
    $data = getPositions($dbhost, $username, $password, $database, $VERBOSE);
    header('Content-Type: application/json; charset=utf-8');
    // echo json_encode($data); // This is for text (not json)
    echo $data;
    http_response_code(200);
} catch (Throwable $e) {
    echo "[Captured Throwable for geo_members.php : " . $e . "] " . PHP_EOL;
}
?>
