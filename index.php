<?php
require_once('SQLPassword.php');
$hit = '';
if (isset($_REQUEST['gid'])) {
    //todo 输入校验
    $mysqli = new mysqli($sqlhost, $sqluser, $sqlpwd, $sqldb);
    if (mysqli_connect_errno()) {
        printf("Connect failed: %s\n", mysqli_connect_error());
        exit();
    }
    if ($_REQUEST['gid'] == '') {
        while (true) {
            $gid = mt_rand(10000, 99999);
            $result = $mysqli->query("SELECT `gid` FROM `tab_game` WHERE gid = $gid;");
            if ($mysqli->errno) {
                var_dump($mysqli->error_list);
                exit();
            }
            if ($result->num_rows == 0) {
                break;
            }
        }
        $mysqli->query("INSERT INTO `tab_game` (`gid`,`width`) VALUE ($gid,{$_REQUEST['width']});");
        if ($mysqli->errno) {
            var_dump($mysqli->error_list);
            exit();
        }
        session_start();
        $_SESSION['gid'] = $gid;
        $_SESSION['width'] = $_REQUEST['width'];
        $_SESSION['color'] = $_REQUEST['color'];
        header("location:blokus.php");
    } else {
        $gid = intval($_REQUEST['gid']);
        $result = $mysqli->query("SELECT `gid`,`width` FROM `tab_game` WHERE gid = {$gid};");
        if ($result->num_rows != null) {
            if ($mysqli->errno) {
                var_dump($mysqli->error_list);
                exit();
            }
            session_start();
            $_SESSION['gid'] = $_REQUEST['gid'];
            $result = $result->fetch_assoc();
            $_SESSION['width'] = $result['width'];
            $_SESSION['color'] = $_REQUEST['color'];
            header("location:blokus.php");
        } else {
            $hit = '<h1>错误ID！</h1>';
        }
    }
    $mysqli->close();
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Blokus</title>
    <style type="text/css">
        form {
            width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
    </style>
</head>
<body>
<?php echo $hit ?>
<form action="index.php" method="get">
    <label>房间ID：</label><input type="text" name="gid"/><span style="color: red">新房间请留空</span><br/>
    <label>棋盘：</label>
    <input type="radio" name="width" value="14" checked="checked"/><label>双人</label>
    <input type="radio" name="width" value="20"/><label>四人</label>
    <br/>
    <label>颜色：</label>
    <input type="radio" name="color" value="1" checked="checked"/><label>蓝</label>
    <input type="radio" name="color" value="2"/><label>红</label>
    <input type="radio" name="color" value="3"/><label>绿</label>
    <input type="radio" name="color" value="4"/><label>橙</label>
    <br/><br/>
    <input type="submit" value="进入"/>
</form>
</body>
