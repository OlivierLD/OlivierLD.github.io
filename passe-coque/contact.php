<!DOCTYPE html>
<!--
 ! Send an email to contact@passeurdecoute.fr.
 ! Sender is cc'd.
 ! See doc at https://www.farnell.com/datasheets/1599363.pdf
 !       also https://www.w3docs.com/snippets/php/php-mail-cc-field.html
 +-->
<html>
  <head>
    <title>Passe-Coque Contact</title>
    <link rel="stylesheet" href="passe-coque.css" type="text/css" id="styleLink">
  </head>
  <body>
    <!--h2>Contact Passe-Coque</h2-->
    <?php

      $sendTo = "contact@passeurdecoute.fr"; //  . "," . "catherine.laguerre@hotmail.com"; // "contact@passeurdecoute.fr"; // "olivier.lediouris@gmail.com"; // 
      $messageSubject = "From Passe-Coque Web Site"; // Default

      if (isset($_POST['operation'])) {   // POST param
        $operation = $_POST['operation']; // $HTTP_POST_VARS['operation'];
        // echo('<p>Operation prm detected: '.$operation.'</p>');
        if ($operation == 'send') {                // to, subject, body.
          $destination = $sendTo;
          if (isset($_POST['email'])) {
            $destination = $destination.','.$_POST['email'];
          }
          if (isset($_POST['subject'])) {
            $messageSubject = $_POST['subject'];
            // echo("Subject is now [".$messageSubject."]<br/>");
          // } else {
          //   echo("Defaulting subject");
          }
          $headers = "From: contact@passeurdecoute.fr\r\n";
          $headers .= "CC: catherine.laguerre@hotmail.com, olivier.lediouris@gmail.com\r\n";

          $messFrom = "??";
          if (isset($_POST['first-last-name']) && isset($_POST['email'])) {
            $messFrom = $_POST['first-last-name'] . ' (' . $_POST['email'] . ')';
          } else if (isset($_POST['email'])) {
            $messFrom = $_POST['email'];
          }
          if (mail($destination,
                   $messageSubject,
                   // "A message from ".$HTTP_POST_VARS['email'].".\n".$HTTP_POST_VARS['commentArea'])) {  // Ok
                   "A message from ".$messFrom.".\n".$_POST['commentArea'],
                   $headers)) {  // Ok
    ?>
              <div id="message">Message was sent.</div>
              <div id="content">
    <?php 
echo($_POST['commentArea']);
    ?>                
              </div>
              <!--p>
                <em>Thank you!</em>
              </p-->
    <?php
          } else {
            // Failed
    ?><div id="error">Message has NOT been sent</div><?php
          }
    ?><!-- Send <a href="contact.php">another</a>? --><?php
        }
      } else {
        // echo('<p>NO operation prm detected</p>');

    ?>
    <p name="content">
      Enter your message below, and hit the Send button. 
      <br>
      Please provide your email address if you expect a reply.
    </p>
    <form action="contact.php" method="post">
      <input type="hidden" name="operation" value="send">
      <table width="98%" border="0">
        <tr>
          <td valign="top" align="right">Your email address:</td>
          <td><input type="text" name="email" size="40"></td>
        </tr>
        <tr>  
          <td colspan="2" valign="top" width="100%" align="center">
            <textarea cols="40" rows="10" name="commentArea"></textarea>
  				</td>
        </tr>
        <tr>
          <td colspan="2" align="center">
            <input type="submit" value="Send">
          </td>
        </tr>
      </table>
	  </form>
    <?php
      }
    ?>
  </body>
</html>

