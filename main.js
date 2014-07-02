$(document).ready(function () {

    var url = window.location.protocol + "//" + window.location.hostname;
    var socket = null;
    var socketId, opponentId = null;
    $('.overlay').hide();
    $('.modal').hide();
    var NUM_ROWS = 5;
    var NUM_COLS = 5;

    var last_played = null;

    $('.start-btn').click(function () {
        $('.overlay').show();
        $('.modal').show();
        socket = io.connect(url);
        socket.on('setId', function (data) {
            socketId = data.self;
            opponentId = data.opponent;
        });
        socket.on('matchFound', function (data) {
            $('.overlay').hide();
            $('.modal').hide();
        });
        socket.on('updateBlock', function (data) {
            function checkBoxFull(block, data) {
                var horizontal = false;
                var vertical = false;

                var class_to_box =   (socketId === data.socketId) ? "full-self" : "full-other";

                if(data.r1 === data.r2){horizontal = true}
                if(data.c1 === data.c2){vertical = true}

                if(horizontal){
                    if(data.r1 < NUM_ROWS){
                        var down_right = $("div[r1="+(data.r2)+"][c1="+(data.c2)+"][r2="+(data.r2+1)+"][c2="+(data.c2)+"]");
                        var down_left = $("div[r1="+(data.r1)+"][c1="+(data.c1)+"][r2="+(data.r1+1)+"][c2="+(data.c1)+"]");
                        var down_block = $("div[r1="+(data.r1+1)+"][c1="+(data.c1)+"][r2="+(data.r2+1)+"][c2="+(data.c2)+"]");

                        if(block.attr('clicked') === 'yes' && down_right.attr('clicked') === 'yes' && down_left.attr('clicked') === 'yes' && down_block.attr('clicked') === 'yes'){
                            $("div[x="+data.r1+"][y="+data.c1+"]").addClass(class_to_box);
                        }
                    }

                    if(data.r1 > 0) {
                        var up_right = $("div[r1=" + (data.r2 - 1) + "][c1=" + (data.c2) + "][r2=" + (data.r2) + "][c2=" + (data.c2) + "]");
                        var up_left = $("div[r1=" + (data.r1 - 1) + "][c1=" + (data.c1) + "][r2=" + (data.r1) + "][c2=" + (data.c1) + "]");
                        var up_block = $("div[r1=" + (data.r1 - 1) + "][c1=" + (data.c1) + "][r2=" + (data.r2 - 1) + "][c2=" + (data.c2) + "]");

                        if(block.attr('clicked') === 'yes' && up_right.attr('clicked') === 'yes' && up_left.attr('clicked') === 'yes' && up_block.attr('clicked') === 'yes'){
                            $("div[x="+(data.r1-1)+"][y="+data.c1+"]").addClass(class_to_box);
                        }
                    }

                } else if (vertical) {
                    if(data.c1 < NUM_COLS){
                        var top_right = $("div[r1="+(data.r1)+"][c1="+(data.c1)+"][r2="+(data.r1)+"][c2="+(data.c1+1)+"]");
                        var down_right = $("div[r1="+(data.r2)+"][c1="+(data.c2)+"][r2="+(data.r2)+"][c2="+(data.c2+1)+"]");
                        var right_block = $("div[r1="+(data.r1)+"][c1="+(data.c1+1)+"][r2="+(data.r2)+"][c2="+(data.c2+1)+"]");

                        if(block.attr('clicked') === 'yes' && top_right.attr('clicked') === 'yes' && down_right.attr('clicked') === 'yes' && right_block.attr('clicked') === 'yes'){
                            $("div[x="+data.r1+"][y="+data.c1+"]").addClass(class_to_box);
                        }
                    }

                    if(data.c1 > 0) {
                        var top_left = $("div[r1=" + (data.r1) + "][c1=" + (data.c1 - 1) + "][r2=" + (data.r1) + "][c2=" + (data.c1) + "]");
                        var down_left = $("div[r1=" + (data.r2) + "][c1=" + (data.c2 - 1) + "][r2=" + (data.r2) + "][c2=" + (data.c2) + "]");
                        var left_block = $("div[r1=" + (data.r1) + "][c1=" + (data.c1 - 1) + "][r2=" + (data.r2) + "][c2=" + (data.c2 - 1) + "]");
                    }
                    if(block.attr('clicked') === 'yes' && top_left.attr('clicked') === 'yes' && down_left.attr('clicked') === 'yes' && left_block.attr('clicked') === 'yes'){
                        $("div[x="+data.r1+"][y="+(data.c1-1)+"]").addClass(class_to_box);
                    }
                }
            }
            if(last_played !== data.socketId){
                var block = $("div[r1="+data.r1+"][c1="+data.c1+"][r2="+data.r2+"][c2="+data.c2+"]");
                if(data.socketId === socketId){
                    block.css('background-color', 'black');
                } else {
                    block.css('background-color', 'red');
                }
                block.attr('clicked', 'yes');
                last_played = data.socketId;
            }
            checkBoxFull(block, data)
        });
    });

    $('.horizontal-line, .vertical-line').click(function () {
        var r1 = $(this).attr('r1');
        var c1 = $(this).attr('c1');
        var r2 = $(this).attr('r2');
        var c2 = $(this).attr('c2');

        var edgeId = {'socketId': socketId, 'r1': parseInt(r1), 'c1': parseInt(c1), 'r2': parseInt(r2), 'c2': parseInt(c2)};
        if($(this).attr('clicked') !== 'yes'){
            socket.emit('userClick', edgeId);
        }
    });

    $('.horizontal-line, .vertical-line').hover(
        function () {
            if ($(this).attr('clicked') !== 'yes' && (last_played == null || last_played !== socketId)) {
                $(this).css('background-color', 'grey');
            }
        },
        function () {
            if ($(this).attr('clicked') !== 'yes' && (last_played == null || last_played !== socketId)) {
                $(this).css('background', 'transparent');
            }
        });
});