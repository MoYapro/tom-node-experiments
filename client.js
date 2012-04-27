var socket = io.connect('http://localhost:8080');


socket.on('message', function (data) {
    console.log('client: got data from the server: ' + data);

});

socket.on('newMessage', function(data){
    console.log('client: get new data', data);
    var allMsg = '';
    for(elem in data) {
        allMsg = data[elem] + '<br />' + allMsg;
    }
    $('#output').html(allMsg);
});

socket.on('newPosition', function(data) {
	applyPosition(data);
});

var getPos = function(e) {
	tempX = e.pageX
	tempY = e.pageY
	var returnObj = {x : tempX, y : tempY};
	return returnObj;
};

var applyPosition = function(args) {
	if('string' === typeof args.element) {
		var element = $('#'+args.element);	
	} else {
		var element = args.element;
	}
	 
	element.css({'top' : args.y, 'left' : args.x});
};

$('.dragable').live('mousedown', function(event) {
	event.preventDefault();
	var $this = $(this);
	var initialPosition = $this.offset();
	var initialMousePosition = getPos(event);
	$this.addClass('dragging');
	console.log('mousedown');
	$this.css({'position': 'absolute'});
	$(document).bind('mousemove', function(e) {
		e.preventDefault();
		var pos = getPos(e);
		var x = pos.x - initialMousePosition.x + initialPosition.left;
		var y = pos.y - initialMousePosition.y + initialPosition.top;
		socket.emit('positionChanged', {'element' : $this.attr('id'), 'x' : x, 'y' : y});
		applyPosition({'element' : $this.attr('id'), 'x' : x, 'y' : y});
	});
	$this.bind('mouseup', function() {
		console.log('mouseup');
		$this.removeClass('dragging');
		$this.unbind('mouseup');
		$(document).unbind('mousemove');
	});
});

console.log('loaded client');
