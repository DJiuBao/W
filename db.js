var settings = require('./settings');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var Connection = require('mongodb').Connection;

module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT,{/*auto_reconnect:true*/}), {safe:true});