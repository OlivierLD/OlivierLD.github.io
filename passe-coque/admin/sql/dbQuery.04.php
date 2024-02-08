<html lang="en">
  <!--
   ! A Form to query the PC_MEMBERS table,
   ! Fee to renew in less that 30 days.
   +-->
  <head>
    <!--meta charset="UTF-8">
    <meta charset="ISO-8859-1"-->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Cotisation renweal</title>
    <style type="text/css">
      * {
        font-family: 'Courier New'
      }

      tr > td, tr > th {
        border: 1px solid silver;
      }
    </style>
  </head>
  <body>
    <h1>PHP / MySQL. Fee renewal (V2)</h1>

    <?php
// phpinfo();

$username = "passecc128";
$password = "zcDmf7e53eTs";
$database = "passecc128";
$dbhost = "passecc128.mysql.db";

if (isset($_POST['operation'])) {
  echo "That is a POST<br/>" . PHP_EOL;
  $operation = $_POST['operation'];
  if ($operation == 'query') { // Then do the query (see the form at the bottom)
    $namePattern = '';
    if (isset($_POST['member-name'])) {
      $namePattern = $_POST['member-name'];
    }

    try {
      // $link = mysqli_init();  // No mandatory
    
      echo("Will connect on ".$database." ...<br/>" . PHP_EOL);
      $link = new mysqli($dbhost, $username, $password, $database);
    
      if ($link->connect_errno) {
        echo("Oops, errno:".$link->connect_errno."...<br/>" . PHP_EOL);
        die("Connection failed: " . $conn->connect_error);
      } else {
        echo("Connected.<br/>" . PHP_EOL);
      }
    
      $sql = 'SELECT COUNT(*) FROM PC_MEMBERS;';
      $result = mysqli_query($link, $sql);
      $table = mysqli_fetch_array($result);
      echo ("<h2>Table contains " . $table[0] . " members(s)</h2><br/>" . PHP_EOL);

      $sql = 'SELECT
      PCM.REFERENCE,
      PCM.COMMAND_DATE,
      CONCAT(
          \'In \',
          365 - TIMESTAMPDIFF(
              DAY,
              PCM.COMMAND_DATE,
              CURRENT_TIMESTAMP()),
              \' Day(s)\'
          ) AS \'When\',
          CONCAT(
              PCM.MEMBER_FIRST_NAME,
              \' \',
              PCM.MEMBER_LAST_NAME
          ) AS NAME
      FROM
          PC_MEMBERS PCM
      WHERE
          (UPPER(PCM.MEMBER_FIRST_NAME) LIKE UPPER(\'%' . $namePattern . '%\') OR 
           UPPER(PCM.MEMBER_LAST_NAME) LIKE UPPER(\'%' . $namePattern . '%\')) AND
          TIMESTAMPDIFF(
              DAY,
              PCM.COMMAND_DATE,
              CURRENT_TIMESTAMP()) > 335
      ORDER BY 1 DESC, 2;'; 
      
      echo('Performing query <code>'.$sql.'</code><br/>' . PHP_EOL);
    
      // $result = mysql_query($sql, $link);
      $result = mysqli_query($link, $sql);
      echo ("Returned " . $result->num_rows . " row" . ($result->num_rows > 1 ? "" : "s") . "<br/>" . PHP_EOL);
    
      if ($result->num_rows > 0) {
        echo("<h2>Cotisations to be renewed in less than 1 month</h2>" . PHP_EOL);
        echo "<table>" . PHP_EOL;
        echo "<tr><th>ID</th><th>Last Fee Date</th><th>Renew in</th><th>Last &amp; First Name</th></tr>\n" . PHP_EOL;
        while ($table = mysqli_fetch_array($result)) { // go through each row that was returned in $result
          // echo "table contains ". count($table) . " entry(ies).<br/>";
          // echo("id:" . $table[0] . ", name:" . $table[1] . ", email:" . $table[2] . "<br/>");    // print the table that was returned on that row.
          echo("<tr><td>" . $table[0] . "</td><td>" . $table[1] . "</td><td>" . $table[2] . "</td><td>" . urldecode($table[3]) . "</td></tr>\n" . PHP_EOL); 
        }
        echo "</table>" . PHP_EOL;
      } else {
        echo "<h2>Query returned no row.</h2>" . PHP_EOL;
      }
      
      // On ferme !
      $link->close();
      echo("Closed DB<br/>".PHP_EOL);
    } catch (Throwable $e) {
      echo "Captured Throwable for connection : " . $e->getMessage() . "<br/>" . PHP_EOL;
    }
    echo("<hr/>" . PHP_EOL);
    // echo("Again ? Click <a href='#'>Here</a>.");
    ?>
    <form action="#" method="get">
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
  echo "This is NOT a POST<br/>" . PHP_EOL;
    ?>
    <!--form action="dbQuery.03.php" method="post"-->
    <form action="#" method="post">
      <input type="hidden" name="operation" value="query">
      <table>
        <tr>
          <td valign="top">Name (part of):</td><td><input type="text" name="member-name" size="40"></td>
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