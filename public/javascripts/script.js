var RR = RR || {};
var CANVAS_ID = 'drawing-area';
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;
var CANVAS_MIN_X_BOUND = 0;
var CANVAS_MIN_Y_BOUND = 0;
var SMALLEST_CIRCLE_RADIUS = 5;
var LARGEST_CIRCLE_RADIUS = 20;
var DEFAULT_FILL_COLOURS = ['#FFA3EF','#627BE8','#A2FFD4','#E7E888','#FFAE5B'];
var DEFAULT_STROKE_COLOUR = '#ccc';
var DEFAULT_STROKE_WIDTH = 2;

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
		drawCircle: function(canvas, x, y, radius) {
			return canvas.circle(x, y, radius);
		},
		fillShape: function(shape, fillColour) {
			shape.attr('fill', fillColour);
		},
		strokeShape: function(shape, strokeColour, strokeWidth) {
			shape.attr('stroke', strokeColour);
			shape.attr('stroke-width', strokeWidth);
		}
	};
};

RR.Program = function() {

	var _renderer;
	var _canvas;

	function init() {
		_renderer = new RR.Renderer(CANVAS_ID);
		_canvas = _renderer.initCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	function addPlayer() {
		if (_canvas) {
			var x = RR.Helpers.getRandomNumber(1, CANVAS_HEIGHT);
			var y = RR.Helpers.getRandomNumber(1, CANVAS_HEIGHT);
			var radius = RR.Helpers.getRandomNumber(SMALLEST_CIRCLE_RADIUS, LARGEST_CIRCLE_RADIUS);
			var colour = DEFAULT_FILL_COLOURS[RR.Helpers.getRandomNumber(0, DEFAULT_FILL_COLOURS.length-1)];
		
			if (x+radius >= CANVAS_WIDTH)
				x = CANVAS_WIDTH - radius;
		
			if (y+radius >= CANVAS_HEIGHT)
				y = CANVAS_HEIGHT - radius;
		
			if (x-radius <= CANVAS_MIN_X_BOUND)
				x = radius;
		
			if (y-radius <= CANVAS_MIN_Y_BOUND)
				y = radius;
		
			var circle = _renderer.drawCircle(_canvas, x, y, radius);
			_renderer.fillShape(circle, colour);
			_renderer.strokeShape(circle, DEFAULT_STROKE_COLOUR, DEFAULT_STROKE_WIDTH);
		}
	}

	init();
	addPlayer();
};

new RR.Program();