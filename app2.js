const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const STATIC_PATH = path.resolve(__dirname, '');
const app = express();
const cache = {
	localhost9001Cookies: []
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

app.use('/add', function (req, res) {
	const cookie = req.query.a;
	cache.localhost9001Cookies.push(cookie);
	res.sendFile('static/images/null.jpg');
});

app.use(/\/$/, function(req, res) {
	res.render('index.ejs', {
		localhost9001Cookies: cache.localhost9001Cookies
	});
});


app.listen(9001, function () {
	console.log('第二个服务器：localhost:9001');
});