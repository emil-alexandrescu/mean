'use strict';

angular.module('works').directive('drawing', ['$timeout',
  function ($timeout) {
    return {
      restrict: 'AE',
      scope: {
        workId: '=',
        drawingBody:'=',
        command: '='
      },
      templateUrl: 'modules/works/views/drawing.client.directive.view.html',
      link: function (scope, element, attrs) {
        var PI = 3.1416;
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

        var canvas;
        var options = {};
        var points = [];
        var angles = [];
        var deltaAngles = [];
        var body = scope.drawingBody;
        var commands;
        var offset;
        var maxSize;
        var fabricObjs = [];
        var margin = 30;
        var $el = $(element).find('.drawing-canvas');
        var absoluteSize = $el.parent().width() - 1;
        var canvasSize;

        $timeout(function(){
          init();
        });

        scope.$watch('command', function(nv, ov){
          if (nv!=ov && nv){
            draw();
          }
          if (nv === '' && canvas){
            _clearAll();
          }
        });
        
        // ======
        // public funcs
        // ======
        function init(){
          options = _.extend(options || {}, {
            selection: false,
            width: absoluteSize,
            height: absoluteSize,
            backgroundColor: '#ffffff'
          });

          fabric.Object.prototype.originX = 'left';
          fabric.Object.prototype.originY = 'top';
          canvas =  new fabric.Canvas($el[0], options);

          _initEvents();
        }

        function draw(){
          _clearAll();
          commands = _parseCommand(scope.command);
          var counter = 0;
          do{
            _getPointsArray();
            _getCanvasSize();
            counter++;
          }while (!_checkMinGirth() && counter<5);
          _draw();
        }

        // ====== 
        // private funcs
        // ======
        // command: ([direction][D/F][angle][.][girth])*
        // direction: l, r, t, b, ll, rr, tt, bb, tl, tr, tl, tb
        // d: drip edge
        // f: feather
        // . for separating angle and girth
        // result is array of array
        // one array element looks like:
        // [command, direction, d/f, angle/girth, dot, girth]
        function _parseCommand(commandString){
          var re = /(l|r|t|b|ll|rr|tt|bb|tl|tr|bl|br)([df]?)([\d]+)(\.[\d]+)?/ig;
          var matches = commandString.match(re);
          var result = [];
          _.each(matches, function(m){
            re.lastIndex = 0;
            var r = re.exec(m);
            var command = {};
            command.cf = r[2].toLowerCase();
            if (['tt', 'bb', 'll', 'rr'].indexOf(r[1]) !== -1) {
              command.cf = 'c'; //crush fold
              command.direction = r[1].substr(0,1);
            }else{
              command.direction = r[1];
            }

            if (r[4]){
              command.girth = r[4].substr(1) * 1;
              command.angle = r[3] * 1;
            }else{
              command.angle = 0;
              command.girth = command.girthText = r[3];
            }

            if (command.cf === 'f') {
              command.angle = 165;
              command.angleText = 'F';
            }

            if (command.cf === 'd') {
              command.angle = 45;
              command.girthTextSuffix = ' D/E';
            }
            result.push(command);
          });
          return result;
        }

        function _clearAll(){
          canvas.clear().renderAll();
          points = [];
          angles = [];
          deltaAngles = [];
          commands = [];
          fabricObjs = [];
          body = {};
        }

        function _initEvents(){
          //TODO: define mouse drag event for drawing arrow  
        }
        
        function _draw(){
          var tmpPoints = _.clone(points).reverse();
          _.each(commands, function(c, index){
            var p1 = _convert(tmpPoints[index]);
            var p2 = _convert(tmpPoints[index+1]);
            var girthText = ((c.girthText * 1) || c.girth.toFixed(0)).toString() + (c.girthTextSuffix?c.girthTextSuffix:'');
            
            //draw folds
            switch (c.cf) {
              case 'c':
                _drawCrushFold(p1, angles[index-1], girthText);
                break;
              case 'd':
              case 'f':
              default:
                //draw lines
                canvas.add(_createFabricLine(p1, p2));
                _drawGirthTextObj(p1, p2, girthText);
                //draw angle
                _drawAngle(p1, deltaAngles[index], angles[index], c);
            }
          });
        }

        function _drawGirthTextObj(p1, p2, text) {
          var gTextObj = _drawGirthText(p1, p2, text, 1);
          if (!_checkIfInside(gTextObj, fabricObjs)){
            canvas.remove(gTextObj);
            gTextObj = _drawGirthText(p1, p2, text, -1);
          }
          fabricObjs.push(gTextObj);
        }

        function _drawGirthText(startPoint, endPoint, text, dir){
          dir = dir || 1;
          var centerPoint = {
            x: (endPoint.x - startPoint.x)/2 + startPoint.x,
            y: (endPoint.y - startPoint.y)/2 + startPoint.y
          };
          var angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) + PI/2*dir;
          var txtObj = new fabric.Text(text, {
            fontSize: 14,
            textAlign: 'center',
            left: centerPoint.x + Math.cos(angle)*_convert(maxSize / 15),
            top: centerPoint.y + Math.sin(angle)*_convert(maxSize / 15),
            originX: 'center',
            originY: 'center',
            selectable: false,
          });
          canvas.add(txtObj);
          canvas.bringToFront(txtObj);
          return txtObj;
        }

        function _checkIfInside(obj, objList){
          var p1 = new fabric.Point(0, 0);
          var p2 = new fabric.Point(canvas.width, canvas.height);

          if (!obj.isContainedWithinRect(p1, p2)) {
            return false;
          }

          if (_.isArray(objList)){
            return _.every(objList, function(o){
              return !obj.intersectsWithObject(o);
            });
          }

          return true;
        }

        function _drawAngle(centerPoint, deltaAngle, angle, command){
          var text = command.angleText || (command.angle);

          // not draw 90 degree
          if (!text || text * 1 === 90 || command.girthTextSuffix){
            return;
          }

          if (!command.angleText) {
            text += '°';
          }

          if (text){
            _drawAngleText(centerPoint, (angle-deltaAngle)/2 + deltaAngle, text, true);
          }

          if (command.angleText) {
            return;
          }

          if (angle.toFixed(3) < 0){
            angle += 2*PI;
          }
          if (deltaAngle.toFixed(3) < 0){
            deltaAngle += 2*PI;
          }
          if (angle - deltaAngle > PI || angle-deltaAngle < 0){

            var tmp = deltaAngle;
            deltaAngle = angle;
            angle = tmp;
          }

          var arc = new fabric.Circle({
            radius: _convert(maxSize / 20),
            left: centerPoint.x,
            top: centerPoint.y,
            startAngle: deltaAngle,
            endAngle: angle,
            stroke: '#000',
            strokeWidth: 1,
            originX: 'center',
            originY: 'center',
            selectable: false,
            fill: ''
          });
          canvas.add(arc);
        }

        function _drawAngleText(centerPoint, avgAngle, text, small){
          var radius =  _convert(maxSize / 10);
          if (small) {
            radius =  _convert(maxSize / 20);
          }
          var txtObj = new fabric.Text(text, {
            fontSize: 12,
            textAlign: 'center',
            selectable: false,
            left: centerPoint.x + Math.cos(avgAngle) * radius,
            top: centerPoint.y + Math.sin(avgAngle) * radius,
            originX: 'center',
            originY: 'center'
          });
          canvas.add(txtObj);
          canvas.bringToFront(txtObj);
        }

        function _convert(point) {
          if (_.isObject(point)){
            return {
              x: parseInt((point.x + offset.x + margin/2) / (maxSize+margin) * absoluteSize),
              y: parseInt((point.y + offset.y + margin/2) / (maxSize+margin) * absoluteSize)
            };
          }else {
            return parseInt((point) / (maxSize+margin) * absoluteSize);
          }
        }

        function _checkMinGirth(){
          return _.every(commands, function(c, index){
            var flag = (c.girth >= maxSize / 10);
            commands[index].girth = _.max([maxSize / 10, c.girth]);
            return flag;
          });
        }

        function _getCanvasSize(){
          var xMax = _.chain(points)
            .pluck('x')
            .max()
            .value();
          var yMax = _.chain(points)
            .pluck('y')
            .max()
            .value();
          var xMin = _.chain(points)
            .pluck('x')
            .min()
            .value();
          var yMin = _.chain(points)
            .pluck('y')
            .min()
            .value();

          canvasSize = {
            x: xMax - xMin,
            y: yMax - yMin
          };

          maxSize = _.max([canvasSize.x, canvasSize.y]);

          offset = {
            x: xMin<0 ? -xMin : 0,
            y: yMin<0 ? -yMin : 0
          };

          if (maxSize > canvasSize.x) {
            offset.x += (maxSize - canvasSize.x)/2;
          }

          if (maxSize > canvasSize.y) {
            offset.y += (maxSize - canvasSize.y)/2;
          }

          margin = maxSize/10;
          return canvasSize;
        }

        function _getPointsArray(){
          points = [{x: 0, y: 0}];
          _.each(commands, function(c){
            var result = _getPointAndAngle(c);
            points.unshift(result.point);
            angles.push(result.angle);
            deltaAngles.push(result.deltaAngle);
          });
        }

        function _getPointAndAngle(command){
          var startPoint, endPoint, angle;
          var deltaAngle = 0,
            deltaX = 0,
            deltaY = 0;
          if (points.length>1){
            deltaX = points[1].x - points[0].x;
            deltaY = points[1].y - points[0].y;
            if (deltaX){
              deltaAngle = Math.atan2((deltaY), (deltaX));
            }
          }

          if (command.angle>0){
            angle = command.angle;
          }else{
            angle = _lineDirections[command.direction];
            deltaAngle = 0;
          }

          startPoint = points[0];
          var endPoint1 = {
            x: Math.cos(-PI*angle/180 + deltaAngle) * (command.girth) + startPoint.x,
            y: Math.sin(-PI*angle/180 + deltaAngle) * (command.girth) + startPoint.y
          };

          var endPoint2 = {
            x: Math.cos(PI*angle/180 + deltaAngle) * (command.girth) + startPoint.x,
            y: Math.sin(PI*angle/180 + deltaAngle) * (command.girth) + startPoint.y
          };

          var flag = true;

          if (_hasDirection(command.direction, 'l') && (endPoint1.x - startPoint.x>0)){
            flag = false;
          }

          if (_hasDirection(command.direction, 'r') && (endPoint1.x - startPoint.x<0)){
            flag = false;
          }

          if (_hasDirection(command.direction, 't') && (endPoint1.y - startPoint.y>0)){
            flag = false;
          }

          if (_hasDirection(command.direction, 'b') && (endPoint1.y - startPoint.y<0)){
            flag = false;
          }

          var resultAngle = flag?(-PI*angle/180 + deltaAngle):(PI*angle/180 + deltaAngle);

          return {
            point: flag?endPoint1:endPoint2,
            angle: resultAngle,
            deltaAngle: deltaAngle
          };
        }

        function _hasDirection(direction, d){
          return direction.indexOf(d) !== -1;
        }

        function _createFabricLine(startPoint, endPoint){
          return new fabric.Line([startPoint.x, startPoint.y, endPoint.x, endPoint.y], {
            fill: '#000',
            strokeWidth: 1,
            stroke: '#000',
            selectable: false
          });
        }

        function _drawCrushFold(startPoint, angle, girth){
          var dAngle = PI/2;
          var endPoint = {
            x: Math.cos(angle + dAngle) * _convert(maxSize/20) + startPoint.x,
            y: Math.sin(angle + dAngle) * _convert(maxSize/20) + startPoint.y
          };
          canvas.add(_createFabricLine(startPoint, endPoint));

          startPoint = endPoint;
          endPoint = {
            x: Math.cos(angle + dAngle*2) * _convert(girth) + startPoint.x,
            y: Math.sin(angle + dAngle*2) * _convert(girth) + startPoint.y
          };
          canvas.add(_createFabricLine(startPoint, endPoint));

          _drawGirthTextObj(startPoint, endPoint, girth + ' C/F');
        }
        // end
      }
    };
  }
]);
