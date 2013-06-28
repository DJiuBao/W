
/*
 * HANDLE the request routed by ROUTER.
 */

var crypto = require('crypto');
var User = require('./user');
var IsEmail = require('./isemail');
var Post = require('./post');

var querystring = require("querystring");
var url = require("url");
var mysql = require("mysql");

exports.index = function(req, res){
	res.render('index', {
		title: 'Express',
		//posts: posts,
		user: req.session.user,
		success: res.locals.success,
		error: res.locals.error,
		layout: 'template'
	});
};

exports.home = function(req, res){
	res.render('home', {
		title: 'Jack WTraveller Bootstrap Demo',
		user: req.session.user,
		success: res.locals.success,
		error: res.locals.error,
		navbar: 'home',
		layout: 'wtraveller'
	});

};

exports.about = function(req, res){
	res.render('about', {
		title: 'About us',
		user: req.session.user,
		navbar: 'about',
		layout: 'wtraveller'
	});
};

exports.msgBoard = function(req, res){
	Post.get(null, function(err, posts){
		if (err) {
			posts = [];
		}
		res.render('msgboard', {
			title: 'Message board',
			user: req.session.user,
			success: res.locals.success,
			error: res.locals.error,
			navbar: 'msgboard',
			posts: posts,
			layout: 'wtraveller'
		});
	});
};

exports.userPage = function(req, res){
	User.get(req.params.user, function(err,user){
		if (!user) {
			req.flash('error','用户不存在');
			return res.redirect('/msgboard');
		}
		Post.get(user.name, function(err, posts){
			if (err) {
				posts = [];
			}
			res.render('msgboard', {
				title: 'Message board',
				user: req.session.user,
				success: res.locals.success,
				error: res.locals.error,
				navbar: '',
				posts: posts,
				layout: 'wtraveller'
			});
		});
	});
};

exports.digihealth = function(req, res){
	var querystr = querystring.parse(url.parse(req.url).query);
	console.log (querystr);
	var _DATABASE='digital_health'
	var _TABLE='patient_log'
	var client = mysql.createClient({
		password: 'fdxjt403',
	});
	
	client.query('USE '+_DATABASE);
	client.query(
		'INSERT INTO '+_TABLE+' '+
		'SET nurse = ?, patient = ?, temperature = ?, pulse = ?, blood_pressure = ?, breath = ?, SO2 = ?, created = ?',
		[querystr["nurse"], querystr["patient"], querystr["content"].split(",")[0], querystr["content"].split(",")[1], querystr["content"].split(",")[2], querystr["content"].split(",")[3], querystr["content"].split(",")[4], '2012-09-10 12:42:15']
	);
	client.end();
	res.writeHead(200,{"Content-Type":"text/plain"});
	res.write("\r\n" + "护士: " + querystr["nurse"]); 
	res.write("\r\n" + "病人: " + querystr["patient"]); 
	res.write("\r\n" + "体温: " + querystr["content"].split(",")[0]);
	res.write("\r\n" + "脉搏: " + querystr["content"].split(",")[1]); 
	res.write("\r\n" + "血压: " + querystr["content"].split(",")[2]);
	res.write("\r\n" + "呼吸频率: " + querystr["content"].split(",")[3]);
	res.write("\r\n" + "血氧饱和度: " + querystr["content"].split(",")[4]);
	res.end();
};

exports.gpsupload = function(req, res){
	var querystr = querystring.parse(url.parse(req.url).query);
	res.writeHead(200,{"Content-Type":"text/plain"});
	console.log(querystr);
	res.write("Your location:" );
	res.write("\r\n" + "latitude: " + querystr["content"].split(",")[0]); 
	res.write("\r\n" + "longitude: " + querystr["content"].split(",")[1]);
	res.write("\r\n" + "欢迎下次使用!")
	res.end();
};

exports.map = function(req, res){
	res.render('map', {
		title: 'Map',
		user: req.session.user,
		navbar: '',
		layout: false
	});
};

exports.proBar = function(req, res){
	res.render('processingbar', {
		title: 'Something',
		user: req.session.user,
		success: res.locals.success,
		error: res.locals.error,
		navbar: '',
		layout: 'wtraveller'
	});
};

exports.ofc = function(req, res){
	res.render('ofc', {
		title: 'Open Flash Chart',
		user: req.session.user,
		success: res.locals.success,
		error: res.locals.error,
		navbar: '',
		layout: 'wtraveller'
	});
};

exports.leaflet = function(req, res){
	res.render('leaflet', {
		title: 'Leaflet',
		user: req.session.user,
		success: res.locals.success,
		error: res.locals.error,
		navbar: '',
		layout: 'wtraveller'
	});
};

exports.post = function(req, res){
	var currentUser = req.session.user;
	var post = new Post(currentUser.name,req.body.post);
	post.save(function(err){
		if (err) {
			req.flash('error',err);
			return res.redirect('/');
		}
		req.flash('success','发表成功');
		res.redirect('msgboard');
	});
};

exports.reg = function(req, res){
	res.render('reg', {
		title: 'Sign up',
		//posts: posts,
		user: req.session.user,
		navbar: 'reg',
		error: res.locals.error,
		layout: 'wtraveller'
	});
};

exports.doReg = function(req, res){
	//检验注册用户名是否为邮箱
	if (!IsEmail(req.body.username)){
		req.flash('error','请输入正确的邮箱，完成注册');
		return res.redirect('reg');
	}
	//检验密码是否为空
	if (!req.body.password){
		req.flash('error','请输入密码');
		return res.redirect('reg');
	}
	//检验用户两次输入的密码是否一致
	if (req.body['password-repeat'] != req.body['password']){
		req.flash('error','两次输入的密码不一致');
		return res.redirect('reg');
	}
	//生成密码的散列值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	var newUser = new User({
		name: req.body.username,
		password: password,
	});
	//检查用户名是否已经存在
	User.get(newUser.name, function(err,user){
		if (user){
			err = '用户名已存在';
		}
		if (err){
			req.flash('error', err);
			return res.redirect('reg');
		}
		newUser.save(function(err){
			if (err){
				req.flash('error', err);
				return res.redirect('reg');
			}
			req.session.user = newUser;
			req.flash('success','恭喜您！已经注册成功^_^ ，Let\'s begin our WTraveller trip now！');
			res.redirect('/');
		});
	});
};

exports.login = function(req, res){
};

exports.doLogin = function(req, res){
	//生成密码的散列值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	User.get(req.body.username, function(err,user){
		if (!user){
			req.flash('error','用户名不存在');
			return res.redirect('/');
		}
		if (user.password != password){
			req.flash('error','密码不正确');
			return res.redirect('/');
		}
		req.session.user = user;
		req.flash('success','登录成功');
		res.redirect('/');
	});
};

exports.logout = function(req, res){
	req.session.user = null;
	req.flash('success','您已退出，欢迎您再次使用。');
	res.redirect('/');
};

exports.checkNotlogin = function(req, res, next){
	if (req.session.user){
		req.flash("error","已登录");
		return res.redirect('/');
	}
	next();
};

exports.checkLogin = function(req, res, next){
	if (!req.session.user){
		req.flash("error","未登录");
		return res.redirect('/');
	}
	next();
};
