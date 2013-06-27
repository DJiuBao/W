
/*
 * GET users listing.
 */

/*exports.list = function(req, res){
	res.send("respond with a resource");
};*/

var mongodb = require('../db');

function User(user){
	this.name = user.name;
	this.password = user.password;
};
module.exports = User;

User.prototype.save = function save(callback){
	//存入MongoDB的文档
	var user = {
		name: this.name,
		password: this.password,
	};
	mongodb.open(function(err,db){
		if (err){
			return callback(err);
		}
		//读取users集合
		db.collection('users',function(err,collection){
			if (err){
				mongodb.close();
				return callback(err);
			}
			//为name属性添加索引
			collection.ensureIndex({'name':1},{unique: true},function(){});
			/*
				Collection.prototype.ensureIndex = function ensureIndex (fieldOrSpec, options, callback) {
				  // Clean up call
				  if (typeof callback === 'undefined' && typeof options === 'function') {
				    callback = options;
				    options = {};
				  }
				
				  if (options == null) {
				    options = {};
				  }
				
				  // Execute create index
				  this.db.ensureIndex(this.collectionName, fieldOrSpec, options, callback);
				};
			*/
			//写入user文档
			collection.insert(user,{safe:true},function(err,user){
				mongodb.close();
				callback(err,user);
			});
		});
	});
};

User.get = function get(username,callback){
	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}
		//读取users集合
		db.collection('users',function(err,collection){
			if (err){
				mongodb.close();
				return callback(err);
			}
			//查找name属性为username的文档
			collection.findOne({name: username},function(err,doc){
				mongodb.close();
				if (doc){
					//封装文档为User对象
					var user = new User(doc);
					callback(err,user);
				}else{
					callback(err,null);
				}
			});
		});
	});
};