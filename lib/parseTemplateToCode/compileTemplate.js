
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
var noMatch = /(.)^/;
var escapes = {
  "'": "'",
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  "\u2028": 'u2028',
  "\u2029": 'u2029'
};

var escapeChar = function escapeChar(match) {
  return '\\' + escapes[match];
};

var templateSettings = {
  evaluate: /<[?%]([\s\S]+?)[?%]>/g,
  interpolate: /<[?%]=([\s\S]+?)[?%]>/g,
  escape: /<[?%]([a-zA-Z_0-9]*?)[!-]([\s\S]+?)[?%]>/g
}; // var __t, __p = '',
// 	__j = Array.prototype.join,
// 	print = function() {
// 		__p += __j.call(arguments, '');
// 	};
// __p += '\n{\n    status: "' + ((__t = (code)) == null ? '' : __t) + '",\n    data: ';
// json!data
// __p += '\n}\n';

function template(text, settings) {
  settings = (0, _assign.default)({}, settings, templateSettings); // Combine delimiters into one regular expression via alternation.

  var matcher = RegExp([settings.escape.source, settings.interpolate.source, settings.evaluate.source].join('|') + '|$', 'g');
  console.log([settings.escape.source, settings.interpolate.source, settings.evaluate.source].join('|') + '|$'); // Compile the template source, escaping string literals appropriately.

  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function (match, executor, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;

    if (escape) {
      source += "\";\nvar executor = '".concat(executor, "' || 'json';\nif (!$self[executor]) executor = 'json';\n__t = ").concat(escape, " === undefined ? '' : ").concat(escape, ";\n__p += __t;__p+=\"");
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    } // Adobe VMs need the match returned to produce the correct offset.


    return match;
  });
  source += "';\n"; // If a variable is not specified, place data values in local scope.
  //if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

  source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source;
  return source;
}

var _default = template;
exports.default = _default;