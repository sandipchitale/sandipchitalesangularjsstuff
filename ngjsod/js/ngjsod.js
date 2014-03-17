(function() {
    angular.module('NGJSOD', [])
    .directive('ngJsod', function() {
        function drawGraph(svg, gr, objectName) {
            var value = eval(objectName);
            var x = 40;
            var y = 40;
            drawJavascriptObject(svg, gr, objectName, value, x, y);
            value = value.constructor.prototype.__proto__;
            x += 1200;
            y += 96;
            while (value) {
                drawJavascriptObject(svg, gr, '{}', value, x, y);
                value = value.constructor.prototype.__proto__;
                x += 1200;
                y += 96;
            }
        }

        function drawJavascriptObject(svg, gr, label, value, ox, oy) {
            // Simple jQuery SVG Text examples
            var boxHeight = 24;
            var boxWidth = 320;
            var g = svg.group(gr, 'g', {fontFamily: 'Courier', fontSize: '12'});

            var x = ox;
            var y = oy;
            svg.line(g, x-(boxWidth/4), y+12, x, y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black', strokeWidth: '1'});
            if (angular.isArray(value)) {
                svg.text(g, x+5, y+16, '[]', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            } else if (angular.isFunction(value)) {
                svg.text(g, x+5, y+16, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            } else {
                svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            }
            svg.text(g, x+20, y+16, (value.constructor && value.constructor.name) + ' ' +label, {fill: 'black'});
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray', fill: 'ivory'});
            svg.text(g, x+5, y+16, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            svg.text(g, x+20, y+16, (value.constructor.name || '') + ' constructor', {fill: 'lightGray'});
            var cfr = svg.line(g, x+boxWidth, y+12, x+(3*boxWidth), y+12,  {stroke: 'lightGray', markerEnd: 'url(#arrow)'});
            svg.title(cfr, 'Inherited constructor property - reference to Constructor function.');

            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black'});
            svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});
            var pr = svg.line(g, x+boxWidth, y+12, x+(boxWidth+(boxWidth/4)), y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});
            svg.title(pr, 'Hidden reference to prototype object.');

            var props = [];
            var tooltip;
            for(var prop in value) {
                if (!value.hasOwnProperty(prop)) {
                    continue;
                }
                var propValue = value[prop];
                if (propValue === null) {
                    props.push(prop + ' : nullN');
                } else if (angular.isFunction(propValue)) {
                    continue;
                } else if (angular.isArray(propValue)) {
                    props.push((propValue.constructor && propValue.constructor.name) + ' ' + prop + '[ ]A');
                } else if (angular.isString(propValue)) {
                    props.push(prop + ' : \'' + propValue.substring(0,36) + '\'S');
                } else if (angular.isObject(propValue)) {
                    props.push((propValue.constructor && propValue.constructor.name) + ' ' + prop + 'O');
                } else if (angular.isNumber(propValue)) {
                    props.push(prop + ' : ' + propValue + '#');
                } else {
                    props.push(prop + ' : ' + propValue + (typeof propValue === 'boolean' ? 'B' : '-'));
                }
            }
            props.sort();

            var funcs = [];
            for(var prop in value) {
                if (!value.hasOwnProperty(prop)) {
                    continue;
                }
                var propValue = value[prop];
                if (angular.isFunction(propValue)) {
                    funcs.push(prop + '()F');
                }
            }
            funcs.sort();

            props = props.concat(funcs);

            for(var i = 0; i < props.length; i++) {
                y += boxHeight;
                var text = props[i];
                var type = text.substring(text.length - 1);
                text = text.substring(0, text.length - 1);
                tooltip = text;
                if (type === 'F' || type == 'O' || type === 'A' || type === 'N') {
                } else {
                    text = text.substring(0, text.indexOf(' : '));
                }
                var rect = svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black', strokeWidth: '1'});
                svg.title(rect, tooltip);
                svg.text(g, x+20, y+16, text, {fill: 'black'});

                if (type === 'A') {
                    svg.text(g, x+5, y+15, '[]', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === 'O') {
                    svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === 'S') {
                    svg.text(g, x+5, y+15, '\'\'', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === 'F') {
                    svg.text(g, x+5, y+15, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === 'B') {
                    svg.text(g, x+4, y+15, '0|1', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === '#') {
                    svg.text(g, x+7, y+15, '#', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === '-') {
                    svg.text(g, x+6, y+15, '-', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === 'N') {
                }
            }

            var x = ox+boxWidth+boxWidth/4;
            var y = oy + 2*boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray', strokeWidth: '1'});
            svg.text(g, x+6, y+15, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            svg.text(g, x+20, y+16, (value.__proto__ && value.__proto__.__proto__ && value.__proto__.__proto__.constructor.name) + ' {}', {fill: 'black'});
            var c2pr = svg.line(g, x+(boxWidth+(boxWidth/4)), y+12, x+boxWidth, y+12, {stroke: 'black', markerEnd: 'url(#arrow)'});
            svg.title(c2pr, 'Reference to prototype object from Constructor function.');

            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray'});
            svg.text(g, x+5, y+15, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            svg.text(g, x+20, y+16, 'constructor', {fill: 'black'});
            var p2cr = svg.line(g, x+boxWidth, y+12, x+(boxWidth+(boxWidth/8)), y+12,  {stroke: 'black'});
            svg.title(p2cr, 'Reference to Constructor function.');
            p2cr = svg.line(g, x+(boxWidth+(boxWidth/8)), y+12, x+(boxWidth+(boxWidth/8)), y-(boxHeight+(boxHeight/2)),  {stroke: 'black'});
            svg.title(p2cr, 'Reference to Constructor function.');
            p2cr = svg.line(g, x+(boxWidth+(boxWidth/8)), y-(boxHeight+(boxHeight/2)), x+(boxWidth+(boxWidth/4)), y-(boxHeight+(boxHeight/2)), {stroke: 'black', markerEnd: 'url(#arrow)'});
            svg.title(p2cr, 'Reference to Constructor function.');
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray'});
            svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});
            if (value.__proto__) {
                var ppr = svg.line(g, x+boxWidth, y+12, x+(boxWidth*2.25), y+12,  {stroke: 'black'});
                svg.title(ppr, 'Hidden reference to prototype object.');
            }

            var props = [];
            var value__proto__ = value.__proto__;
            for(var prop in value__proto__) {
                if (!value__proto__.hasOwnProperty(prop)) {
                    continue;
                }
                var propValue = value__proto__[prop];
                if (propValue === null) {
                    props.push(prop + ' : nullN');
                } else if (angular.isFunction(propValue)) {
                    continue;
                } else if (angular.isArray(propValue)) {
                    props.push((propValue.constructor && propValue.constructor.name) + ' ' + prop + '[ ]A');
                } else if (angular.isString(propValue)) {
                    props.push(prop + ' : \'' + propValue.substring(0,36) + '\'S');
                } else if (angular.isObject(propValue)) {
                    props.push((propValue.constructor && propValue.constructor.name) + ' ' + prop + 'O');
                } else if (angular.isNumber(propValue)) {
                    props.push(prop + ' : ' + propValue + '#');
                } else {
                    props.push(prop + ' : ' + propValue + (typeof propValue === 'boolean' ? 'B' : '-'));
                }
            }
            props.sort();

            var funcs = [];
            for(var prop in value__proto__) {
                if (!value__proto__.hasOwnProperty(prop)) {
                    continue;
                }
                var propValue = value__proto__[prop];
                if (angular.isFunction(propValue)) {
                    funcs.push(prop + '()F');
                }
            }
            funcs.sort();

            props = props.concat(funcs);

            for(var i = 0; i < props.length; i++) {
                y += boxHeight;
                var text = props[i];
                var type = text.substring(text.length - 1);
                text = text.substring(0, text.length - 1);
                tooltip = text;
                if (type === 'F' || type == 'O' || type === 'A' || type === 'N') {
                } else {
                    text = text.substring(0, text.indexOf(' : '));
                }
                var rect = svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black', strokeWidth: '1'});
                svg.title(rect, tooltip);
                svg.text(g, x+20, y+16, text, {fill: 'black'});

                if (type === 'A') {
                    svg.text(g, x+5, y+15, '[]', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === 'O') {
                    svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === 'S') {
                    svg.text(g, x+5, y+15, '\'\'', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === 'F') {
                    svg.text(g, x+5, y+15, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === 'B') {
                    svg.text(g, x+4, y+15, '0|1', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === '#') {
                    svg.text(g, x+7, y+15, '#', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === '-') {
                    svg.text(g, x+6, y+15, '-', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
                } else if (type === 'N') {
                }
            }

            // Constructor function
            var x = ox+boxWidth+boxWidth/4+boxWidth+boxWidth/4;
            var y = oy;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
            svg.text(g, x+20, y+16, 'constructor', {fill: 'lightGray'});
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
            svg.text(g, x+5, y+16, 'fx', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            svg.text(g, x+20, y+16, 'function ' + (value.constructor.name || ''), {fill: 'black'});
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
            svg.text(g, x+20, y+16, 'prototype', {fill: 'black'});
            svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
            svg.text(g, x+7, y+16, 'o', {fill: 'black', fontSize: '9', fontWeight: 'bold'});
            svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});

        }

        var toolbar = angular.element('<div style="display:block; text-align: center;"></div>');
        var zoomOutButton = angular.element('<button style="vertical-align: middle;">&#xFF0D;</button>');
        var zoomRange = angular.element('<input style="vertical-align: middle;"type="range" min="-3" max="3"/>');
        var zoomInButton = angular.element('<button style="vertical-align: middle;">&#xff0b;</button>');
        toolbar.append(zoomOutButton);
        toolbar.append(zoomRange);
        toolbar.append(zoomInButton);

        var svgContainer = angular.element('<div></div>');
        return {
            restrict : 'AE',
            scope: {
                objectName: '@'
            },
            template : '<div style="border: 1px solid gray; overflow: auto; text-align: center;"></div>',
            replace : true,
            link : function(scope, elem) {
                elem.append(toolbar);
                elem.append(svgContainer);
                svgContainer.svg(function(svg) {
                    var zoomPercents = [0.25, 0.50, 0.75, 1.00, 1.25, 1.5, 2.00];
                    var zoom = function(level) {
                        level = parseInt(level);
                        var root = svg.root();
                        $(root.childNodes[1]).animate({svgTransform:'scale(' + (zoomPercents[level+3]) + ')'}, 500);
                    }

                    var zoomIn = function() {
                        var zoomedAt = zoomRange[0].value;
                        zoomedAt = Math.min(zoomedAt, 3);
                        zoomedAt = Math.max(zoomedAt, -3);
                        zoomedAt++;
                        zoomedAt = Math.min(zoomedAt, 3);
                        zoomedAt = Math.max(zoomedAt, -3);
                        zoomRange[0].value = zoomedAt;
                        zoom(zoomRange[0].value);
                    }

                    var zoomTo = function() {
                        zoom(zoomRange[0].value);
                    }

                    var zoomOut = function() {
                        var zoomedAt = zoomRange[0].value;
                        zoomedAt = Math.min(zoomedAt, 3);
                        zoomedAt = Math.max(zoomedAt, -3);
                        zoomedAt--;
                        zoomedAt = Math.min(zoomedAt, 3);
                        zoomedAt = Math.max(zoomedAt, -3);
                        zoomRange[0].value = zoomedAt;
                        zoom(zoomRange[0].value);
                    }

                    zoomInButton.on('click', zoomIn);
                    zoomRange.on('change', zoomTo);
                    zoomOutButton.on('click', zoomOut);


                    var defs = svg.defs(null, "jsoddefs")
                    var arrow = svg.marker(defs, 'arrow', 9, 6, 13, 13);
                    var arrowHead = svg.createPath();
                    svg.path(arrow, arrowHead.move(2,2).line(2,11).
                        line(10, 6).line(2,2).close(), {fill: '#000000'});
                    var g = svg.group(
                        {fontFamily: 'Courier', fontSize: '12'}
                    )
                    drawGraph(svg, g, scope.objectName);
                    scope.$watch('objectName', function() {
                        $(g).empty();
                        try {
                            if (eval(scope.objectName)) {
                                drawGraph(svg, g, scope.objectName);
                            }
                        } catch (e) {
                        }
                    });
                });
            }
        };
    });

})();