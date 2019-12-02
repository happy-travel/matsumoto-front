'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (position, metric, axis) {
    if ("rtl" == window.localStorage.getItem('direction') && axis == 'horizontal')
        position = -position;

    var positionCss = axis === 'horizontal' ? [position + metric, 0, 0] : [0, position + metric, 0];

    var transitionProp = 'translate3d';

    var translatedPosition = '(' + positionCss.join(',') + ')';

    return transitionProp + translatedPosition;
};