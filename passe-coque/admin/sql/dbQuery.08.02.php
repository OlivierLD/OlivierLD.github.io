<html lang="en">
  <!--
   ! Custom Authentication, act 2.
   ! Crendentials stored in DB
   +-->
  <head>
    <!--meta charset="UTF-8">
    <meta charset="ISO-8859-1"-->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Custom Authentication</title>
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
    <h1>PHP / MySQL.<br/>Custom Authentication, act 2</h1>

    <?php
    session_start();
    $connected_user = 'unknown';
    if (isset($_SESSION['USER_NAME'])) {
      $connected_user = $_SESSION['USER_NAME'];
    }
    echo "Logged in as [$connected_user].<br/>" . PHP_EOL;
    ?>        
    <a href="dbQuery.08.php">Back</a>
  </body>        
</html>