<html lang="en">
  <!--
   ! A Form to query the number of views on the site.
   +-->
  <head>
    <!--meta charset="UTF-8">
    <meta charset="ISO-8859-1"-->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Site Nb Views</title>
    <style type="text/css">
      * {
        font-family: 'Courier New'
      }

      tr > td {
        border: 1px solid silver;
      }
    </style>
  </head>
  <body>
    <h1>PHP / MYSQL. NB Views</h1>

    <?php
// phpinfo();

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
    
      $sql = 'SELECT A.AMOUNT FROM PC_NUMBERS A WHERE A.ID = \'NB_VIEWS\' ;'; 
      
      echo('Performing query <code>'.$sql.'</code><br/>');
    
      // $result = mysql_query($sql, $link);
      $result = mysqli_query($link, $sql);
      echo ("Returned " . $result->num_rows . " row(s)<br/>");
    
      echo("<h2>Number of views of the site</h2>");

      while ($table = mysqli_fetch_array($result)) { // go through each row that was returned in $result
        // echo "table contains ". count($table) . " entry(ies).<br/>";
        // echo("id:" . $table[0] . ", name:" . $table[1] . ", email:" . $table[2] . "<br/>");    // print the table that was returned on that row.
        echo("<b>Site was viewed " . $table[0] . " time(s).</b><br/>" . PHP_EOL); 
      }

      
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
    <form action="dbQuery.06.php" method="post">
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