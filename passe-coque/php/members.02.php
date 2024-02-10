<html lang="en">
  <!--
   ! After Custom Authentication.
   ! Crendentials stored in DB.
   ! Member space, once identified.
   !
   ! TODO:
   ! - Admin privileges
   +-->
  <head>
    <!--meta charset="UTF-8">
    <meta charset="ISO-8859-1"-->
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Custom Authentication</title>
    <!-- TO be used from an iFrame, css is required -->
    <link rel="stylesheet" href="../fonts/font.01.css">
    <link rel="stylesheet" href="../fonts/font.02.css">
    <link rel="stylesheet" href="../passe-coque.css" type="text/css"/>
  </head>
  <body>
    <!--h1>Espace Membres</h1-->
    <?php
// echo "Default GC_MaxLifeTime: " . ini_get("session.gc_maxlifetime") . " s<br/>" . PHP_EOL;
$timeout = 60;
ini_set("session.gc_maxlifetime", $timeout);
ini_set("session.cookie_lifetime", $timeout);
// echo "GC_MaxLifeTime now: " . ini_get("session.gc_maxlifetime") . " s<br/>" . PHP_EOL;

session_start();

$username = "passecc128";
$password = "zcDmf7e53eTs";
$database = "passecc128";
$dbhost = "passecc128.mysql.db";

$current_lang = "FR";
if (isset($_GET['lang'])) {
    $current_lang = $_GET['lang'];
    $_SESSION['CURRENT_LANG'] = $current_lang;
} else {
    if (isset($_SESSION['CURRENT_LANG'])) {
        $current_lang = $_SESSION['CURRENT_LANG'];
    }
}
$userName = $_SESSION['USER_NAME'];

if ($current_lang == "FR") {
  echo "<h2>Bienvenue [$userName] dans votre espace priv&eacute;.</h2><br/>" . PHP_EOL;
} else {
  echo "<h2>Welcome [$userName] to your private space.</h2><br/>" . PHP_EOL;
}
// echo "Info: We'll speak $current_lang .<br/>" . PHP_EOL;

    ?>
    <hr/>
    <?php
if ($current_lang == "FR") {
  echo "<div style='font-size: 3em; line-height: 1em;'>Cette page est en cours de d&eacute;veloppement. Bient&ocirc;t disponible...</div>" . PHP_EOL;
    ?>
    Vous voulez :
    <ul>
      <li><a href="#" onclick="alert('Plus tard');">G&eacute;rer vos cotisations</a></li>
      <li><a href="#" onclick="alert('Plus tard');">R&eacute;server un bateau</a></li>
      <li><a href="#" onclick="alert('Plus tard');">. . . </a></li>
    </ul>
    <?php
} else {
  echo "<div style='font-size: 3em; line-height: 1em;'>This page is being developped. Available soon...</div>" . PHP_EOL;
    ?>
    Youy want to:
    <ul>
      <li><a href="#" onclick="alert('Later');">Manage your subscriptions</a></li>
      <li><a href="#" onclick="alert('Later');">Book a boat</a></li>
      <li><a href="#" onclick="alert('Later');">. . . </a></li>
    </ul>
    <?php
}
    ?>
    <hr/>
    <form action="members.php" method="post">
      <input type="hidden" name="operation" value="logout">
      <table>
        <tr>
          <td colspan="2" style="text-align: center;"><input type="submit" value="<?php echo ($current_lang == "FR") ? "D&eacute;connexion" : "Log out..." ?>"></td>
        </tr>
      </table>
    </form>
    <hr/>
       
  </body>        
</html>