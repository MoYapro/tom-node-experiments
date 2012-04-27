var http = require("http");
var io = require('socket.io').listen(8080);

var buffer = [];

io.on('connection', function(client){
    console.log('client connected: ', client);
    client.send({ buffer: buffer });


    client.on('message', function(message){
        console.log('client send a message: ', message);
        client.send('OK');
        buffer.push(message);
        client.emit('getNewMessage', buffer);

    });

    client.on('disconnect', function(){
        console.log('client disconnected');
    });
});
