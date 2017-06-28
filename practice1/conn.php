<?php
//데이터베이스 접속
/*$conn = mysqli_connect('localhost', 'root', 'whtjdals17');
mysql_select_db($conn, 'chosm');*/
require("config/config.php");
require("lib/db.php");
$conn = db_init($config["host"], $config["duser"], $config["dpw"], $config["dname"]);
?>
