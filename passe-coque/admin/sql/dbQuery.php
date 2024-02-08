<html lang="en">
  <!--
   | PHP & MySQL playground...
   +-->
  <head>
    <meta charset="UTF-8">
    <meta charset="ISO-8859-1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>DB Query Test</title>
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
    <h1>PHP / MYSQL Tests. NL Subscribers list...</h1>
    <?php

// phpinfo();

$username = "passecc128";
$password = "zcDmf7e53eTs";
$database = "passecc128";
$dbhost = "passecc128.mysql.db";
$port = null;
$socket = null;
$client_flags = 0;

try {

  $link = mysqli_init();

  echo("Will connect on ".$database." ...<br/>");
  // mysql_connect("mysql", $username, $password);
  // $link = mysql_connect($dbhost, $username, $password, true, 0);
  // Works:
  // mysqli_real_connect($link, $dbhost, $username, $password); // , null, $port, $socket, $client_flags);
  // @mysql_select_db($database) or die("Unable to select database $database");

  $link = new mysqli($dbhost, $username, $password, $database);

  if ($link->connect_errno) {
    echo("Oops, errno:".$link->connect_errno."...<br/>");
    die("Connection failed: " . $conn->connect_error);
  } else {
    echo("Connected.<br/>");
  }

  // Dump link ?
  echo("Dumping link:<br/><pre>");
  var_dump($link);
  echo("</pre><br/>");

  echo("Moving on.<br/>");

  // Make email a unique key
  $sql = "CREATE TABLE IF NOT EXISTS `nl-subscribers` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'First and Last Name of the Subscriber',
    `email` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Email of the Subscriber',
    CONSTRAINT UK_email UNIQUE (`email`)
  ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT = 'News Letter Subscribers'";

  if ($link->query($sql) === TRUE) {
    echo "Table created successfully<br/>";
  } else {
    echo "Error creating table: " . $link->error . "<br/>";
  }

  // $sql = 'SELECT COUNT(`nl-subscribers`.*) '
  //         . ' FROM `nl-subscribers`'
  //         . ' ORDER BY `nl-subscribers`.`name` ASC LIMIT 0, 30 '; 

  // $sql = 'SELECT COUNT(*) FROM `nl-subscribers`;'; 
  $sql = 'SELECT * FROM `nl-subscribers`;'; 
  
  // $sql = 'SELECT * FROM `mod252_comments`;'; 
  // $sql = "SHOW TABLES;";

  echo('Performing query <code>'.$sql.'</code><br/>');

  // $result = mysql_query($sql, $link);
  $result = mysqli_query($link, $sql);
  // $rows = $result->fetch_all();

  // $result = $link->query($sql);

  echo('Query OK<br/>');
  echo("Dumping result:<br/><pre>");
  var_dump($result);
  echo("</pre><br/>");

  echo ("Returned " . $result->num_rows . " row(s)<br/>");

  echo("-----------<br/>");

  echo "<table>";
  while ($table = mysqli_fetch_array($result)) { // go through each row that was returned in $result
    // echo "table contains ". count($table) . " entry(ies).<br/>";
    // echo("id:" . $table[0] . ", name:" . $table[1] . ", email:" . $table[2] . "<br/>");    // print the table that was returned on that row.
    echo("<tr><td>" . $table[0] . "</td><td>" . $table[1] . "</td><td>" . $table[2] /*. "</td><td>" . $table[3] . "</td><td>" . $table[4] . "</td><td>" . $table[5]*/ . "</td></tr>"); 
  }
  echo "</table>";
  echo("-----------<br/>");
  

  // $num = mysql_numrows($result);
  // echo "Returned $num row(s)<br>";
  // $nodes_array = mysqli_fetch_array($result);

  // $row = mysqli_fetch_array($result); // , MYSQLI_BOTH);
  $row = mysqli_fetch_all($result); // , MYSQLI_BOTH);

  // $rows = $result->fetch_all();
  echo("Rows OK<br/><pre>");
  var_dump($row);
  echo("</pre><br/>");
  echo ("Returned " . count($row) . " row(s)<br/>");

  // printf("%s (%s) <br/>\n", $row[0], $row["name"]);


  // if ( empty( $modes_array[0] ) ) {
  //   echo('No row returned<br/>');
  //   // return;
  // } else {
  //   $modes_str = $modes_array[0];
  //   echo('Returned:'.$modes_str."<br/>");

  //   $i=0;
  //   while ($i < $num) {

  //     $subscriberName = mysql_result($result, $i, "name");
  //     echo "Subscriber name: <b>$subscriberName</b>";

  //     $i++;
  //   }
  // }

  // mysql_close($link);   
  // $closed = mysqli_close($link);     
  $link->close();
  echo("Closed DB<br/>".PHP_EOL);


} catch (Throwable $e) {
  echo "Captured Throwable for connection : " . $e->getMessage() . "<br/>" . PHP_EOL;
}

echo("Bye!<br/>");
    ?>        
  </body>        
</html>