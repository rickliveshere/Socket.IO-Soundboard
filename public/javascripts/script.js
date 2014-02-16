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
	DEFAULT_FILL_COLOURS: ['#FFA3EF','#627BE8','#A2FFD4','#E7E888','#FFAE5B'],
	DEFAULT_STROKE_COLOUR: '#ccc',
	DEFAULT_STROKE_WIDTH: 2,
	ANIMATION_INTERVAL_MS: 10,
	MIN_X_SPEED: -5,
	MIN_Y_SPEED: -5,
	MAX_X_SPEED: 5,
	MAX_Y_SPEED: 5,
	COLLISION_SOUNDS: ['/sounds/beep.mp3', '/sounds/beep2.mp3', '/sounds/beep3.mp3']
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
			shape.attr('fill', fillColour);
		},
		strokeShape: function(shape, strokeColour, strokeWidth) {
			shape.attr('stroke', strokeColour);
			shape.attr('stroke-width', strokeWidth);
		},
		drawShape: function(shape, x, y) {
			shape.attr('cx', x);
			shape.attr('cy', y);
		}
	};
};

// Audio functions
RR.AudioPlayer = function() {

	var _audioFiles = {};

	function loadAudioFile(index, audioFilePath) {

		var audio = _audioFiles[index];

		if (!audio)
		{
			audio = new Audio(audioFilePath);
			_audioFiles[index] = audio;
		}
		
		if (!audio.paused) {
			audio.pause();
			audio.currentTime = 0;
		}
		
		audio.play();
	}

	return {
		playSound: function(index, audioFilePath) {
			loadAudioFile(index, audioFilePath);
		}
	};
};

// Main program
RR.Program = function() {

	var _drawing;
	var _audioPlayer;
	var _canvas;
	var _players = {};

	function init() {
		_drawing = new RR.Drawing(RR.Globals.CANVAS_ID);
		_canvas = _drawing.initCanvas(RR.Globals.CANVAS_WIDTH, RR.Globals.CANVAS_HEIGHT);
		_audioPlayer = new RR.AudioPlayer();
	}

	function addPlayer() {
		if (_canvas) {

			// Setup
			var x = RR.Helpers.getRandomNumber(1, RR.Globals.CANVAS_HEIGHT);
			var y = RR.Helpers.getRandomNumber(1, RR.Globals.CANVAS_HEIGHT);
			var xSpeed = RR.Helpers.getRandomNumber(RR.Globals.MIN_X_SPEED, RR.Globals.MAX_X_SPEED);
			var ySpeed = RR.Helpers.getRandomNumber(RR.Globals.MIN_Y_SPEED, RR.Globals.MAX_Y_SPEED);

			if (!xSpeed && !ySpeed) {
				xSpeed = RR.Globals.MAX_X_SPEED;
				ySpeed = RR.Helpers.getRandomNumber(RR.Globals.MIN_Y_SPEED, RR.Globals.MAX_Y_SPEED);;
			}


			var radius = RR.Helpers.getRandomNumber(RR.Globals.SMALLEST_CIRCLE_RADIUS, RR.Globals.LARGEST_CIRCLE_RADIUS);
			var colour = RR.Globals.DEFAULT_FILL_COLOURS[RR.Helpers.getRandomNumber(0, RR.Globals.DEFAULT_FILL_COLOURS.length-1)];
			var sound = RR.Helpers.getRandomNumber(0, RR.Globals.COLLISION_SOUNDS.length-1);

			if (x+radius >= RR.Globals.CANVAS_WIDTH)
				x = RR.Globals.CANVAS_WIDTH - radius;
		
			if (y+radius >= RR.Globals.CANVAS_HEIGHT)
				y = RR.Globals.CANVAS_HEIGHT - radius;
		
			if (x-radius <= RR.Globals.CANVAS_MIN_X_BOUND)
				x = radius;
		
			if (y-radius <= RR.Globals.CANVAS_MIN_Y_BOUND)
				y = radius;
		
			var circle = _drawing.createCircle(_canvas, x, y, radius);

			circle.data('xSpeed', xSpeed);
			circle.data('ySpeed', ySpeed);
			circle.data('sound', sound);

			_drawing.fillShape(circle, colour);
			_drawing.strokeShape(circle, RR.Globals.DEFAULT_STROKE_COLOUR, RR.Globals.DEFAULT_STROKE_WIDTH);

			return circle;
		}
	}

	function animatePlayer(player) {

		var radius = player.attr('r');
		var x = player.attr('cx');
		var y = player.attr('cy');
		var xBound = x;
		var yBound = y;
		var xSpeed = player.data('xSpeed');
		var ySpeed = player.data('ySpeed');
		var soundIndex = player.data('sound');
		var sound = RR.Globals.COLLISION_SOUNDS[soundIndex];

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

		player.data('xSpeed', xSpeed);
		player.data('ySpeed', ySpeed);
	}

	init();

	for (var i = 0; i < 20; i++) {
		_players[i] = addPlayer();
	};

	setInterval(
		function() { 
			
			for (var i = 0; i < 20; i++) {
				var player = _players[i];
				if (player)
					animatePlayer(player); 
			};
		}, 
		RR.Globals.ANIMATION_INTERVAL_MS);
	
};

new RR.Program();