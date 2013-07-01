
/**
 * Module dependencies.
 */

var express = require('express')
  , partials = require('express-partials')
  , routes = require('./routes/router')
  , handlers = require('./routes/requesthandler')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var settings = require('./settings');
var app = express();

app.configure(function(){
		app.set('port', process.env.VMC_APP_PORT || 8888);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'ejs');
		app.use(partials());
		app.use(flash());
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({
				secret: settings.cookieSecret,
				store: new MongoStore({
						db: settings.db
				})
		}));
		app.use(function (req, res, next) {
				res.locals.csrf = req.session ? req.session._csrf : '';
				res.locals.user = req.session.user;
				//res.locals.success = req.flash("success");
				var succ = req.flash("success");
				if (succ.length){
					res.locals.success = succ;
				}else{
					res.locals.success = null;
				};
				//res.locals.error = req.flash("error");
				var err = req.flash("error");
				if (err.length){
					res.locals.error = err;
				}else{
					res.locals.error = null;
				};
				next();
		});
		//	app.use(routes(app));
		routes(app, handlers, user);
		app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});


//server
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});