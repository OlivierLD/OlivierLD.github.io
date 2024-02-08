<html lang="en">
  <!--
   ! A Form to query the nl-subscribers table
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

      tr > td {
        border: 1px solid silver;
      }
    </style>
  </head>
  <body>
    <h1>PHP / MySQL. Fee renewal (V1)</h1>

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
      // $email =  $_POST['email'];

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
      $sql = 'SELECT
      `reference`,
      `command-date`,
      CONCAT(
          \'In \',
          365 - TIMESTAMPDIFF(
              DAY,
              `command-date`,
              CURRENT_TIMESTAMP()),
              \' Day(s)\'
          ) AS \'When\',
          CONCAT(
              `member-first-name`,
              \' \',
              `member-last-name`
          ) AS NAME
      FROM
          `pc-members`
      WHERE
          TIMESTAMPDIFF(
              DAY,
              `command-date`,
              CURRENT_TIMESTAMP()) > 335
      ORDER BY 1 DESC, 2;'; 
      
      echo('Performing query <code>'.$sql.'</code><br/>');
    
      // $result = mysql_query($sql, $link);
      $result = mysqli_query($link, $sql);
      echo ("Returned " . $result->num_rows . " row(s)<br/>");
    
      echo("<h2>Cotisation to be renewed in less than 1 month</h2>");
      echo "<table>";
      while ($table = mysqli_fetch_array($result)) { // go through each row that was returned in $result
        // echo "table contains ". count($table) . " entry(ies).<br/>";
        // echo("id:" . $table[0] . ", name:" . $table[1] . ", email:" . $table[2] . "<br/>");    // print the table that was returned on that row.
        echo("<tr><td>" . $table[0] . "</td><td>" . $table[1] . "</td><td>" . $table[2] . "</td><td>" . $table[3] . "</td></tr>\n"); 
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
    ?>
    <!--form action="dbQuery.03.php" method="post"-->
    <form action="#" method="post">
      <input type="hidden" name="operation" value="query">
      <table>
        <!--tr>
          <td valign="top">Email (part of):</td><td><input type="text" name="email" size="40"></td>
        </tr-->
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