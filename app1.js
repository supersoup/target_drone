const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const _ = require('underscore');
const pool = require('./db').pool;
const exec = require('child_process').exec;

const STATIC_PATH = path.resolve(__dirname, '');
const app = express();
const cache = {
	userList: [
		{username: 'aaa', password: '111', money: 100, files: []},
		{username: 'bbb', password: '222', money: 100, files: []},
		{username: 'ccc', password: '333', money: 100, files: []},
	],
	session: {},
	messageList: [],
	fileName: 1
};

app.set('views', path.join(__dirname, 'views1'));
app.set('view engine', 'ejs');

app.use(express.static(STATIC_PATH));
app.use(cookieParser());

const dirPath = path.resolve(__dirname, 'files');
deleteFolderRecursive(dirPath);
fs.mkdir(dirPath, function() {});

app.use('/', function (req, res, next) {
	const mysession = req.cookies.mysession;
	if (!mysession || !cache.session[mysession]) {
		const newSession = new Date().getTime() + '' + parseInt(Math.random() * 1000 * 1000);
		res.cookie('mysession', newSession);
		cache.session[newSession] = {};
	}
	next();
});

//页面
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

app.use('/home', function (req, res) {
	const username = valid(req);
	
	if (!username) {
		res.status(404).send('<p>您没有登录，请<a href="/login">去登录</a>!</p>');
	} else {
		res.render('home.ejs', {user: getUser(username), messageList: cache.messageList});
	}
});

//表单接口
app.use('/toLogin', bodyParser.urlencoded(), function (req, res) {
	const userList = cache.userList;
	const body = req.body;
	const currentUser = {};
	const session = req.cookies.mysession;

	_.each(userList, item => {
		if (item.username === body.username && item.password === body.password) {
			currentUser.username = item.username;
			return false;
		}
	});

	if (currentUser.username === undefined) {
		return res.status(404).send('<p>账号密码错误，请<a href="/login">重新输入</a>!</p>')
	} else {
		cache.session[session] = currentUser;
		res.redirect('/home');
	}
});

//json 接口
app.use('/createMessage', function(req, res) {
	const username = valid(req);
	const messageList = cache.messageList;
	
	if (!username) {
		res.status(403).json({flag: 2, message: '您没有登录！'})
	} else {
		const content = req.query.content ;
		const message = {username: username, content: content};
		
		messageList.push(message);
		
		res.json({
			flag: 1
		})
	}
});

app.use('/deductMoney', function (req, res) {
	const username = valid(req);
	
	if (!username) {
		res.status(403).json({flag: 2, message: '您没有登录！'})
	} else {
		const user = getUser(username);
		user.money --;
		
		res.json({
			flag: 1,
			money: user.money
		})
	}
});

app.use('/queryStudents', function(req, res) {
	const username = valid(req);
	
	if (!username) {
		res.status(403).json({flag: 2, message: '您没有登录！'})
	} else {
		const name = req.query.name;
		const sql = "SELECT * from students WHERE name = '" + name + "'";
		
		pool.query(sql, function(error, result, fields) {
			if (error) {
				res.status(400).send(JSON.stringify(error));
			} else {
				res.json({
					flag: 1,
					content: result
				});
			}
		});
	}
});

app.use('/saveToFile', function(req, res) {
	const username = valid(req);
	
	if (!username) {
		res.status(403).json({flag: 2, message: '您没有登录！'})
	} else {
		const content = req.query.content;
		const fileName = 'files/' + cache.fileName + '.txt';
		
		cache.fileName ++;
		const cmd = 'echo ' + content + ' > ' + fileName;
		getUser(username).files.push(fileName);
		exec(cmd, function (error) {
			if (error) {
				res.status(400).send(JSON.stringify(error));
			} else {
				res.json({
					flag: 1,
				});
			}
		})
	}
});

//公共方法
function valid(req) {
	const session = req.cookies.mysession;
	if (session && cache.session[session] && cache.session[session].username) {
		return getUsername(session)
	} else {
		return false;
	}
}

function getUsername(session) {
	return cache.session[session].username;
}

function getUser(username) {
	const userList = cache.userList;
	let user;
	_.each(userList, item => {
		if (item.username === username) {
			user = item;
			return false;
		}
	});
	
	return user;
}

function deleteFolderRecursive(url) {
	let files = [];
	/**
	 * 判断给定的路径是否存在
	 */
	if (fs.existsSync(url)) {
		/**
		 * 返回文件和子目录的数组
		 */
		files = fs.readdirSync(url);
		files.forEach(function (file, index) {
			
			const curPath = path.join(url, file);
			console.log(curPath);
			/**
			 * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
			 */
			if (fs.statSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
				
			} else {
				fs.unlinkSync(curPath);
			}
		});
		/**
		 * 清除文件夹
		 */
		fs.rmdirSync(url);
		
	}
}


app.listen(9000, function () {
	console.log('第一个服务器：localhost:9000');
});