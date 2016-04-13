$(function () {
    var td = $('.gameTable td');
    var pieces = [[[0, 0]],
        [[0, 0], [1, 0]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 0], [1, 0], [1, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[0, 0], [1, 0], [2, 0], [0, 1]],
        [[1, 0], [0, 1], [1, 1], [2, 1]],
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
        [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1]],
        [[0, 0], [1, 0], [2, 0], [3, 0], [2, 1]],
        [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1]],
        [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]],
        [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1]],
        [[0, 0], [1, 0], [2, 0], [1, 1], [2, 1]],
        [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]],
        [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1]],
        [[1, 0], [0, 1], [1, 1], [2, 1], [0, 2]],
        [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
        [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]]];
    var i, aid = 0;
    var tableNow = {}, tableBefore = {}, tableBlank = {}, tableConfirmed = {};
    var pieceSelect = $("#piece");
    var colorSelect = $("#color");
    for (i = 0; i < WIDTH * WIDTH; i++) {
        tableBlank[i] = 0;
    }
    clone(tableBlank, tableNow);
    clone(tableBlank, tableBefore);
    clone(tableBlank, tableConfirmed);
    if (WIDTH == 14) {
        td.eq(45).addClass('start');
        td.eq(150).addClass('start');
    }
    var player = [];
    player[1] = {};
    player[2] = {};
    player[3] = {};
    player[4] = {};
    for (i = 0; i < 21; i++) {
        player[1][i] = i;
        player[2][i] = i;
        player[3][i] = i;
        player[4][i] = i;
        pieceSelect.append('<option value="' + i + '">' + i + '</option>');
    }
    showInSelectTable();

    $.post("server.php", {type: "q", aid: 0}, function (result) {
        if (result != '') {
            aid = parseInt(result) + 1;
        }
    });

    pieceSelect.change(showInSelectTable);
    $("#roll").change(showInSelectTable);
    $("#mirror").change(showInSelectTable);
    colorSelect.change(function () {
        pieceSelect.empty();
        for (i in player[colorSelect.val()]) {
            pieceSelect.append('<option value="' + player[colorSelect.val()][i] + '">' + player[colorSelect.val()][i] + '</option>');
        }
        showInSelectTable();
        showInGameTable(tableConfirmed);
    });

    td.mouseenter(function () {
        var nodeArr = getNodeArr();
        var x = $(this).index();
        var y = $(this).parent().index();
        if (!nodeArr)
            return;
        clone(tableConfirmed, tableNow);
        changeTableNow(nodeArr, x, y, parseInt(colorSelect.val()));
        showInGameTable(tableNow);
    });

    $('.gameTable').mouseleave(function () {
        showInGameTable(tableConfirmed);
    });

    td.click(function () {
        clone(tableNow, tableConfirmed);
        $.post("server.php", {
            type: "c",
            gid: gid,
            color: colorSelect.val(),
            x: $(this).index(),
            y: $(this).parent().index(),
            nodearr: $.toJSON(getNodeArr())
        }, function (result) {
            $("body").append(result);//todo fail?
        });
        delete player[colorSelect.val()][pieceSelect.val()];
        pieceSelect.empty();
        for (i in player[colorSelect.val()]) {
            pieceSelect.append('<option value="' + player[colorSelect.val()][i] + '">' + player[colorSelect.val()][i] + '</option>');
        }
        showInSelectTable();
    });

    setInterval(function () {
        $.post("server.php", {type: "q", aid: aid, gid: gid}, function (result) {
            if (result == '')
                return;
            result = $.parseJSON(result);//todo aid=0?
            aid = result[0] + 1;
            result[4] = $.parseJSON(result[4]);
            clone(tableConfirmed, tableNow);
            changeTableNow(result[4], result[2], result[3], result[1]);
            clone(tableNow, tableConfirmed);
            showInGameTable(tableNow);
        })
    }, 3000);

    function clone(fromObj, toObj) {
        for (var i in fromObj) {
            toObj[i] = fromObj[i];
        }
    }

    function getNodeArr() {
        if (!isNaN(pieceSelect.val()))
            return roll($("#mirror").prop("checked") ? mirror(pieces[pieceSelect.val()]) : pieces[pieceSelect.val()], $("#roll").val());
    }

    function changeTableNow(nodeArr, x, y, color) {
        var t = [], j;
        for (i = 0; i < nodeArr.length; i++) {
            j = x + nodeArr[i][0] + (y + nodeArr[i][1]) * WIDTH;
            if (x + nodeArr[i][0] < WIDTH && y + nodeArr[i][1] < WIDTH && tableConfirmed[j] == 0) {
                t.push(j);
            } else {
                return false;
            }
        }
        for (i = 0; i < t.length; i++) {
            tableNow[t[i]] = color;
        }
    }

    function showInGameTable(table) {
        for (i = 0; i < WIDTH * WIDTH; i++) {
            if (table[i] == tableBefore[i])
                continue;
            tableBefore[i] = table[i];
            switch (table[i]) {
                case 0:
                    td.eq(i).css("background-color", "white");
                    break;
                case 1:
                    td.eq(i).css("background-color", "aqua");
                    break;
                case 2:
                    td.eq(i).css("background-color", "red");
                    break;
                case 3:
                    td.eq(i).css("background-color", "green");
                    break;
                case 4:
                    td.eq(i).css("background-color", "orange");
                    break;
                default:
                    console.info(table[i]);
            }
        }
    }

    function showInSelectTable() {
        var nodeArr = getNodeArr();
        if (!nodeArr)
            return;
        var s, xMax = 0, yMax = 0, x, y;
        var tab = $('.selectTable td');
        var t = [];
        for (i = 0; i < nodeArr.length; i++) {
            xMax = nodeArr[i][0] > xMax ? nodeArr[i][0] : xMax;
            yMax = nodeArr[i][1] > yMax ? nodeArr[i][1] : yMax;
        }
        x = Math.floor((4 - xMax) / 2);
        y = Math.floor((4 - yMax) / 2);
        for (i = 0; i < 25; i++) {
            tab.eq(i).css("background-color", "");
        }
        for (i = 0; i < nodeArr.length; i++) {
            if (x + nodeArr[i][0] < 5 && y + nodeArr[i][1] < 5) {
                s = x + nodeArr[i][0] + (y + nodeArr[i][1]) * 5;
                t.push(s);
            } else {
                t = [];
                break;
            }
        }
        for (var i = 0; i < t.length; i++) {
            switch (parseInt(colorSelect.val())) {
                case 1:
                    tab.eq(t[i]).css("background-color", "aqua");
                    break;
                case 2:
                    tab.eq(t[i]).css("background-color", "red");
                    break;
                case 3:
                    tab.eq(t[i]).css("background-color", "green");
                    break;
                case 4:
                    tab.eq(t[i]).css("background-color", "orange");
                    break;
            }
        }
    }

    function roll(nodeArr, times) {
        times %= 4;
        var max, i;
        while (times--) {
            max = 0;
            var tempArr = [];
            for (i = 0; i < nodeArr.length; i++) {
                max = (nodeArr[i][1] > max ? nodeArr[i][1] : max);
                tempArr.push([-nodeArr[i][1], nodeArr[i][0]]);
            }
            for (i = 0; i < tempArr.length; i++) {
                tempArr[i][0] += max;
            }
            nodeArr = tempArr;
        }
        return nodeArr;
    }

    function mirror(nodeArr) {
        var n = 0;
        var t = [];
        for (i = 0; i < nodeArr.length; i++) {
            n = (-nodeArr[i][0] < n ? -nodeArr[i][0] : n);
            t.push([-nodeArr[i][0], nodeArr[i][1]]);
        }
        for (i = 0; i < t.length; i++) {
            t[i][0] += -n;
        }
        return t;
    }
});