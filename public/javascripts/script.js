var RR = RR || {};
var CANVAS_ID = 'drawing-area';
var CANVAS_WIDTH = 1065;
var CANVAS_HEIGHT = 515;
var CANVAS_MIN_X_BOUND = 0;
var CANVAS_MIN_Y_BOUND = 0;
var SMALLEST_CIRCLE_RADIUS = 5;
var LARGEST_CIRCLE_RADIUS = 20;
var DEFAULT_FILL_COLOURS = ['#FFA3EF','#627BE8','#A2FFD4','#E7E888','#FFAE5B'];
var DEFAULT_STROKE_COLOUR = '#ccc';
var DEFAULT_STROKE_WIDTH = 2;
var ANIMATION_INTERVAL_MS = 10;
var PLAYER_X_SPEED = 2;
var PLAYER_Y_SPEED = 2;

RR.Helpers = {
	getRandomNumber: function(min, max) {
			// Credit - MDN Developer Resources
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  			return Math.floor(Math.random() * (max - min + 1) + min);
	}
};

RR.Renderer = function(canvasId) {

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

RR.Program = function() {

	var _renderer;
	var _canvas;
	var _playerX;
	var _playerY;

	function init() {
		_renderer = new RR.Renderer(CANVAS_ID);
		_canvas = _renderer.initCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	function addPlayer() {
		if (_canvas) {
			_playerX = RR.Helpers.getRandomNumber(1, CANVAS_HEIGHT);
			_playerY = RR.Helpers.getRandomNumber(1, CANVAS_HEIGHT);
			var radius = RR.Helpers.getRandomNumber(SMALLEST_CIRCLE_RADIUS, LARGEST_CIRCLE_RADIUS);
			var colour = DEFAULT_FILL_COLOURS[RR.Helpers.getRandomNumber(0, DEFAULT_FILL_COLOURS.length-1)];
		
			if (_playerX+radius >= CANVAS_WIDTH)
				_playerX = CANVAS_WIDTH - radius;
		
			if (_playerY+radius >= CANVAS_HEIGHT)
				_playerY = CANVAS_HEIGHT - radius;
		
			if (_playerX-radius <= CANVAS_MIN_X_BOUND)
				_playerX = radius;
		
			if (_playerY-radius <= CANVAS_MIN_Y_BOUND)
				_playerY = radius;
		
			var circle = _renderer.createCircle(_canvas, _playerX, _playerY, radius);
			_renderer.fillShape(circle, colour);
			_renderer.strokeShape(circle, DEFAULT_STROKE_COLOUR, DEFAULT_STROKE_WIDTH);

			return circle;
		}
	}

	function animatePlayer(player) {

		if ((_playerX + PLAYER_X_SPEED > CANVAS_WIDTH) || (_playerX + PLAYER_X_SPEED < CANVAS_MIN_X_BOUND))
			PLAYER_X_SPEED = -PLAYER_X_SPEED;
		
		if ((_playerY + PLAYER_Y_SPEED > CANVAS_HEIGHT) || (_playerY + PLAYER_Y_SPEED < CANVAS_MIN_Y_BOUND))
			PLAYER_Y_SPEED = -PLAYER_Y_SPEED;

		_playerX += PLAYER_X_SPEED;
		_playerY += PLAYER_Y_SPEED;

		_renderer.drawShape(player, _playerX, _playerY);
	}

	init();
	var player = addPlayer();

	var interval = setInterval(function() { animatePlayer(player); }, ANIMATION_INTERVAL_MS);
	
};

new RR.Program();