$(document).ready(function(){

    var url = window.location.protocol + "//" + window.location.hostname;
    var socket = io.connect(url);

    $('.horizontal-line, .vertical-line').click(function(){
        var r1 = $(this).attr('r1');
        var c1 = $(this).attr('c1');
        var r2 = $(this).attr('r2');
        var c2 = $(this).attr('c2');

        var edgeId = r1+','+c1+','+r2+','+c2;
        console.log("Id ->  " + edgeId);
        $(this).css('background-color', 'black');
        socket.emit('userClick',edgeId);
    });
});