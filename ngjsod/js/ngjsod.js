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
            if (value) {
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
                svg.image(g, x+2, y+4, 16, 16, 'icons/array.png');
            } else if (angular.isFunction(value)) {
                svg.image(g, x+2, y+4, 16, 16, 'icons/function.png');
            } else {
                svg.image(g, x+2, y+4, 16, 16, 'icons/object.png');
            }
            svg.text(g, x+20, y+16, (value.constructor && value.constructor.name) + ' ' +label, {fill: 'black'});
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray', fill: 'ivory'});
            svg.text(g, x+20, y+16, (value.constructor.name || '') + ' constructor', {fill: 'lightGray'});
            svg.line(g, x+boxWidth, y+12, x+(3*boxWidth), y+12,  {stroke: 'lightGray', markerEnd: 'url(#arrow)'});
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black'});
            svg.image(g, x+2, y+4, 16, 16, 'icons/object.png');
            svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});
            svg.line(g, x+boxWidth, y+12, x+(boxWidth+(boxWidth/4)), y+12,  {stroke: 'black', markerEnd: 'url(#arrow)'});

            var props = [];
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
                if (type === 'F' || type == 'O' || type === 'A' || type === 'N') {
                    tooltip = text;
                } else {
                    tooltip = text.substring(text.indexOf(' : ')+2);
                    text = text.substring(0, text.indexOf(' : '));
                }
                var rect = svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black', strokeWidth: '1'});
                svg.title(rect, tooltip);
                svg.text(g, x+20, y+16, text, {fill: 'black'});

                if (type === 'A') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/array.png');
                } else if (type === 'O') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/object.png');
                } else if (type === 'S') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/string.png');
                } else if (type === 'F') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/function.png');
                } else if (type === 'B') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/boolean.png');
                } else if (type === '#') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/number.png');
                } else if (type === '-') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/property.png');
                } else if (type === 'N') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/null.png');
                }
            }

            var x = ox+boxWidth+boxWidth/4;
            var y = oy + 2*boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray', strokeWidth: '1'});
            svg.image(g, x+2, y+4, 16, 16, 'icons/object.png');
            svg.text(g, x+20, y+16, (value.__proto__ && value.__proto__.__proto__ && value.__proto__.__proto__.constructor.name) + ' {}', {fill: 'black'});
            svg.line(g, x+(boxWidth+(boxWidth/4)), y+12, x+boxWidth, y+12, {stroke: 'black', markerEnd: 'url(#arrow)'});
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray'});
            svg.image(g, x+2, y+4, 16, 16, 'icons/function.png');
            svg.text(g, x+20, y+16, 'constructor', {fill: 'black'});
            svg.line(g, x+boxWidth, y+12, x+(boxWidth+(boxWidth/8)), y+12,  {stroke: 'black'});
            svg.line(g, x+(boxWidth+(boxWidth/8)), y+12, x+(boxWidth+(boxWidth/8)), y-(boxHeight+(boxHeight/2)),  {stroke: 'black'});
            svg.line(g, x+(boxWidth+(boxWidth/8)), y-(boxHeight+(boxHeight/2)), x+(boxWidth+(boxWidth/4)), y-(boxHeight+(boxHeight/2)), {stroke: 'black', markerEnd: 'url(#arrow)'});
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'gray'});
            svg.image(g, x+2, y+4, 16, 16, 'icons/object.png');
            svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});
            if (value.__proto__) {
                svg.line(g, x+boxWidth, y+12, x+(boxWidth*2.25), y+12,  {stroke: 'black'});
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
                if (type === 'F' || type == 'O' || type === 'A' || type === 'N') {
                    tooltip = text;
                } else {
                    tooltip = text.substring(text.indexOf(' : ')+2);
                    text = text.substring(0, text.indexOf(' : '));
                }
                var rect = svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'black', strokeWidth: '1'});
                svg.title(rect, tooltip);
                svg.text(g, x+20, y+16, text, {fill: 'black'});

                if (type === 'A') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/array.png');
                } else if (type === 'O') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/object.png');
                } else if (type === 'S') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/string.png');
                } else if (type === 'F') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/function.png');
                } else if (type === 'B') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/boolean.png');
                } else if (type === '#') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/number.png');
                } else if (type === '-') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/property.png');
                } else if (type === 'N') {
                    svg.image(g, x+2, y+4, 16, 16, 'icons/null.png');
                }

            }

            // Constructor function
            var x = ox+boxWidth+boxWidth/4+boxWidth+boxWidth/4;
            var y = oy;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
            svg.text(g, x+20, y+16, 'constructor', {fill: 'lightGray'});
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
            svg.image(g, x+2, y+4, 16, 16, 'icons/function.png');
            svg.text(g, x+20, y+16, 'function ' + (value.constructor.name || ''), {fill: 'black'});
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
            svg.text(g, x+20, y+16, 'prototype', {fill: 'black'});
            svg.image(g, x+2, y+4, 16, 16, 'icons/object.png');
            y += boxHeight;
            svg.rect(g, x, y, boxWidth, boxHeight,  {fill: 'white', stroke: 'lightGray'});
            svg.image(g, x+2, y+4, 16, 16, 'icons/object.png');
            svg.text(g, x+20, y+16, '__proto__', {fill: 'black'});

        }
        return {
            restrict : 'AE',
            scope: {
                objectName: '@'
            },
            template : '<div style="border: 1px solid gray; overflow: auto;"></div>',
            replace : true,
            link : function(scope, elem) {
                elem.svg(function(svg) {
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