$(document).ready(function () {

    var url = window.location.protocol + "//" + window.location.hostname;
    var socket = null;
    var socketId = null;
    $('.overlay').hide();
    $('.modal').hide();

    $('.start-btn').click(function () {
        $('.overlay').show();
        $('.modal').show();
        socket = io.connect(url);
        socket.on('setId', function (data) {
            socketId = data;
        });
        socket.on('matchFound', function (data) {
            $('.overlay').hide();
            $('.modal').hide();
        });
        socket.on('updateBlock', function (data) {
            console.log(data);
            var block = $("div[r1="+data.r1+"][c1="+data.c1+"][r2="+data.r2+"][c2="+data.c2+"]");
            if(data.socketId === socketId){
                block.css('background-color', 'black');
            } else {
                block.css('background-color', 'red');
            }

            block.attr('clicked', 'yes');

        });
    });


    $('.horizontal-line, .vertical-line').click(function () {
        var r1 = $(this).attr('r1');
        var c1 = $(this).attr('c1');
        var r2 = $(this).attr('r2');
        var c2 = $(this).attr('c2');

        var edgeId = {'socketId': socketId, 'r1': r1, 'c1': c1, 'r2': r2, 'c2': c2};
        socket.emit('userClick', edgeId);
    });

    $('.horizontal-line, .vertical-line').hover(
        function () {
            if ($(this).attr('clicked') !== 'yes') {
                $(this).css('background-color', 'grey');
            }
        },
        function () {
            if ($(this).attr('clicked') !== 'yes') {
                $(this).css('background', 'transparent');
            }
        });
});