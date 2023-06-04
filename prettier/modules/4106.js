Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.enable = exports.tedious = exports.pgPool = exports.pg = exports.winston = exports.redis = exports.mysql = exports.mongodb = exports.mongodbCore = exports.console = exports.bunyan = exports.azuresdk = void 0;
var azuresdk = require(38604);
exports.azuresdk = azuresdk;
var bunyan = require(58859);
exports.bunyan = bunyan;
var console = require(92495);
exports.console = console;
var mongodbCore = require(72028);
exports.mongodbCore = mongodbCore;
var mongodb = require(88436);
exports.mongodb = mongodb;
var mysql = require(98002);
exports.mysql = mysql;
var pgPool = require(89024);
exports.pgPool = pgPool;
var pg = require(48060);
exports.pg = pg;
var redis = require(14487);
exports.redis = redis;
var tedious = require(66661);
exports.tedious = tedious;
var winston = require(14650);
exports.winston = winston;
exports.enable = function () {
  bunyan.enable();
  console.enable();
  mongodbCore.enable();
  mongodb.enable();
  mysql.enable();
  pg.enable();
  pgPool.enable();
  redis.enable();
  winston.enable();
  azuresdk.enable();
  tedious.enable();
};