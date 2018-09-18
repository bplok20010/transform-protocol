
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/typeof"));

var _xml2js = _interopRequireDefault(require("xml2js"));

var _compileTemplate = _interopRequireDefault(require("./compileTemplate"));

var _fs = require("fs");

var vm = require('vm');

function isObject(val) {
  return val != null && (0, _typeof2.default)(val) === 'object' && (0, _isArray.default)(val) === false;
}

;

function data2string() {}

function object2xml() {}

function createSandbox(data) {
  var target = {
    Array: Array,
    xml: function xml() {},
    json: function json(v) {
      return (0, _stringify.default)(v);
    },
    $data: data
  };
  target.$self = target;
  var handler = {
    get: function get(target, name) {
      if (isObject(data) && name in data) {
        return data[name];
      }

      return target[name];
    },
    set: function set(target, name, value) {
      if (isObject(data) && name in data) {
        data[name] = value;
      } else {
        target[name] = value;
      }
    }
  };
  return new Proxy(target, handler);
}

function _default(template, data) {
  var sandbox = createSandbox(data);
  var context = new vm.createContext(sandbox);
  var code = (0, _compileTemplate.default)(template);
  var script = new vm.Script(code);
  script.runInContext(context);
  console.log(context.__p);
}