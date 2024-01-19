<html lang="en">
  <!--
   ! A Form to insert into the nl-subscribers table
   ! Good doc at https://www.w3schools.com/php/php_mysql_insert.asp
   +-->
  <head>
    <!--meta charset="UTF-8">
    <meta charset="ISO-8859-1"-->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>NL Subscription</title>
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
    <h1>Create News Letter subscriber</h1>
    <?php
// phpinfo();

$username = "passecc128";
$password = "zcDmf7e53eTs";
$database = "passecc128";
$dbhost = "passecc128.mysql.db";

$VERBOSE = false;

if (isset($_POST['operation'])) {
  $operation = $_POST['operation'];
  if ($operation == 'insert') { // Then do the insert
    try {
      $name = $_POST['name'];
      $email = $_POST['email'];

      $link = mysqli_init();
    
      if ($VERBOSE) {
        echo("Will connect on ".$database." ...<br/>");
      }
      $link = new mysqli($dbhost, $username, $password, $database);
    
      if ($link->connect_errno) {
        echo("Oops, errno:".$link->connect_errno."...<br/>");
        die("Connection failed: " . $conn->connect_error);
      } else {
        if ($VERBOSE) {
          echo("Connected.<br/>");
        }
      }
    
      $sql = 'INSERT INTO `nl-subscribers`(`name`, `email`) VALUES (\'' . $name . '\', \'' . $email . '\');'; 
      
      if ($VERBOSE) {
        echo('Performing instruction <code>'.$sql.'</code><br/>');
      }
    
      if ($link->query($sql) === TRUE) {
        echo "OK. New record created successfully<br/>";
      } else {
        echo "ERROR: " . $sql . "<br/>" . $link->error . "<br/>";
      }

      // On ferme !
      $link->close();
      if ($VERBOSE) {
        echo("Closed DB<br/>".PHP_EOL);
      }
    } catch (Throwable $e) {
      echo "Captured Throwable for connection : " . $e->getMessage() . "<br/>" . PHP_EOL;
    }
    
  }
} else { // Then display the form
    ?>
    <form action="dbQuery.01.php" method="post">
      <input type="hidden" name="operation" value="insert">
      <table>
        <tr>
          <td valign="top">Name:</td><td><input type="text" name="name" size="40"></td>
        </tr>
        <tr>
          <td valign="top">Email:</td><td><input type="text" name="email" size="40"></td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center;"><input type="submit" value="Create"></td>
        </tr>
      </table>
    </form>
    <?php
}  
    ?>        
  </body>        
</html>