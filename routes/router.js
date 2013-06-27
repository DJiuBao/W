
/*
 * ROUTE the request to HANDLER.
 */

module.exports = function(app,handler,user){
	app.get('/index', handler.index);
	app.get('/', handler.home);
	app.post('/', handler.doLogin);
	app.get('/home', handler.home);
	app.post('/home', handler.doLogin);
	app.get('/about', handler.about);
	app.get('/contact', handler.contact);
	app.get('/msgboard', handler.msgBoard);
	app.get('/map', handler.map);
	app.get('/probar', handler.proBar);
	app.get('/GPS',handler.gpsupload);
	app.get('/ofc',handler.ofc);
	//---------------------------------------
	app.get('/digihealth',handler.digihealth);
	//---------------------------------------
	app.get('/u/:user', handler.userPage);
	//---------------------------------------
	app.post('/post', handler.checkLogin);
	app.post('/post', handler.post);
	//---------------------------------------
	app.get('/reg', handler.checkNotlogin);
	app.get('/reg', handler.reg);
	app.post('/reg', handler.checkNotlogin);
	app.post('/reg', handler.doReg);
	//---------------------------------------
	app.get('/login', handler.checkNotlogin);
	app.get('/login', handler.login);
	app.post('/login', handler.checkNotlogin);
	app.post('/login', handler.doLogin);
	//---------------------------------------
	app.get('/logout', handler.checkLogin);
	app.get('/logout', handler.logout);
};
