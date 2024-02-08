<html lang="en">
  <!--
   ! A Form to query the number of views on the site.
   +-->
  <head>
    <!--meta charset="UTF-8">
    <meta charset="ISO-8859-1"-->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Site Hits</title>
    <style type="text/css">
      * {
        font-family: 'Courier New'
      }

      tr > td, th {
        border: 1px solid silver;
      }
      h1 {
        /* text-stroke: 2px orange; */ /* Might not be supported */
        font-size: 3em;
        color: black;
        -webkit-text-fill-color: white; /* Will override color (regardless of order) */
        -webkit-text-stroke: 3px black;
      }
    </style>
  </head>
  <body>
    <h1>PHP / MYSQL. Hits</h1>

    <?php
// phpinfo();

$NS = 1;
$EW = 2;

function decToSex($value, $type) {
  global $NS, $EW;

  $absValue = abs($value);
  $intValue = floor($absValue);
  $dec = $absValue - $intValue;
  $dec *= 60;

  $formatted = $intValue . "&deg;" . number_format($dec, 2) . "'";
  $sign = "N";
  if ($type == $EW) {
    $sign = "E";
  }
  if ($value < 0) {
    if ($type == $NS) {
      $sign = "S";
    } else {
      $sign = "W";
    }
  }
  return $sign . " " . $formatted;
}

$username = "passecc128";
$password = "zcDmf7e53eTs";
$database = "passecc128";
$dbhost = "passecc128.mysql.db";

if (isset($_POST['operation'])) {
  $operation = $_POST['operation'];
  if ($operation == 'query') { // Then do the query
    try {
      // $link = mysqli_init();  // Mandatory ?
    
      echo("Will connect on ".$database." ...<br/>");
      $link = new mysqli($dbhost, $username, $password, $database);
    
      if ($link->connect_errno) {
        echo("Oops, errno:".$link->connect_errno."...<br/>");
        die("Connection failed: " . $conn->connect_error);
      } else {
        echo("Connected.<br/>");
      }
    
      $sql = 'SELECT COUNT(CLIENT_IP) AS NB_HIT, MIN(EVENT_DATE) AS SINCE, PLATFORM, BROWSER_LANGUAGE, LATITUDE, LONGITUDE FROM PC_TRACKER GROUP BY CLIENT_IP ORDER BY 1 DESC, 2;'; 
      //             |                           |                         |         |                 |         |
      //             |                           |                         |         |                 |         5
      //             |                           |                         |         |                 4
      //             |                           |                         |         3
      //             |                           |                         2
      //             |                           1
      //             0
      
      echo('Performing query <code>'.$sql.'</code><br/>');
    
      // $result = mysql_query($sql, $link);
      $result = mysqli_query($link, $sql);
      echo ("Returned " . $result->num_rows . " row(s)<br/>" . PHP_EOL);
    
      echo("<h2>Hits on the site</h2>" . PHP_EOL);
      echo("<table>" . PHP_EOL);
      echo("<tr><th>Hits</th><th>Since</th><th>Platform</th><th>Language</th><th>From Position</th><th>Raw Pos</th></tr>" . PHP_EOL);
      while ($table = mysqli_fetch_array($result)) { // go through each row that was returned in $result
        // echo "table contains ". count($table) . " entry(ies).<br/>";
        echo("<tr>" . PHP_EOL);
        echo("<td>" . $table[0] . "</td>" . PHP_EOL);
        echo("<td>" . $table[1] . "</td>" . PHP_EOL);
        echo("<td>" . $table[2] . "</td>" . PHP_EOL);
        echo("<td>" . $table[3] . "</td>" . PHP_EOL);
        if ($table[4] !== null && $table[5] !== null) {
          echo("<td>" . decToSex($table[4], $NS) . " / " . decToSex($table[5], $EW) . "</td>" . PHP_EOL);
          echo("<td>" . $table[4] . " / " . $table[5] . "</td>" . PHP_EOL);
        } else {
          echo("<td colspan=\"2\">unknown</td>" . PHP_EOL);
        }
        echo("</tr>" . PHP_EOL);
      }
      echo("</table>" . PHP_EOL);

      // On ferme !
      $link->close();
      echo("Closed DB<br/>".PHP_EOL);
    } catch (Throwable $e) {
      echo "Captured Throwable for connection : " . $e->getMessage() . "<br/>" . PHP_EOL;
    }
    
  } else {
    echo "Unsupported operation $operation";
  }
} else { // Then display the form
    ?>
    <form action="dbQuery.07.php" method="post">
      <input type="hidden" name="operation" value="query">
      <table>
        <tr>
          <td colspan="2" style="text-align: center;"><input type="submit" value="Query..."></td>
        </tr>
      </table>
    </form>
    <?php
}  
    ?>        
  </body>        
</html>