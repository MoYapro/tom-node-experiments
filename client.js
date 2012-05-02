var socket = io.connect('http://localhost:8081');


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

socket.on('newElement', function(data) {
	console.log('newElement', data);
	insertNewElement(data);
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

var parseElementString = function(elementString) {
	var element = $(elementString.tag);
	element.addClass(elementString.class);
	element.attr('style', elementString.style);
	element.attr('id', elementString.id);

	return element;
};

var insertNewElement = function(args) {
	console.log('got new element from server', args);
	var parent;
	if(!args.parentId) {
		parent = $('body');
	} else {
		parent = $('#' + args.parentId);
	}

	console.log('newElement is: ', args.newElement);

	parent.append(parseElementString(args.newElement));
};

var addElement = function() {

var newElement = {
		'tag' 	: '<div/>',
		'class' : 'dragable',
		'style' : 'background-color: red; width: 150px; height: 150px',
		'id'	: 'x' + new Date().getTime()
	};

	var data = {'parentId': null, 'newElement' : newElement};
	socket.emit('newElement', data);
	//insertNewElement(data);
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



var initClientGUI = function() {
	console.log('start build gui');
	var panel = $('<div class="panel"/>');
	panel.append($('<button onclick="addElement();">Add</button>'));


	$('body').append(panel);
	console.log('done build gui');
};



$(document).ready(function() {
initClientGUI();
});

console.log('loaded client');
