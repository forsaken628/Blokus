<?php
require_once('SQLPassword.php');
session_start();
if (!isset($_SESSION['gid'])) {
    header("location:index.php");
    exit();
}
$mysqli = new mysqli($sqlhost, $sqluser, $sqlpwd, $sqldb);

if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}
$result = $mysqli->query("
            SELECT id,color,piece,x,y,nodearr
            FROM `tab_action`
            WHERE gid={$_SESSION['gid']} AND id>=0;");
if ($mysqli->errno) {
    var_dump($mysqli->error_list);
    exit();
}
$t = [];
for ($i = 0; $i < $result->num_rows; $i++) {
    $row = $result->fetch_assoc();
    $row['id'] = intval($row['id']);
    $row['color'] = intval($row['color']);
    $row['piece'] = intval($row['piece']);
    $row['x'] = intval($row['x']);
    $row['y'] = intval($row['y']);
    $row['nodearr'] = json_decode($row['nodearr']);
    $t[] = $row;
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Blokus</title>
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
    </style>
    <script type="text/javascript" charset="utf-8">
        <?php echo "var gid={$_SESSION['gid']};";
        $width = $_SESSION['width'];
        echo "var WIDTH = parseInt($width);";
        echo "var COLOR = parseInt({$_SESSION['color']});";
        echo "var resume='".json_encode($t)."';";
        ?>
    </script>
    <script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="./js/jquery.json.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="./js/blokus.min.js" type="text/javascript" charset="utf-8"></script>
</head>
<body>

<table class="gameTable">
    <?php
    for ($i = 0; $i < $width; $i++) {
        echo '<tr>';
        for ($j = 0; $j < $width; $j++) {
            echo '<td></td>';
        }
        echo '</tr>';
    }
    ?>
</table>
<div>
    <table class="selectTable">
        <?php
        for ($i = 0; $i < 5; $i++) {
            echo '<tr>';
            for ($j = 0; $j < 5; $j++) {
                echo '<td></td>';
            }
            echo '</tr>';
        }
        ?>
    </table>
    <label for="piece">棋子</label>
    <select id="piece">
    </select><br/>
    <button type="button" id="roll">旋转</button>
    <button type="button" id="mirror">镜像</button><br/>
    <p>房间ID:<?php echo $_SESSION['gid'];?></p>
    <h3 id="hit" style="color: red"></h3>

</div>
<div style="width: 200px">
    游戏开始时，要把己方颜色的棋子从棋盘起点处（红色格）依次摆放到棋盘上，每个棋子只能与同色棋子的棋角相连，不允许沿同色棋边贴着摆放。在游戏的过程中，您不能只埋头放置自己的方块片，还必须要阻止别人的放置，以便最终让您成为赢家!
</div>
</body>
</html>