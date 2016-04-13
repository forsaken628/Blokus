$(function () {
    var td = $('.gameTable td');
    var pieces = [[[0, 0]],
        [[0, 0], [1, 0]],
        [[-1, 0], [0, 0], [1, 0]],
        [[0, 0], [1, 0], [0, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[-1, 0], [0, 0], [1, 0], [2, 0]],
        [[-1, 0], [0, 0], [1, 0], [-1, 1]],
        [[0, -1], [-1, 0], [0, 0], [1, 0]],
        [[-1, 0], [0, 0], [0, 1], [1, 1]],
        [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]],
        [[-1, 0], [-1, 1], [0, 0], [1, 0], [2, 0]],
        [[-1, 0], [0, 0], [1, 0], [2, 0], [0, 1]],
        [[-1, 0], [0, 0], [1, 0], [1, 1], [2, 1]],
        [[-1, -1], [0, -1], [0, 0], [0, 1], [1, 1]],
        [[-1, 0], [0, 0], [1, 0], [-1, 1], [1, 1]],
        [[-1, 0], [0, 0], [1, 0], [0, 1], [1, 1]],
        [[-1, -1], [-1, 0], [-1, 1], [0, -1], [1, -1]],
        [[-1, -1], [-1, 0], [-1, 1], [0, 0], [1, 0]],
        [[0, -1], [-1, 0], [0, 0], [1, 0], [-1, 1]],
        [[0, -1], [-1, 0], [0, 0], [1, 0], [0, 1]],
        [[-1, -1], [0, -1], [0, 0], [1, 0], [1, 1]]];
    var aid = 0, i;
    var tableNow = {}, tableBefore = {}, tableBlank = {}, tableConfirmed = {};
    var pieceNodeArr;
    var pieceSelect = $("#piece");
    var queryLock = false, startLock = true, cornerLock = false, sideLock = true;
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
    if (WIDTH == 20) {
        td.eq(0).addClass('start');
        td.eq(19).addClass('start');
        td.eq(380).addClass('start');
        td.eq(399).addClass('start');
    }
    var player = {0:'1',1:'2',2:'3-1',3:'3-2',4:'4-1',5:'4-2',6:'4-3',7:'4-4',8:'4-5',9:'5-1',10:'5-2',11:'5-3',12:'5-4',13:'5-5',14:'5-6',15:'5-7',16:'5-8',17:'5-9',18:'5-10',19:'5-11',20:'5-12'};
    for (i = 0; i < 21; i++) {
        pieceSelect.append('<option value="' + i + '">' + player[i] + '</option>');
    }
    setNodeArr();
    showInSelectTable();
    resume = $.parseJSON(resume);
    if (resume.length != 0) {
        clone(tableConfirmed, tableNow);
        for (i = 0; i < resume.length; i++) {
            aid = resume[i]['id'] + 1;
            changeTableNow(resume[i]['nodearr'], resume[i]['x'], resume[i]['y'], resume[i]['color']);
            if (resume[i]['color'] == COLOR) {
                delete player[resume[i]['piece']];
                startLock = false;
            }
        }
        pieceSelect.empty();
        for (i in player) {
            pieceSelect.append('<option value="' + i + '">' + player[i] + '</option>');
        }
        setNodeArr();
        showInSelectTable();
        clone(tableNow, tableConfirmed);
        showInGameTable(tableNow);
    }
    $("#hit").get(0).innerHTML = '';
    setInterval(query, 3000);

    pieceSelect.change(function () {
        setNodeArr();
        showInSelectTable();
    });

    $("#roll").click(function () {
        pieceNodeArr = roll(pieceNodeArr, 1);
        showInSelectTable();
    });

    $("#mirror").click(function () {
        pieceNodeArr = mirror(pieceNodeArr);
        showInSelectTable();
    });

    td.mouseenter(function () {
        queryLock = false;
        var x = $(this).index();
        var y = $(this).parent().index();
        if (!pieceNodeArr)
            return;
        clone(tableConfirmed, tableNow);
        changeTableNow(pieceNodeArr, x, y, COLOR);
        showInGameTable(tableNow);
    });

    $('.gameTable').mouseleave(function () {
        showInGameTable(tableConfirmed);
    });

    td.click(function () {
        if (!queryLock)
            return;
        if (!(sideLock && cornerLock)) {
            if (startLock) {
                $("#hit").append('请从红格开始');
                return;
            }
            if (!sideLock) {
                $("#hit").append('边不能相连,');
            }
            if (!cornerLock) {
                $("#hit").append('角必须相连');
            }
            return;
        }
        startLock = false;
        clone(tableNow, tableConfirmed);
        $.post("server.php", {
            type: "c",
            gid: gid,
            color: COLOR,
            piece: pieceSelect.val(),
            x: $(this).index(),
            y: $(this).parent().index(),
            nodearr: $.toJSON(pieceNodeArr)
        }, function (result) {
            $("body").append(result);//todo fail?
        });
        delete player[pieceSelect.val()];
        pieceSelect.empty();
        for (var i in player) {
            pieceSelect.append('<option value="' + i + '">' + player[i] + '</option>');
        }
        setNodeArr();
        showInSelectTable();
    });

    function query() {
        $.post("server.php", {type: "q", aid: aid, gid: gid}, function (result) {
            if (result.length == 0)
                return;
            queryLock = false;
            clone(tableConfirmed, tableNow);
            var refresh = false;
            for (var i = 0; i < result.length; i++) {
                aid = result[i]['id'] + 1;
                if (result[i]['color'] != COLOR) {
                    refresh = true;
                    changeTableNow(result[i]['nodearr'], result[i]['x'], result[i]['y'], result[i]['color']);
                }
            }
            if (refresh) {
                clone(tableNow, tableConfirmed);
                showInGameTable(tableNow);
                alert('到你了');
            }
        },'json');
    }

    function clone(fromObj, toObj) {
        for (var i in fromObj) {
            toObj[i] = fromObj[i];
        }
    }

    function setNodeArr() {
        if (!isNaN(pieceSelect.val()))
            pieceNodeArr = pieces[pieceSelect.val()];
    }

    function changeTableNow(nodeArr, x, y, color) {
        sideLock = true;
        cornerLock = false;
        $("#hit").get(0).innerHTML = '';
        var t = {};
        var side = {}, corner = {};
        for (var i = 0; i < nodeArr.length; i++) {
            var j = x + nodeArr[i][0] + (y + nodeArr[i][1]) * WIDTH;
            if (x + nodeArr[i][0] >= 0 && x + nodeArr[i][0] < WIDTH
                && y + nodeArr[i][1] >= 0 && y + nodeArr[i][1] < WIDTH
                && tableConfirmed[j] == 0) {
                t[i] = j;
            } else {
                return false;
            }
        }
        for (i in t) {
            if (t[i] > WIDTH)
                side[t[i] - WIDTH] = color;
            if (t[i] < WIDTH * (WIDTH - 1) - 1)
                side[t[i] + WIDTH] = color;
            if (t[i] % WIDTH != 0)
                side[t[i] - 1] = color;
            if ((t[i] + 1) % WIDTH != 0)
                side[t[i] + 1] = color;
        }
        for (i in t) {
            if (t[i] > WIDTH && t[i] % WIDTH != 0)
                corner[t[i] - WIDTH - 1] = color;
            if (t[i] >= WIDTH && (t[i] + 1) % WIDTH != 0)
                corner[t[i] - WIDTH + 1] = color;
            if (t[i] < WIDTH * (WIDTH - 1) && t[i] % WIDTH != 0)
                corner[t[i] + WIDTH - 1] = color;
            if (t[i] < WIDTH * (WIDTH - 1) - 1 && (t[i] + 1) % WIDTH != 0)
                corner[t[i] + WIDTH + 1] = color;
        }
        for (i in t) {
            delete side[t[i]];
            delete corner[t[i]];
            tableNow[t[i]] = color;
        }
        cilckhit = true;
        for (i in side) {
            //tableNow[i] = color+2;
            delete corner[i];
            if (tableNow[i] == color) {
                //hit1 = true;
                sideLock = false;
            }
        }
        for (i in corner) {
            //tableNow[i] = color+1;
            if (tableNow[i] == color) {
                //hit2 = true;
                cornerLock = true;
            }
        }
        if (sideLock) {
            // $("#hit1").get(0).innerHTML = '有效边';
        }
        if (cornerLock) {
            //$("#hit2").get(0).innerHTML = '有效角';
        }
        if (startLock && (tableNow[0] == COLOR || tableNow[WIDTH - 1] == COLOR
            || tableNow[WIDTH * (WIDTH - 1)] == COLOR || tableNow[WIDTH * WIDTH - 1] == COLOR) && WIDTH != 14) {//todo 动态
            //$("#hit3").get(0).innerHTML = '有效开始';
            cornerLock = true;
        }
        if (startLock && (tableNow[45] == COLOR || tableNow[150] == COLOR)
            && WIDTH == 14) {//todo 动态
            //$("#hit3").get(0).innerHTML = '有效开始';
            cornerLock = true;
        }
        queryLock = true;
    }

    function showInGameTable(table) {
        for (var i = 0; i < WIDTH * WIDTH; i++) {
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
                    td.eq(i).css("background-color", "#F55");
                    break;
                case 3:
                    td.eq(i).css("background-color", "#32CD32");
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
        if (!pieceNodeArr)
            return;
        var s, x = 2, y = 2;
        var tab = $('.selectTable td');
        var t = [];
        for (var i = 0; i < 25; i++) {
            tab.eq(i).css("background-color", "");
        }
        for (i = 0; i < pieceNodeArr.length; i++) {
            s = x + pieceNodeArr[i][0] + (y + pieceNodeArr[i][1]) * 5;
            t.push(s);
        }
        for (i = 0; i < t.length; i++) {
            switch (COLOR) {
                case 1:
                    tab.eq(t[i]).css("background-color", "aqua");
                    break;
                case 2:
                    tab.eq(t[i]).css("background-color", "#F55");
                    break;
                case 3:
                    tab.eq(t[i]).css("background-color", "#32CD32");
                    break;
                case 4:
                    tab.eq(t[i]).css("background-color", "orange");
                    break;
            }
        }
    }

    function roll(nodeArr, times) {
        times %= 4;
        while (times--) {
            var tempArr = [];
            for (var i = 0; i < nodeArr.length; i++) {
                tempArr.push([-nodeArr[i][1], nodeArr[i][0]]);
            }
            nodeArr = tempArr;
        }
        return nodeArr;
    }

    function mirror(nodeArr) {
        for (var i = 0; i < nodeArr.length; i++) {
            nodeArr[i][0] = -nodeArr[i][0];
        }
        return nodeArr;
    }

});