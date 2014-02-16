var RR = RR || {};

// Global settings
RR.Globals = {
	CANVAS_ID: 'drawing-area',
	CANVAS_WIDTH: 1065,
	CANVAS_HEIGHT: 519,
	CANVAS_MIN_X_BOUND: 0,
	CANVAS_MIN_Y_BOUND: 0,
	SMALLEST_CIRCLE_RADIUS: 5,
	LARGEST_CIRCLE_RADIUS: 20,
	FILL_COLOURS: ['#FFA3EF','#627BE8','#A2FFD4','#E7E888','#FFAE5B'],
	STROKE_COLOUR: '#ccc',
	STROKE_WIDTH: 2,
	ANIMATION_INTERVAL_MS: 10,
	MIN_X_SPEED: -5,
	MIN_Y_SPEED: -5,
	MAX_X_SPEED: 5,
	MAX_Y_SPEED: 5,
	SMALL_COLLISION_SOUND: '/sounds/small.mp3',
	MEDIUM_COLLISION_SOUND: '/sounds/medium.mp3',
	LARGE_COLLISION_SOUND: '/sounds/large.mp3',
	ATTR_STROKE: 'stroke',
	ATTR_STROKE_WIDTH: 'stroke-width',
	ATTR_FILL: 'fill',
	ATTR_X: 'cx',
	ATTR_Y: 'cy',
	ATTR_RADIUS: 'r',
	DATA_X_SPEED: 'xSpeed',
	DATA_Y_SPEED: 'ySpeed',
	DATA_SOUND: 'sound'
};

// Helper functions
RR.Helpers = {
	getRandomNumber: function(min, max) {
			// Credit - MDN Developer Resources
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  			return Math.floor(Math.random() * (max - min + 1) + min);
	}
};

// Drawing functions
RR.Drawing = function(canvasId) {

	var _canvasId = canvasId;

	return {
		initCanvas: function(width, height) {
			if (Raphael)
				return Raphael(_canvasId, width, height);

			return false;
		},
		createCircle: function(canvas, x, y, radius) {
			return canvas.circle(x, y, radius);
		},
		fillShape: function(shape, fillColour) {
			shape.attr(RR.Globals.ATTR_FILL, fillColour);
		},
		strokeShape: function(shape, strokeColour, strokeWidth) {
			shape.attr(RR.Globals.ATTR_STROKE, strokeColour);
			shape.attr(RR.Globals.ATTR_STROKE_WIDTH, strokeWidth);
		},
		drawShape: function(shape, x, y) {
			shape.attr(RR.Globals.ATTR_X, x);
			shape.attr(RR.Globals.ATTR_Y, y);
		}
	};
};

// Audio functions
RR.AudioPlayer = function() {

	var _audioFiles = {};

	function loadAudio(index, audioFilePath) {

		var audio = _audioFiles[index];

		if (!audio)
		{
			audio = new Audio(audioFilePath);
			_audioFiles[index] = audio;
		}
		
		return audio;
	}

	function playAudio(audio) {
		if (!audio.paused) {
			audio.pause();
			audio.currentTime = 0;
		}
		
		audio.play();
	}

	return {
		playSound: function(index, audioFilePath) {
			var audio = loadAudio(index, audioFilePath);
			playAudio(audio);
		}
	};
};

// Collision functions
RR.Collision = function() {
	return {
		detectXCanvasCollision: function(x, radius) {
			if (x+radius >= RR.Globals.CANVAS_WIDTH)
				x = RR.Globals.CANVAS_WIDTH - radius;
			
			if (x-radius <= RR.Globals.CANVAS_MIN_X_BOUND)
				x = radius;
	
			return x;
		},
		detectYCanvasCollision: function(y, radius) {
			if (y+radius >= RR.Globals.CANVAS_HEIGHT)
				y = RR.Globals.CANVAS_HEIGHT - radius;
			
			if (y-radius <= RR.Globals.CANVAS_MIN_Y_BOUND)
				y = radius;
	
			return y;
		}
	};
};


// Main program
RR.Program = function() {

	var _drawing;
	var _audioPlayer;
	var _collision;
	var _canvas;
	var _players = {};

	function init() {
		_drawing = new RR.Drawing(RR.Globals.CANVAS_ID);
		_canvas = _drawing.initCanvas(RR.Globals.CANVAS_WIDTH, RR.Globals.CANVAS_HEIGHT);
		_audioPlayer = new RR.AudioPlayer();
		_collision = new RR.Collision();
	}

	function getPlayerSound(radius) {
		if (radius < 10)
				return RR.Globals.SMALL_COLLISION_SOUND;
		if (radius >= 10 && radius < 15)
				return RR.Globals.MEDIUM_COLLISION_SOUND;
		
		return RR.Globals.LARGE_COLLISION_SOUND;
	}


	function addPlayer() {
		if (_canvas) {

			// Setup
			var x = RR.Helpers.getRandomNumber(1, RR.Globals.CANVAS_HEIGHT);
			var y = RR.Helpers.getRandomNumber(1, RR.Globals.CANVAS_HEIGHT);
			var xSpeed = RR.Helpers.getRandomNumber(RR.Globals.MIN_X_SPEED, RR.Globals.MAX_X_SPEED);
			var ySpeed = RR.Helpers.getRandomNumber(RR.Globals.MIN_Y_SPEED, RR.Globals.MAX_Y_SPEED);
			var radius = RR.Helpers.getRandomNumber(RR.Globals.SMALLEST_CIRCLE_RADIUS, RR.Globals.LARGEST_CIRCLE_RADIUS);
			var colour = RR.Globals.FILL_COLOURS[RR.Helpers.getRandomNumber(0, RR.Globals.FILL_COLOURS.length-1)];
			var sound = getPlayerSound(radius);

			if (!xSpeed && !ySpeed) {
				xSpeed = RR.Globals.MAX_X_SPEED;
				ySpeed = RR.Helpers.getRandomNumber(RR.Globals.MIN_Y_SPEED, RR.Globals.MAX_Y_SPEED);
			}

			x = _collision.detectXCanvasCollision(x, radius);
			y = _collision.detectYCanvasCollision(y, radius);

			var player = _drawing.createCircle(_canvas, x, y, radius);

			player.data(RR.Globals.DATA_X_SPEED, xSpeed);
			player.data(RR.Globals.DATA_Y_SPEED, ySpeed);
			player.data(RR.Globals.DATA_SOUND, sound);

			_drawing.fillShape(player, colour);
			_drawing.strokeShape(player, RR.Globals.STROKE_COLOUR, RR.Globals.STROKE_WIDTH);

			return player;
		}
	}

	function animatePlayer(player) {

		var radius = player.attr(RR.Globals.ATTR_RADIUS);
		var x = player.attr(RR.Globals.ATTR_X);
		var y = player.attr(RR.Globals.ATTR_Y);
		var xBound = x;
		var yBound = y;
		var xSpeed = player.data(RR.Globals.DATA_X_SPEED);
		var ySpeed = player.data(RR.Globals.DATA_Y_SPEED);
		var sound = player.data(RR.Globals.DATA_SOUND);

		if (xSpeed < 0)
			xBound -= radius;
		else
			xBound += radius;

		if (ySpeed < 0)
			yBound -= radius;
		else
			yBound += radius;

		if ((xBound + xSpeed > RR.Globals.CANVAS_WIDTH) || (xBound + xSpeed < RR.Globals.CANVAS_MIN_X_BOUND))
		{
			xSpeed = -xSpeed;
			_audioPlayer.playSound(player.id, sound);
		}
		
		if ((yBound + ySpeed > RR.Globals.CANVAS_HEIGHT) || (yBound + ySpeed < RR.Globals.CANVAS_MIN_Y_BOUND))
		{
			ySpeed = -ySpeed;
			_audioPlayer.playSound(player.id, sound);
		}

		x += xSpeed;
		y += ySpeed;

		_drawing.drawShape(player, x, y);

		player.data(RR.Globals.DATA_X_SPEED, xSpeed);
		player.data(RR.Globals.DATA_Y_SPEED, ySpeed);
	}

	init();

	for (var i = 0; i < 100; i++) {
		_players[i] = addPlayer();
	};

	setInterval(
		function() { 
			
			for (var i = 0; i < 100; i++) {
				var player = _players[i];
				if (player)
					animatePlayer(player); 
			};
		}, 
		RR.Globals.ANIMATION_INTERVAL_MS);
	
};

new RR.Program();