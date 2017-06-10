/**
 * Created by forsa on 2016/7/24.
 */
$(function () {
    function Piece(id, color) {
        //坐标系右下为正
        var PIECES = [[[0, 0]],
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

        var nodeArr, h1 = 0, h2 = 0, v1 = 0, v2 = 0, inverse = false, direction = 0;
        var side = {}, corner = {};

        this.initPiece = function (id) {
            nodeArr = PIECES[id];
            for (var i in nodeArr) {
                h1 = nodeArr[i][1] > h1 ? nodeArr[i][1] : h1;
                h2 = nodeArr[i][1] < h2 ? nodeArr[i][1] : h2;
                v1 = nodeArr[i][0] > v1 ? nodeArr[i][0] : v1;
                v2 = nodeArr[i][0] < v2 ? nodeArr[i][0] : v2;
                side[(nodeArr[i][0] + 1) + ',' + (nodeArr[i][1])] = [nodeArr[i][0] + 1, nodeArr[i][1]];
                side[(nodeArr[i][0] - 1) + ',' + (nodeArr[i][1])] = [nodeArr[i][0] - 1, nodeArr[i][1]];
                side[(nodeArr[i][0]) + ',' + (nodeArr[i][1] + 1)] = [nodeArr[i][0], nodeArr[i][1] + 1];
                side[(nodeArr[i][0]) + ',' + (nodeArr[i][1] - 1)] = [nodeArr[i][0], nodeArr[i][1] - 1];
                corner[(nodeArr[i][0] + 1) + ',' + (nodeArr[i][1] + 1)] = [nodeArr[i][0] + 1, nodeArr[i][1] + 1];
                corner[(nodeArr[i][0] + 1) + ',' + (nodeArr[i][1] - 1)] = [nodeArr[i][0] + 1, nodeArr[i][1] - 1];
                corner[(nodeArr[i][0] - 1) + ',' + (nodeArr[i][1] + 1)] = [nodeArr[i][0] - 1, nodeArr[i][1] + 1];
                corner[(nodeArr[i][0] - 1) + ',' + (nodeArr[i][1] - 1)] = [nodeArr[i][0] - 1, nodeArr[i][1] - 1];
            }
            for (i in nodeArr) {
                delete side[nodeArr[i][0] + ',' + nodeArr[i][1]];
                delete corner[nodeArr[i][0] + ',' + nodeArr[i][1]];
            }
            for (i in side) {
                delete corner[i];
            }

        };

        this.roll = function (times) {
            times %= 4;
            direction = (direction + (inverse ? 4 - times : times)) % 4;
            while (times--) {
                var i;
                for (i in nodeArr) {
                    nodeArr[i] = [-nodeArr[i][1], nodeArr[i][0]];//顺时针90度
                    var t = v1;
                    v1 = -h2;
                    h2 = v2;
                    v2 = -h1;
                    h1 = t;
                }
                for (i in side) {
                    side[i] = ([-side[i][1], side[i][0]]);//顺时针90度
                }
                for (i in corner) {
                    corner[i] = ([-corner[i][1], corner[i][0]]);//顺时针90度
                }
            }
        };

        this.mirror = function () {
            inverse = !inverse;
            for (var i in nodeArr) {
                nodeArr[i][0] = -nodeArr[i][0];
            }
            var t;
            t = v1;
            v1 = -v2;
            v2 = -t;
            for (i in side) {
                side[i][0] = -side[i][0];
            }
            for (i in corner) {
                corner[i][0] = -corner[i][0];
            }
        };

        this.getPiece = function () {
            return {
                id: id,
                color: color,
                nodeArr: nodeArr,
                v1: v1,
                v2: v2,
                h1: h1,
                h2: h2,
                inverse: inverse,
                direction: direction,
                side: side,
                corner: corner
            }
        };

        this.initPiece(id);
    }

    function Table(id, width) {
        var main = $("#" + id);
        var table = {blank: {}, now: {}, before: {}, M1: {}, M2: {}, M3: {}, M4: {}};
        var i;

        var tr = $("<tr>");
        for (i = 0; i < width; i++) {
            tr.append($("<td>"));
        }
        for (i = 0; i < width; i++) {
            main.append(tr.clone());
        }
        var td = main.find("td");
        for (i = 0; i < width * width; i++) {
            table.blank[i] = 0;
            table.now[i] = 0;
            table.before[i] = 0;
            table.M1[i] = 0;
        }
        return {
            show: function (tableName) {
                var colors = ["", "aqua", "red", "green", "orange"];
                var i, colorClass;
                if (!table.hasOwnProperty(tableName)) {
                    return;
                }
                var t = table[tableName];
                for (i in t) {
                    if (t[i] == table.before[i])
                        continue;
                    table.before[i] = t[i];
                    colorClass = colors[t[i]];
                    td.eq(i).removeClass("aqua red green orange").addClass(colorClass);
                }
            },

            changeTableNow: function (piece, x, y, color) {
                piece = piece.getPiece();
                var nodeArr = piece.nodeArr;
                var i;

                if (piece.v2 + x < 0
                    || piece.v1 + x >= width
                    || piece.h2 + y < 0
                    || piece.h1 + y >= width) {
                    return false;
                }

                for (i in nodeArr) {
                    var j = x + nodeArr[i][0] + (y + nodeArr[i][1]) * width;
                    table.now[j] = color;
                }
                return true;
            },

            sideCheck: function (piece, x, y, color) {
                piece = piece.getPiece();
                var side = piece.side;
                for (i in side) {
                    if (x + side[i][0] >= 0
                        && x + side[i][0] < width
                        && y + side[i][1] >= 0
                        && y + side[i][1] < width) {
                        var j = x + side[i][0] + (y + side[i][1]) * width;
                        if (table.M1[j] == color) {
                            return false;
                        }
                    }
                }
                return true;
            },

            cornerCheck: function (piece, x, y, color) {
                piece = piece.getPiece();
                var corner = piece.corner;
                for (i in corner) {
                    if (x + corner[i][0] >= 0
                        && x + corner[i][0] < width
                        && y + corner[i][1] >= 0
                        && y + corner[i][1] < width) {
                        var j = x + corner[i][0] + (y + corner[i][1]) * width;
                        if (table.M1[j] == color) {
                            return true;
                        }
                    }
                }
                return false;
            },

            startCheck: function () {
                if (width == 14) {
                    return (table.now[45] == COLOR || table.now[150] == COLOR);
                } else {
                    return (table.now[0] == COLOR
                    || table.now[width - 1] == COLOR
                    || table.now[width * (width - 1)] == COLOR
                    || table.now[width * width - 1] == COLOR);
                }
            },

            overlapCheck: function (piece, x, y, color) {
                piece = piece.getPiece();
                var nodeArr = piece.nodeArr;
                for (i in nodeArr) {
                    var j = x + nodeArr[i][0] + (y + nodeArr[i][1]) * width;
                    if (table.M1[j] == color) {
                        return false;
                    }
                }
                return true;
            },

            clone: function (fromObj, toObj) {
                for (var i in table[fromObj]) {
                    table[toObj][i] = table[fromObj][i];
                }
            }
        };

    }

    function query() {
        $.get("api/v2/event.php", {type: "q", aid: aid, gid: gid}, function (result) {
            if (result.length == 0)
                return;
            gameTable.clone("M1", "now");
            var yourTurn = false;
            var i, p;
            for (i in result) {
                aid = result[i].id;
                p = new Piece(result[i].pid);
                p.roll(result[i].direction);
                if (result[i].inverse) {
                    p.mirror();
                }
                gameTable.changeTableNow(p, result[i].x, result[i].y, result[i].color);
                if (result[i].color != COLOR) {
                    yourTurn = true;
                } else {
                    startFlag = false;
                }
            }
            if (yourTurn && !startFlag) {
                alert('到你了');
            }
            gameTable.clone("now", "M1");
            gameTable.show("now");
        }, 'json');
    }

    var aid = 0;
    var activePlayer;

    var player = {
        0: '1',
        1: '2',
        2: '3-1',
        3: '3-2',
        4: '4-1',
        5: '4-2',
        6: '4-3',
        7: '4-4',
        8: '4-5',
        9: '5-1',
        10: '5-2',
        11: '5-3',
        12: '5-4',
        13: '5-5',
        14: '5-6',
        15: '5-7',
        16: '5-8',
        17: '5-9',
        18: '5-10',
        19: '5-11',
        20: '5-12'
    };

    var pieceSelect = $("#piece");
    var i, tmp = [];
    var startFlag = true;

    for (i in player) {
        tmp = tmp.concat($("<option>").val(i).html(player[i]));
    }
    pieceSelect.append(tmp);

    var gameTable = new Table("game-table", WIDTH);
    var selectTable = new Table("select-table", 5);

    var td = $('#game-table').find('td');
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
    var piece;

    query();
    setInterval(query, 3000);

    pieceSelect.change(function () {
        piece = new Piece(pieceSelect.val(), COLOR);
        selectTable.clone("blank", "now");
        selectTable.changeTableNow(piece, 2, 2, COLOR);
        selectTable.show("now");
    });

    pieceSelect.change();

    $("#roll").click(function () {
        piece.roll(1);
        selectTable.clone("blank", "now");
        selectTable.changeTableNow(piece, 2, 2, COLOR);
        selectTable.show("now");
    });

    $("#mirror").click(function () {
        piece.mirror();
        selectTable.clone("blank", "now");
        selectTable.changeTableNow(piece, 2, 2, COLOR);
        selectTable.show("now");
    });

    td.mouseenter(function () {
        var x = $(this).index();
        var y = $(this).parent().index();
        gameTable.clone("M1", "now");
        if (gameTable.overlapCheck(piece, x, y, COLOR)) {
            gameTable.changeTableNow(piece, x, y, COLOR);
        } else {
            gameTable.clone("M1", "now");
        }
        gameTable.show("now");
    });

    td.click(function () {
        var x = $(this).index();
        var y = $(this).parent().index();
        var p = piece.getPiece();
        if (!gameTable.sideCheck(piece, x, y, COLOR)) {
            console.log("side false");
            return;
        }
        if (startFlag && gameTable.startCheck(piece, x, y, COLOR)
            || gameTable.cornerCheck(piece, x, y, COLOR)) {
            startFlag = false;
            gameTable.clone("now", "M1");
            $.post("api/v2/event.php", {
                type: "c",
                gid: gid,
                piece: {
                    id: p.id, color: p.color, inverse: p.inverse, direction: p.direction
                },
                x: x,
                y: y
            }, function (result) {
                $("body").append(result);//todo fail?
            });
            pieceSelect.find(":selected").remove();
            pieceSelect.change();
        }
    });

    $('#game-table').mouseleave(function () {
        gameTable.show("M1");
    });

});