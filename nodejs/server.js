var http = require("http");
var io = require('socket.io').listen(8081);

var buffer = [];

io.on('connection', function(client){
    console.log('client connected: ', client);
    client.send({ buffer: buffer });


    client.on('message', function(message){
        console.log('client send a message: ', message);
        
        buffer.push(message);
        client.broadcast.emit('newMessage', message);
        client.emit('newMessage', buffer);

    });

    client.on('positionChanged', function(data) {
        client.broadcast.emit('newPosition', data);
    });

    client.on('newElement', function(data) {
        console.log('newElement', data);
        client.broadcast.emit('newElement', data);
        client.emit('newElement', data);
    });

    client.on('disconnect', function(){
        console.log('client disconnected');
    });
});

