<html>
  <head>
    <title>Passe-Coque Contact</title>
    <link rel="stylesheet" href="passe-coque.css" type="text/css" id="styleLink">
  </head>
  <body>
    <!--h2>Contact Passe-Coque</h2-->
    <?php

      $sendTo = "contact@passeurdecoute.fr"; // "olivier.lediouris@gmail.com"; // "contact@passeurdecoute.fr"
      $messageSubject = "From Passe-Coque Web Site"; // Default

      // echo('HTTP_POST_VARS:'.$HTTP_POST_VARS.'<br/>');
      // echo('Operation? :'.$_POST['operation'].'<br/>');
      // echo('email? :'.$_POST['email'].'<br/>');
      // echo('subject? :'.$_POST['subject'].'<br/>');
      // echo('body? :'.$_POST['commentArea'].'<br/>');

      // if (isset($HTTP_POST_VARS['operation'])) {   // POST param
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
          if (mail($destination,
                   $messageSubject,
                   // "A message from ".$HTTP_POST_VARS['email'].".\n".$HTTP_POST_VARS['commentArea'])) {  // Ok
                   "A message from ".$_POST['email'].".\n".$_POST['commentArea'])) {  // Ok
    ?>
              <div id="message">Message was sent</div>
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

