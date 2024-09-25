
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['fontkit'], factory);
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports = factory(require('fontkit'));
    } else {
        // Browser globals
        root.fontkit = factory(root.fontkit);
    }
}(this, function (fontkit) {
    // Your fontkit code here
    return fontkit;
}));
