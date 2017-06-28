<?php
require_once('conn.php');
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title></title>
    <!-- Bootstrap -->
    <link href="./bootstrap-3.3.4-dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css" media="screen" title="no title" charset="utf-8">
  </head>
  <body id="body">
    <div class="container">
      <header class="jumbotron text-center">
        <img src="http://s3-ap-northeast-1.amazonaws.com/opentutorialsfile/course/94.png" art="생활코딩" class="img-circle" id="logo">
        <h1><a href="index.php">JavaScript</a></h1>
      </header>
      <div class="row">
        <nav class="col-md-3">
          <ol class="nav nav-pills nav-stacked">
  <?php
  $sql = "SELECT * FROM `topic`";
  $result = mysqli_query($conn, $sql);
  while($row = mysqli_fetch_assoc($result)){
    echo '<li><a href="index.php?id='.$row['id'].'">'.htmlspecialchars($row['title']).'</a></li>';
  }
  ?>
          </ol>
        </nav>
        <div id="content" class="col-md-9">
          <article>
  <?php
  if(empty($_GET['id'])){
  echo "<h2>Welcome</h2>";
  } else {
  $id = mysqli_real_escape_string($conn, $_GET['id']);
  $sql = "SELECT topic.id, topic.title, topic.description, user.name, topic.created FROM topic LEFT JOIN user ON topic.author = user.id WHERE topic.id=".$id;
  $result = mysqli_query($conn, $sql);
  $row = mysqli_fetch_assoc($result);
  ?>
  <h2><?=htmlspecialchars($row['title'])?></h2>
  <div><?=htmlspecialchars($row['created'])?> | <?=htmlspecialchars($row['name'])?></div>
  <div><?=htmlspecialchars($row['description'])?></div>
  <?php
  }
  ?>
          </article>
          <hr/>
          <div id="control">
            <div class="btn-group">
              <input type="button" name="name" value="White" onclick="document.getElementById('body').className=''" class="btn btn-default btn-lg" >
              <input type="button" name="name" value="Black" onclick="document.getElementById('body').className='black'" class="btn btn-default btn-lg">
            </div>
            <a href="write.php" class="btn btn-success btn-lg">쓰기</a>
          </div>
        </div>
      </div>
    </div>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="./bootstrap-3.3.4-dist/js/bootstrap.min.js"></script>
  </body>
</html>
