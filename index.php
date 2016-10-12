<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Blokus</title>
    <script src="./js/jquery-1.js" charset="utf-8"></script>
    <script>
        $(function () {
            var tmp;
            var arr = ["蓝", "红", "绿", "橙"];
            $("input[name=gid]").on("paste keyup change", function () {
                var t = $(this);
                setTimeout(function () {
                    t = t.val();
                    if (t != tmp && t.match(/\d{5}/)) {
                        tmp = t;
                        $.ajax({
                            type: "get",
                            url: "api/v2/game.php",
                            data: {
                                type: "find",
                                gid: t
                            },
                            dataType: "json",
                            success: function (data) {
                                $("input[name=gid]+span").html("有效ID");
                                var s = [];
                                var i;
                                for (i = 0; i < arr.length; i++) {
                                    if (~data.player & (1 << i)) {
                                        s = s.concat($("<option>").val(i + 1).html(arr[i]));
                                    }
                                }
                                $("#form1").find("select[name=color]").html(s);
                                $("#form1").find("button").prop("disabled", false);
                            },
                            error: function () {
                                $("input[name=gid]+span").html("无效ID");
                            }
                        });
                    }
                }, 0);
            });

            $("select[name=width]").on("change", function () {
                var mask;
                if ($(this).val() == 14) {
                    mask = [1, 1, 0, 0];
                } else {
                    mask = [1, 1, 1, 1];
                }
                var s = [];
                var i;
                for (i = 0; i < arr.length; i++) {
                    if (mask[i]) {
                        s = s.concat($("<option>").val(i + 1).html(arr[i]));
                    }
                }
                $("#form2").find("select[name=color]").html(s);
            });

            $(window).on('beforeunload', function () {
                $.ajax({
                    type: "get",
                    url: "t.php",
                    data: {
                        type: "a"
                    },
                    dataType: "json",
                    success: function () {

                    }
                });
                //return "a";
            });
        });
    </script>
    <style>
        input + span {
            color: red;
        }
    </style>
</head>
<body>
<form id="form1" action="api/v2/game.php" method="post">
    <input type="hidden" name="type" value="web"/>
    <label>房间ID：<input type="text" name="gid"/><span></span></label><br>
    <label>颜色：<select name="color"></select></label><br/>
    <button type="submit" disabled>加入游戏</button>
</form>
<br>
<br>
<br>
<br>
<br>
<form id="form2" action="api/v2/game.php" method="post">
    <input type="hidden" name="type" value="new"/>
    <label>棋盘：<select name="width">
            <option value="14" selected>双人</option>
            <option value="20">四人</option>
        </select>
    </label><br/>
    <label>颜色：<select name="color">
            <option value="1">蓝</option>
            <option value="2">红</option>
        </select></label><br/>
    <button type="submit">新建游戏</button>
</form>
</body>
