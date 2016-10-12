<?php
/**
 * Created by PhpStorm.
 * User: ad
 * Date: 2016/3/18
 * Time: 16:51
 */
//todo 输入校验
$mysqli = require ('../../db.php');

if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

switch ($_REQUEST['type']) {
    case 'c':
        $piece = $_POST['piece'];
        $mysqli->query("
            INSERT INTO `tab_action` SET
            type = 'c',
            gid = {$_POST['gid']},
            color = {$piece["color"]},
            pid = {$piece["id"]},
            inverse = {$piece["inverse"]},
            direction = {$piece["direction"]},
            x = {$_POST['x']},
            y = {$_POST['y']}");
        if ($mysqli->errno) {
            var_dump($mysqli->error_list);
            exit();
        }
        break;
    case 'q':
        $result = $mysqli->query("
            SELECT id,color,pid,inverse,direction,x,y
            FROM `tab_action`
            WHERE gid={$_REQUEST['gid']} AND id>{$_REQUEST['aid']};");
        if ($mysqli->errno) {
            var_dump($mysqli->error_list);
            exit();
        }
        $t = [];
        for ($i = 0; $i < $result->num_rows; $i++) {
            $row = $result->fetch_assoc();
            $row['id'] = intval($row['id']);
            $row['color'] = intval($row['color']);
            $row['pid'] = intval($row['pid']);
            $row['inverse'] = intval($row['inverse']);
            $row['direction'] = intval($row['direction']);
            $row['x'] = intval($row['x']);
            $row['y'] = intval($row['y']);
            $t[] = $row;
        }
        echo json_encode($t);
}


$mysqli->close();