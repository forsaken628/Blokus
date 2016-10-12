<?php
/**
 * Created by PhpStorm.
 * User: forsa
 * Date: 2016/7/24
 * Time: 20:29
 */
session_start();
$game = new Game();
if ($_SERVER['REQUEST_METHOD'] == "GET" && $_GET["gid"]) {
    $gid = intval($_GET["gid"]);
    $game->setGid($gid);
    $game->getAction();
} else {
    $gid = intval($_POST["gid"]);
    $f = $_POST["type"] . "Action";
    if (method_exists($game, $f)) {
        if ($_POST["gid"]) {
            $gid = intval($_POST["gid"]);
            $game->setGid($gid);
        }
        $game->$f();
    } else {
        header('HTTP/1.1 400 Bad Request');
        exit;
    }
}

class Game
{
    private $game, $mysqli;

    public function __construct($gid = null)
    {
        $this->mysqli = require ('../../db.php');
        if ($this->mysqli->connect_errno) {
            header('HTTP/1.1 500 Internal Server Error');
            printf("Connect failed: %s\n", $this->mysqli->connect_error);
            exit();
        }
        if ($gid) {
            $this->setGid($gid);
        }
    }

    public function setGid($gid)
    {
        $game = $this->query("SELECT * FROM tab_game WHERE gid={$gid}");
        if ($game->num_rows) {
            $this->game = $game->fetch_assoc();
            $_SESSION["game"] = $this->game;
        } else {
            return false;
        }
        return true;
    }

    public function getAction()
    {
        if ($this->game) {
            header('HTTP/1.1 200 OK');
            $json = ["gid" => $this->game["gid"],
                "player" => $this->game["player"],
                "width" => $this->game["width"]];
            echo json_encode($json);
        } else {
            header('HTTP/1.1 404 Not Found');
            exit;
        }
    }

    public function webAction()
    {
        $color = intval($_POST["color"]);
        if ($color == 0 || $color > 4) {
            header('HTTP/1.1 400 Bad Request');
        }
        if ($this->game["player"] & 1 << ($color - 1)) {
            header('HTTP/1.1 403 Forbidden');
            echo "该颜色已占用";
            exit;
        }
        $_SESSION["game"]["color"] = $color;
        $this->query("UPDATE tab_game SET player=player+{$color} WHERE gid={$this->game["gid"]}");
        header('Location:/blokus/test.php');
    }

    public function newAction()
    {
        $color = intval($_POST["color"]);
        $width = intval($_POST["width"]);
        while (true) {
            $gid = mt_rand(10000, 99999);
            $result = $this->query("SELECT `gid` FROM `tab_game` WHERE gid = $gid;");
            if ($result->num_rows == 0) {
                break;
            }
        }
        $player = 1 << ($color - 1);
        $this->query("INSERT INTO `tab_game` (`gid`,`width`,`player`) VALUE ($gid,$width,$player);");
        $this->game["id"] = $this->mysqli->insert_id;
        $this->game["gid"] = $gid;
        $this->game["player"] = $player;
        $this->game["width"] = $width;
        //$this->game["time"] = 0;
        $_SESSION["game"] = $this->game;
        $_SESSION["game"]["color"] = $color;
        header('Location:/blokus/test.php');
    }

    private function query(string $sql)
    {
        $r = $this->mysqli->query($sql);
        if ($this->mysqli->errno) {
            header('HTTP/1.1 500 Internal Server Error');
            var_dump($this->mysqli->error_list);
            exit();
        }
        return $r;
    }
}




/*
    if ($_GET["gid"] == "") {
        while (true) {
            $gid = mt_rand(10000, 99999);
            $result = $mysqli->query("SELECT `gid` FROM `tab_game` WHERE gid = $gid;");
            if ($mysqli->errno) {
                header('HTTP/1.1 500 Internal Server Error');
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
    }
*/



