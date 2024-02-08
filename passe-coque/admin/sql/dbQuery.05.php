<html lang="en">
  <!--
   ! A Form to query the nl-subscribers table, to get the HelloAsso card
   +-->
  <head>
    <!--meta charset="UTF-8">
    <meta charset="ISO-8859-1"-->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Query Members</title>
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
    <h1>PHP / MySQL. Members and cards</h1>

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
      $name = $_POST['full-name']; 

      $link = mysqli_init();  // Mandatory ?
    
      echo("Will connect on ".$database." ...<br/>");
      $link = new mysqli($dbhost, $username, $password, $database);
    
      if ($link->connect_errno) {
        echo("Oops, errno:".$link->connect_errno."...<br/>");
        die("Connection failed: " . $conn->connect_error);
      } else {
        echo("Connected.<br/>");
      }
    
      $sql = 'SELECT
          CONCAT(
              UPPER(PCM.MEMBER_FIRST_NAME),
              \' \',
              PCM.MEMBER_LAST_NAME
          ) AS NAME,
          PCM.CARD_URL 
      FROM 
          PC_MEMBERS PCM
      WHERE 
           UPPER(PCM.MEMBER_FIRST_NAME) LIKE UPPER(\'%' . $name . '%\') OR 
           UPPER(PCM.MEMBER_LAST_NAME) LIKE UPPER(\'%' . $name . '%\')
      ORDER BY 1;';
      
      echo('Performing query <code>' . $sql . '</code><br/>');
    
      // $result = mysql_query($sql, $link);
      $result = mysqli_query($link, $sql);
      echo ("Returned " . $result->num_rows . " row(s)<br/>");
    
      echo("<h2>Members, and their card</h2>");
      echo "<table>";
      while ($table = mysqli_fetch_array($result)) { // go through each row that was returned in $result
        echo("<tr><td>" . urldecode($table[0]) . "</td><td> <a href='" . $table[1] . "' target='HA'>HelloAsso Card</a> </td></tr>\n"); 
      }
      echo "</table>";
      
      // On ferme !
      $link->close();
      echo("Closed DB<br/>".PHP_EOL);
    } catch (Throwable $e) {
      echo "Captured Throwable for connection : " . $e->getMessage() . "<br/>" . PHP_EOL;
    }
    echo("<hr/>" . PHP_EOL);
    // echo("Again ? Click <a href='#'>Here</a>.");
    ?>
    <form action="dbQuery.05.php" method="get">
      <!--input type="hidden" name="operation" value="blank"-->
      <table>
        <tr>
          <td colspan="2" style="text-align: center;"><input type="submit" value="Again ?"></td>
        </tr>
      </table>
    </form>
    <?php
  }
} else { // Then display the form
    ?>
    <!--form action="dbQuery.03.php" method="post"-->
    <form action="#" method="post">
      <input type="hidden" name="operation" value="query">
      <table>
        <tr>
          <td valign="top">Name (part of):</td><td><input type="text" name="full-name" size="40"></td>
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