<?php
session_start();
if (!isset($_SESSION['game'])) {
    header("location:index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="./js/jquery-1.js" charset="utf-8"></script>
    <script src="./js/blokus2.js" charset="utf-8"></script>
</head>
<body>
<style type="text/css">
    td {
        border: 1px solid blue;
        width: 20px;
        height: 20px;
    }

    td.start {
        border: 4px double red;
        width: 12px;
        height: 12px;
    }

    body {
        display: flex;
    }

    div {
        margin-left: 40px;
    }

    table.gameTable {
        margin-left: 100px;
    }

    .aqua {
        background-color: aqua;
    }

    .red {
        background-color: #F55;
    }

    .green {
        background-color: #32CD32;
    }

    .orange {
        background-color: orange;
    }


</style>
<script>
    var WIDTH = <?=$_SESSION['game']["width"]?>;
    var COLOR = <?=$_SESSION['game']['color']?>;
    var gid = <?=$_SESSION['game']['gid']?>;
</script>
<table id="game-table"></table>
<div>
    <table id="select-table"></table>
    <label>棋子<select id="piece"></select></label>
    <br/>
    <button type="button" id="roll">旋转</button>
    <button type="button" id="mirror">镜像</button>
    <br/>
    <p>房间ID:<?=$_SESSION['game']['gid']?></p>
</div>
<div style="width: 200px">
    游戏开始时，要把己方颜色的棋子从棋盘起点处（红色格）依次摆放到棋盘上，每个棋子只能与同色棋子的棋角相连，不允许沿同色棋边贴着摆放。在游戏的过程中，您不能只埋头放置自己的方块片，还必须要阻止别人的放置，以便最终让您成为赢家!
</div>
</body>
</html>