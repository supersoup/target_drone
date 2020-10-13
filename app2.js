const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const STATIC_PATH = path.resolve(__dirname, '');
const app = express();
const cache = {
	localhost9001Cookies: [],
	localhost9001user: [],
};

app.set('views', path.join(__dirname, 'views2'))
app.set('view engine', 'ejs');
app.use(express.static(STATIC_PATH));

app.use('/add', function (req, res) {
	const cookie = decodeURIComponent(req.query.a);
	const localhost9001Cookies = cache.localhost9001Cookies;
	if (localhost9001Cookies.indexOf(cookie) === -1) {
		localhost9001Cookies.push(cookie);
	}
	
	res.sendFile(path.resolve(__dirname, 'static/images/null.jpg'));
});

app.use('/login', bodyParser.urlencoded(), function (req, res) {
	const body = req.body;
	
	cache.localhost9001user.push({
		username: body.username,
		password: body.password
	});
	
	res.send('<p>账号密码错误，请<a href="http://localhost:9000/login">重新输入</a>!</p>')
});

app.use(/\/$/, function(req, res) {
	res.render('index.ejs', cache);
});

app.use('/clickjacking', function(req, res) {
	res.render('clickjacking.ejs');
});


app.listen(9001, function () {
	console.log('第二个服务器：localhost:9001');
});