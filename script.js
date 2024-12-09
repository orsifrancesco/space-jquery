function game() {

    let score = 0;
    let gameOver = true;
    let enemyLoop;
    let enemyTimout = [];

    var overlaps = (function () {

        function getPositions(elem) {
            var pos, width, height;
            pos = $(elem).position();
            width = $(elem).width();
            height = $(elem).height();
            if (
                !gameOver &&
                $(elem).length > 0
            ) {
                return [[pos.left, pos.left + width], [pos.top, pos.top + height]];
            }
        }

        function comparePositions(p1, p2) {
            var r1, r2;
            r1 = p1[0] < p2[0] ? p1 : p2;
            r2 = p1[0] < p2[0] ? p2 : p1;
            if (
                !gameOver// &&
                //pos.left != undefined
            ) {
                return r1[1] > r2[0] || r1[0] === r2[0];
            }
        }

        return function (a, b) {
            var pos1 = getPositions(a),
                pos2 = getPositions(b);
            if (
                !gameOver// &&
                //pos.left != undefined
            ) {
                return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
            }
        };

    })();

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function enemyCheck(id) {
        if ($(id).length > 0) {
            if (!gameOver) {
                if (overlaps('#player', id)) {
                    endGame();
                }
            }
        }
    }

    function enemy({ id, delayTime, durationTime, leftOrigin, leftDestination }) {
        if (!gameOver) {
            $('<div class="enemy" data-id="' + id + '"></div>').appendTo('#game');
            $('.enemy[data-id="' + id + '"]').css('left', leftOrigin);
            $('.enemy[data-id="' + id + '"]').animate(
                {
                    left: leftDestination,
                    top: 500
                },
                {
                    duration: delayTime, easing: "linear", complete: function () {
                        if (!gameOver) {
                            score += 1;
                            $('#score').text(score);
                            enemyTimout[enemyTimout.length] = setTimeout(function () {
                                $('.enemy[data-id="' + id + '"]').fadeOut(250, function () {
                                    $('.enemy[data-id="' + id + '"]').remove();
                                    enemy({
                                        id,
                                        delayTime: getRandomInt(1000, 3000),
                                        durationTime: getRandomInt(1500, 2900),
                                        leftOrigin,
                                        leftDestination
                                    });
                                });
                            }, delayTime);
                        }
                    }
                }
            );
        }
    }

    function startGame() {
        $('#player').removeClass('hide');
        $('#box').addClass('hide');
        gameOver = false;
        score = 0;
        $('#score').text(score);

        for (let i = 0; i < 4; i++) {
            setTimeout(function () {
                enemy({
                    id: i,
                    delayTime: getRandomInt(1000, 3000),
                    durationTime: getRandomInt(1500, 2900),
                    leftOrigin: getRandomInt(0, 300),
                    leftDestination: getRandomInt(0, 300)
                });
            }, getRandomInt(3000, 12000));
        }

        enemyLoop = setInterval(function () {
            for (let i = 0; i < 4; i++) {
                enemyCheck('.enemy[data-id="' + i + '"]');
            }
        }, 25);

    }

    function endGame() {
        gameOver = true;
        $('#player').addClass('hide');
        $('#player').css({ top: '450px', left: '140px' });
        clearInterval(enemyLoop);
        for (var i = 0; i < enemyTimout.length; i++) {
            clearTimeout(enemyTimout[i]);
        }
        enemyTimout.length = 0;
        $('.enemy').fadeOut(250, function () {
            $('.enemy').remove();
        })
        setTimeout(function () {
            $('#box').removeClass('hide');
        }, 1000)
    }

    function playerActions(x) {

        var player = $('#player');
        var space = 25;

        var leftParent = 0;
        var rightParent = 280;
        var topParent = 0;
        var bottomParent = 460;

        if (!gameOver) {
            if (x == 'left') {
                if ((player.position().left - space) < leftParent) { player.css({ left: leftParent }); }
                else { player.css({ left: '-=' + space }); player }
            } else if (x == 'up') {
                if ((player.position().top - space) < topParent) { player.css({ top: topParent }); }
                else { player.css({ top: '-=' + space }); }
            } else if (x == 'right') {
                if ((player.position().left + space) > rightParent) { player.css({ left: rightParent }); }
                else { player.css({ left: '+=' + space }); }
            } else if (x == 'down') {
                if ((player.position().top + space) > bottomParent) { player.css({ top: bottomParent }); }
                else { player.css({ top: '+=' + space }); }
            }
        }

    }

    $(document).keydown(function (e) {
        if (!gameOver) {
            if (e.which == 37) playerActions('left');
            else if (e.which == 38) playerActions('up');
            else if (e.which == 39) playerActions('right');
            else if (e.which == 40) playerActions('down');
        }
    });

    $('#box button').click(function () {
        startGame();
    });

}

game();