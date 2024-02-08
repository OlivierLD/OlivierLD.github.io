<html lang="en">
  <!--
   ! A Form to query the nl-subscribers table
   +-->
  <head>
    <!--meta charset="UTF-8">
    <meta charset="ISO-8859-1"-->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Query NL Subscribers</title>
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
    <h1>PHP / MYSQL. Query News Letter subscribers</h1>

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
      $email =  $_POST['email'];

      $link = mysqli_init();  // Mandatory ?
    
      echo("Will connect on ".$database." ...<br/>");
      $link = new mysqli($dbhost, $username, $password, $database);
    
      if ($link->connect_errno) {
        echo("Oops, errno:".$link->connect_errno."...<br/>");
        die("Connection failed: " . $conn->connect_error);
      } else {
        echo("Connected.<br/>");
      }
    
      // $sql = 'SELECT COUNT(`nl-subscribers`.*) '
      //         . ' FROM `nl-subscribers`'
      //         . ' ORDER BY `nl-subscribers`.`name` ASC LIMIT 0, 30 '; 
    
      // $sql = 'SELECT COUNT(*) FROM `nl-subscribers`;'; 
      $sql = 'SELECT `name`, `email` FROM `nl-subscribers` WHERE `email` LIKE \'%' . $email . '%\'' . ';'; 
      
      echo('Performing query <code>'.$sql.'</code><br/>');
    
      // $result = mysql_query($sql, $link);
      $result = mysqli_query($link, $sql);
      echo ("Returned " . $result->num_rows . " row(s)<br/>");
    
      echo("<h2>News Letter Subscribers</h2>");
      echo "<table>";
      while ($table = mysqli_fetch_array($result)) { // go through each row that was returned in $result
        // echo "table contains ". count($table) . " entry(ies).<br/>";
        // echo("id:" . $table[0] . ", name:" . $table[1] . ", email:" . $table[2] . "<br/>");    // print the table that was returned on that row.
        echo("<tr><td>" . $table[0] . "</td><td>" . $table[1] . "</td></tr>"); 
      }
      echo "</table>";
      
      // On ferme !
      $link->close();
      echo("Closed DB<br/>".PHP_EOL);
    } catch (Throwable $e) {
      echo "Captured Throwable for connection : " . $e->getMessage() . "<br/>" . PHP_EOL;
    }
    
  }
} else { // Then display the form
    ?>
    <form action="dbQuery.02.php" method="post">
      <input type="hidden" name="operation" value="query">
      <table>
        <tr>
          <td valign="top">Email (part of):</td><td><input type="text" name="email" size="40"></td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center;"><input type="submit" value="Query"></td>
        </tr>
      </table>
    </form>
    <?php
}  
    ?>        
  </body>        
</html>