<html>
  <head>
    <title>DB Query Test</title>
  </head>
  <body>
    <h1>PHP / MYSQL Test</h1>
    <h3>This does not work...</h3>
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

  $connx = mysql_connect($dbhost, $username, $password);
  echo("Will connect on ".$database." !<br/>");
  $db = mysql_select_db($database, $connx);

  // Dump link ?
  echo("Dumping db:<br/>");
  var_dump($db);
  echo("<br/>");

  echo("Moving on.<br/>");

  $sql = 'SELECT * FROM `nl-subscribers`;'; 
  echo('Performing query '.$sql.'<br/>');

  $result = mysql_query($sql);   

  // $result = $link->query($sql);

  echo('Query OK<br/>');
  echo("Dumping result:<br/>");
  var_dump($result);
  echo("<br/>");

  $result_count_row_get = mysql_num_rows($result);  
  $Erreur = mysql_error();
  echo (" -> Found ". $result_count_row_get . " records<br/>");

  if ($result_query) {
    $Count = 0;
    while ($result_query && $row = mysql_fetch_array($result)) { 
        $Count     = $Count + 1;
        $NOM       = $row['name'];
        $PRENOM    = $row['email'];
        echo " Table  Tab_test_DB : ".$Count." - \$NOM=".$NOM." - \$PRENOM=".$PRENOM." \n";
     }
  }  // }

  // mysql_close($link);   
  $closed = mysqli_close($db);     

  echo("Closed DB<br/>".PHP_EOL);


} catch (Throwable $e) {
  echo "Captured Throwable for connection : " . $e->getMessage() . "<br/>" . PHP_EOL;
}

echo("Bye!<br/>");
    ?>        
  </body>        
</html>