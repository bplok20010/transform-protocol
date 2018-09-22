
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = query;
exports.find = find;

var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));

var _mysql = _interopRequireDefault(require("mysql"));

var _config = require("../config");

let pool;
pool = _mysql.default.createPool({
  connectionLimit: 10,
  port: _config.DB_PORT,
  host: _config.DB_HOST,
  user: _config.DB_USER,
  password: _config.DB_PWD,
  database: _config.DB_DATABASE
});

async function query(sql, params = []) {
  return new _promise.default((resolve, reject) => {
    pool.query(sql, params, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
}

async function find(sql, params) {
  const results = await query(sql, params);
  return results[0];
}