<?php
/**
 * Created by PhpStorm.
 * User: ad
 * Date: 2016/3/18
 * Time: 16:51
 */
//todo 输入校验
require_once('SQLPassword.php');
$mysqli = new mysqli($sqlhost, $sqluser, $sqlpwd, $sqldb);

if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

switch ($_REQUEST['type']) {
    case 'c':
        $nodeArr = "'" . $_REQUEST['nodearr'] . "'";
        $mysqli->query("
            INSERT INTO `tab_action` (type,gid,color,piece,x,y,nodearr)
            VALUE ('c',
            {$_REQUEST['gid']},
            {$_REQUEST['color']},
            {$_REQUEST['piece']},
            {$_REQUEST['x']},
            {$_REQUEST['y']},
            $nodeArr);");
        if ($mysqli->errno) {
            var_dump($mysqli->error_list);
            exit();
        }
        break;
    case 'q':
        $result = $mysqli->query("
            SELECT id,color,piece,x,y,nodearr
            FROM `tab_action`
            WHERE gid={$_REQUEST['gid']} AND id>={$_REQUEST['aid']};");
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
        echo json_encode($t);
}
$mysqli->close();