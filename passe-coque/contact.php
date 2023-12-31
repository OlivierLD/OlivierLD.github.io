<html>
  <head>
    <title>Passe-Coque Contact</title>
    <link rel="stylesheet" href="passe-coque.css" type="text/css" id="styleLink">
  </head>
  <body>
    <h2>Contact Passe-Coque</h2>
    <?php
      if (isset($HTTP_POST_VARS['operation'])) {   // POST param
        $operation = $HTTP_POST_VARS['operation'];
        if ($operation == 'send') {                // to, subject, body.
          if (mail("contact@passeurdecoute.fr",
                   "From Passe-Coque Web Site",
                   "A message from ".$HTTP_POST_VARS['email'].".\n".$HTTP_POST_VARS['commentArea'])) {  // Ok
            ?>
              <h1>Message was sent</h1>
              <p>
                <em>Thank you!</em>
              </p>
            <?
          } else {
            // Failed
            ?><h1>Message has NOT been sent</h1><?php
          }
          ?>Send <a href="contact.php">another</a>?<?php
        }
      } else {
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

