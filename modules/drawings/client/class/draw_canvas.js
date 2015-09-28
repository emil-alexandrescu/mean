'use strict';

var DRAW = (function(fabric, $, _, alertify){
	var module = {};

	//constants
	var PI = 3.141592653589792;

	var _lineDirections = {
		t: 270,
		tr: 315,
		r: 0,
		br: 45,
		b: 90,
		bl: 135,
		l: 180,
		tl: 225
	};

	//properties
	var canvas;
	var body = {
		canvas_size: 400,
		fold: {
			type: '',
			position: 't',
			length: 0
		},
		lines: []
	};

	//Public functions
	module.init = function(elementId, options){
		options = _.extend(options || {}, {
			selection: false
		});

		fabric.Object.prototype.originX = 'left';
		fabric.Object.prototype.originY = 'top';

		canvas = this.__canvas = new fabric.Canvas(elementId, options);
		_initEvents();
	};

	module.load = function(newBody){
		body = newBody;
		module.draw();
	};

	module.addLine = function(lineObj){
		body.lines.push(lineObj);
		module.draw();
	};

	module.removeLine = function(lineIndex){
		body.lines.splice(lineIndex, 1);
		module.draw();
	};

	module.updateLine = function(lineObj, lineIndex){
		body.lines[lineIndex] = lineObj;
		module.draw();
	};

	module.drawStartPoint = function(x, y){
		var c = new fabric.Circle({
			left: (x-2),
			top: (y-2),
			radius: 3,
			fill: '#c00',
			selectable: false
		});
		body.start_point = {
			x: x,
			y: y
		};
		canvas.add(c);
	};

	module.drawLines = function(){
		var points = [body.start_point];
		_.each(body.lines, function(l, index){
			points.unshift(_drawLine(l, points));
		});
	};

	module.draw = function(){
		canvas.clear().renderAll();
		if (_.isUndefined(body.start_point)){
			body.start_point = {
				x: body.canvas_size /2,
				y: body.canvas_size /2
			};
		}
		module.drawStartPoint(body.start_point.x, body.start_point.y);
		module.drawLines();
	};

	module.getBody = function(){
		return body;
	};

	//Private Functions
	function __convertToRelativeCoord(point){
		if (_.isObject(point)){
			return {
				x: parseInt(point.x / body.canvas_size * 400),
				y: parseInt(point.y / body.canvas_size * 400)
			};	
		}
		return parseInt(point / body.canvas_size * 400);
	}

	function _drawLine(lineObj, points){
		var startPoint, endPoint, angle;

		if (lineObj.angle){
			angle = lineObj.angle;
		}else{
			angle = _lineDirections[lineObj.direction];
		}

		var deltaAngle = 0,
			deltaX = 0,
			deltaY = 0;
		if (points.length>1){
			deltaX = points[1].x - points[0].x;
			deltaY = points[1].y - points[0].y;
			if (deltaX){
				deltaAngle = Math.atan2((deltaY), (deltaX));
			}
		}else if (lineObj.angle){
			if (_hasDirection(lineObj.direction, 'l')){
				deltaAngle = PI;
			}
		}

		startPoint = points[0];
		var endPoint1 = {
			x: Math.cos(-PI*angle/180 + deltaAngle) * __convertToRelativeCoord(lineObj.length) + startPoint.x,
			y: Math.sin(-PI*angle/180 + deltaAngle) * __convertToRelativeCoord(lineObj.length) + startPoint.y
		};

		var endPoint2 = {
			x: Math.cos(PI*angle/180 + deltaAngle) * __convertToRelativeCoord(lineObj.length) + startPoint.x,
			y: Math.sin(PI*angle/180 + deltaAngle) * __convertToRelativeCoord(lineObj.length) + startPoint.y
		};

		var flag = true;

		if (_hasDirection(lineObj.direction, 'l') && (endPoint1.x - startPoint.x>0)){
			flag = false;
		}

		if (_hasDirection(lineObj.direction, 'r') && (endPoint1.x - startPoint.x<0)){
			flag = false;
		}

		if (_hasDirection(lineObj.direction, 't') && (endPoint1.y - startPoint.y>0)){
			flag = false;
		}

		if (_hasDirection(lineObj.direction, 'b') && (endPoint1.y - startPoint.y<0)){
			flag = false;
		}

		endPoint = flag?endPoint1:endPoint2;

		var resultAngle = flag?(-PI*angle/180 + deltaAngle):(PI*angle/180 + deltaAngle);
		if (points.length === 1 && body.fold.length && body.fold.type){ //draw CF
			_drawFold(resultAngle);
		}else if (points.length>1) { //draw Angle
			_drawAngle(startPoint, deltaAngle, resultAngle, lineObj.angle);
		}

		canvas.add(_createFabricLine(startPoint, endPoint));
		_drawLengthText(startPoint, endPoint, lineObj.length);

		return endPoint;
	}

	function _drawFold(angle){
		switch (body.fold.type){
			case 'cf':
				_drawCrushFold(angle);
				break;
			case 'f':
				_drawFeather(angle);
				break;
			case 'de':
				_drawDropEdge(angle);
				break;
		}
	}

	function _drawCrushFold(angle){
		var startPoint = body.start_point;
		var dAngle = PI/2*(-1);
		var endPoint = {
			x: Math.cos(angle - dAngle) * 10 + startPoint.x,
			y: Math.sin(angle - dAngle) * 10 + startPoint.y
		};
		canvas.add(_createFabricLine(startPoint, endPoint));

		startPoint = endPoint;
		endPoint = {
			x: Math.cos(angle) * __convertToRelativeCoord(body.fold.length) + startPoint.x,
			y: Math.sin(angle) * __convertToRelativeCoord(body.fold.length) + startPoint.y
		};
		canvas.add(_createFabricLine(startPoint, endPoint));

		_drawLengthText(startPoint, endPoint, body.fold.length + ' C/F', 1);
	}

	function _drawDropEdge(angle){
		var startPoint = body.start_point;
		var dAngle = 45/180*PI*(-1);
		var endPoint = {
			x: Math.cos(angle - dAngle) * __convertToRelativeCoord(body.fold.length) + startPoint.x,
			y: Math.sin(angle - dAngle) * __convertToRelativeCoord(body.fold.length) + startPoint.y
		};
		canvas.add(_createFabricLine(startPoint, endPoint));

		_drawLengthText(startPoint, endPoint, body.fold.length + ' D/E', 1);
	}

	function _drawFeather(angle){
		var startPoint = body.start_point;
		var dAngle = 165/180*PI;
		var endPoint = {
			x: Math.cos(angle + dAngle) * __convertToRelativeCoord(body.fold.length) + startPoint.x,
			y: Math.sin(angle + dAngle) * __convertToRelativeCoord(body.fold.length) + startPoint.y
		};
		canvas.add(_createFabricLine(startPoint, endPoint));

		var txtCircle = new fabric.Circle({
			radius: 10,
			fill: '',
			stroke: '#000',
			strokeWidth: 1,
			originX: 'center',
			originY: 'center',
			selectable: false
		});

		var txtObj = new fabric.Text('F', {
			fontSize: 12,
			selectable: false,
			originX: 'center',
			originY: 'center'
		});

		var txtGroup = new fabric.Group([txtCircle, txtObj], {
			left: startPoint.x + Math.cos(angle + dAngle/2)*25,
			top: startPoint.y + Math.sin(angle + dAngle/2)*25,
			hasControls: false,
			hasBorders: false
		});

		canvas.add(txtGroup);
		_drawLengthText(startPoint, endPoint, body.fold.length, 1);
	}

	function _createFabricLine(startPoint, endPoint){
		return new fabric.Line([startPoint.x, startPoint.y, endPoint.x, endPoint.y], {
			fill: '#000',
			strokeWidth: 2,
			stroke: '#000',
			selectable: false
		});
	}

	function _drawAngle(centerPoint, deltaAngle, angle, text){
		if (text){
			_drawAngleText(centerPoint, (angle-deltaAngle)/2 + deltaAngle, text + '°');
		}

		if (angle<0){
			angle += 2*PI;
		}
		if (deltaAngle<0){
			deltaAngle += 2*PI;
		}
		if (angle - deltaAngle > PI || angle-deltaAngle < 0){
			var tmp = deltaAngle;
			deltaAngle = angle;
			angle = tmp;
		}

		var arc = new fabric.Circle({
			radius: 15,
			left: centerPoint.x,
			top: centerPoint.y,
			startAngle: deltaAngle,
			endAngle: angle,
			stroke: '#000',
			strokeWidth: 2,
			originX: 'center',
			originY: 'center',
			selectable: false,
			fill: ''
		});
		canvas.add(arc);
	}

	function _drawAngleText(centerPoint, avgAngle, text){
		var txtObj = new fabric.Text(text, {
			fontSize: 12,
			textAlign: 'center',
			hasControls: false,
			hasBorders: false,
			left: centerPoint.x + Math.cos(avgAngle)*30,
			top: centerPoint.y + Math.sin(avgAngle)*30,
			originX: 'center',
			originY: 'center'
		});
		canvas.add(txtObj);
		canvas.bringToFront(txtObj);
	}

	function _drawLengthText(startPoint, endPoint, text, dir){
		dir = dir || 1;
		var centerPoint = {
			x: (endPoint.x - startPoint.x)/2 + startPoint.x,
			y: (endPoint.y - startPoint.y)/2 + startPoint.y
		};
		var angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) + PI/2*dir;
		var txtObj = new fabric.Text(text, {
			fontSize: 14,
			textAlign: 'center',
			left: centerPoint.x + Math.cos(angle)*15,
			top: centerPoint.y + Math.sin(angle)*15,
			originX: 'center',
			originY: 'center',
			hasControls: false,
			hasBorders: false
		});
		canvas.add(txtObj);
		canvas.bringToFront(txtObj);
	}

	function _hasDirection(direction, d){
		return direction.indexOf(d) !== -1;
	}

	function _initEvents(){
		canvas.on('mouse:down', function(evt){
			if (_.isUndefined(body.start_point)){
				//create start point
				module.drawStartPoint(evt.e.layerX, evt.e.layerY);
			}
		});
	}

	return module;
})(fabric, jQuery, _, alertify);