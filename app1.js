const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieSession = require('cookie-session');

const STATIC_PATH = path.resolve(__dirname, '');
const app = express();
const cache = {
	userList: [
		{username: 'aaa', password: '111'},
		{username: 'bbb', password: '222'},
		{username: 'ccc', password: '333'},
	]
};

app.set('views', path.join(__dirname, 'views1'))
app.set('view engine', 'ejs');

app.use(express.static(STATIC_PATH));

app.use(cookieSession({
	name: 'session',
	keys: ['secret_test'],
	secret: true,
	maxAge: 24 * 60 * 60 * 1000,
	overwrite: true
}));


app.use(/\/$/, function(req, res) {
	res.render('index.ejs');
});

app.use('/login', function (req, res) {

	res.render('login.ejs', {
		userList: cache.userList
	})
});

app.use('/views1/xssFromBackendTag', function(req, res) {
	const content = req.query.content;
	
	res.set('X-XSS-Protection', '1');
	
	res.render('xssFromBackendTag.ejs', {
		content: content
	})
});

app.use('/views1/xssFromBackendAttr', function(req, res) {
	const content = req.query.content;
	
	res.set('X-XSS-Protection', '1');
	
	res.render('xssFromBackendAttr.ejs', {
		content: content
	});
});

app.use('/views1/xssFromBackendScript', function(req, res) {
	const content = req.query.content;
	
	res.render('xssFromBackendScript.ejs', {
		content: content
	})
});

app.use('/toLogin', bodyParser.urlencoded(), function (req, res) {
	const userList = cache.userList;
	const body = req.body;
	const currentUser = {};

	userList.forEach(item => {
		if (item.username === body.username && item.password === body.password) {
			currentUser.username = item.username;
			currentUser.password = item.password;

			return false;
		}
	});

	if (currentUser.username === undefined) {
		return res.status(404).send('<p>账号密码错误，请<a href="/">重新输入</a>!</p>')
	}

	const token = Math.random();

	userList.forEach(item => {
		if (item.username === body.username) {
			currentUser.onlineStatus = 'online';
			currentUser.token = token;
			res.status(200).send('ok!')
			return false;
		}
	});
});

// app.use('/valid', bodyParser.json(), function (req, res) {
// 	const reqToken = req.token;
// 	let currentUser = {};
// 	cache.userList.forEach(item => {
// 		if (item.token === reqToken) {
// 			currentUser = item;
// 		}
// 	});
//
// 	if (currentUser.username === undefined) {
// 		res.json({flag: 2})
// 	} else {
// 		res.json({flag: 1})
// 	}
// });

app.listen(9000, function () {
	console.log('第一个服务器：localhost:9000');
});