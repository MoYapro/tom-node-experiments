var socket = io.connect('http://localhost:8080');


socket.on('message', function (data) {
    console.log('client: got data from the server: ' + data);

});

socket.on('getNewMessage', function(data){
    console.log('client: get new data', data);
    var allMsg = '';
    for(elem in data) {
        allMsg = data[elem] + '<br />' + allMsg;


    }
    $('#output').html(allMsg);
});

