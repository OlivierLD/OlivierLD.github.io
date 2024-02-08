<html lang="en">
  <!--
   ! Authentication.
   ! Crendentials stored in DB
   +-->
  <head>
    <!--meta charset="UTF-8">
    <meta charset="ISO-8859-1"-->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>User Authentication</title>
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
    <h1>PHP / MySQL. User Authentication</h1>

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

      $form_username = $_POST['username'];
      $form_password = $_POST['password'];
    
      echo("Will connect on ".$database." ...<br/>");
      $link = new mysqli($dbhost, $username, $password, $database);
    
      if ($link->connect_errno) {
        echo("Oops, errno:".$link->connect_errno."...<br/>");
        die("Connection failed: " . $conn->connect_error);
      } else {
        echo("Connected.<br/>");
      }
    
      $sql = "SELECT PASSWORD FROM PC_USERS WHERE USERNAME = '$form_username';"; 
      
      echo('Performing query <code>'.$sql.'</code><br/>');
    
      // $result = mysql_query($sql, $link);
      $result = mysqli_query($link, $sql);
      echo ("Returned " . $result->num_rows . " row(s)<br/>" . PHP_EOL);
      if ($result->num_rows == 0) {
        echo "No such user $form_username" . PHP_EOL;
      } else if ($result->num_rows > 1) {
        echo "More than one entry for $form_username, wierd..." . PHP_EOL;
      } else {
        echo("<h2>Validating credentials</h2>" . PHP_EOL);
        while ($table = mysqli_fetch_array($result)) { // go through each row that was returned in $result
          // echo "table contains ". count($table) . " entry(ies).<br/>";
          $db_password = $table[0];
        }
        if ($db_password == $form_password) { // Valid.
          $_SERVER['PHP_AUTH_USER'] = $form_username;
          $_SERVER['PHP_AUTH_PW'] = $form_password;
          // Welcome !
          // If arrives here, is a valid user.
          echo "<p>Welcome " . $_SERVER['PHP_AUTH_USER'] . ".</p>" . PHP_EOL;
          echo "<p>Congratulation, you are now into the system.</p>" . PHP_EOL;
          // header('WWW-Authenticate: Basic realm="Passe-Coque Realm"');
        } else {
          // The header show the login alert...
          // header('WWW-Authenticate: Basic realm="Passe-Coque Realm"');
          // header('HTTP/1.0 401 Unauthorized');
          // die ("Not authorized");
          echo "Not authorized...<br/>";
          unset($_SERVER['PHP_AUTH_USER']);
          unset($_SERVER['PHP_AUTH_PW']);

          http_response_code(401);
        }
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
    <form action="dbQuery.08.php" method="post">
      <input type="hidden" name="operation" value="query">
      <table>
        <tr>
          <td>Username</td>
          <td><input type="text" name="username"></td>
        </tr>
        <tr>
          <td>Password</td>
          <td><input type="password" name="password"></td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center;"><input type="submit" value="Log in..."></td>
        </tr>
      </table>
    </form>
    <?php
}  
    ?>        
  </body>        
</html>