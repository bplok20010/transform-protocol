
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var _express = _interopRequireDefault(require("express"));

var _xml2js = require("xml2js");

var _transformProtocolTemplate = _interopRequireDefault(require("transform-protocol-template"));

var _logger = _interopRequireDefault(require("./utils/logger"));

var _db = require("./db");

function fail(status = 1, message = 'fail') {
  return (0, _stringify.default)({
    status,
    message,
    data: null
  });
}

function success(data) {
  return (0, _stringify.default)({
    status: 0,
    message: 'success',
    data
  });
}

function parseData(data, type) {
  if (type === 'json') {
    return JSON.parse(data);
  } else if (type === 'xml') {
    let result;
    (0, _xml2js.parseString)(data, function (err, ret) {
      if (err) throw err;
      result = ret;
    });
    return result;
  } else {
    return data;
  }
}

module.exports = function (port) {
  const app = (0, _express.default)();
  app.use(function (req, res, next) {
    var reqData = [];
    var size = 0;
    req.on('data', function (data) {
      reqData.push(data);
      size += data.length;
    });
    req.on('end', function () {
      req.rawBody = Buffer.concat(reqData, size) + '';
      next();
    });
  });
  app.post('/:tid', async function (req, res) {
    (0, _logger.default)(`${req.method} ${req.path}`);
    (0, _logger.default)(req.rawBody.slice(0, 520));
    const {
      tid
    } = req.params;
    let info;

    try {
      info = await (0, _db.find)('select * from tp_template where id=?', [tid]);
    } catch (e) {
      (0, _logger.default)(e);
      res.send(fail(5001));
      return;
    }

    if (!info) {
      (0, _logger.default)(`目标[${tid}]不存在`);
      res.send(fail(1001, '目标不存在'));
      return;
    }

    if (!info.template) {
      (0, _logger.default)(`目标[${tid}]模版内容不存在`);
      res.send(fail(1002, '模版内容为空'));
      return;
    }

    let data;

    try {
      data = parseData(req.rawBody, info.data_type || 'json');
    } catch (e) {
      (0, _logger.default)(e);
      res.send(fail(1003, '转换数据不符合规范'));
      return;
    }

    try {
      res.send(success((0, _transformProtocolTemplate.default)(info.template, data)));
    } catch (e) {
      (0, _logger.default)(e);
      res.send(fail(1004, '协议转换失败'));
      return;
    }
  });
  app.listen(port, err => {
    (0, _logger.default)('服务启动成功端口：' + port);
  });
};