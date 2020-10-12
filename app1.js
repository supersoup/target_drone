const path = require('path');
const express = require('express');
const ejs = require('ejs');

const STATIC_PATH = path.resolve(__dirname, '');
const app = express();
const cache = {};

app.set('views', path.join(__dirname, 'views1'))
app.set('view engine', 'ejs');

app.use(express.static(STATIC_PATH));

app.use(/\/$/, function(req, res) {
	res.render('index.ejs')
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
	})
});

app.use('/views1/xssFromBackendScript', function(req, res) {
	const content = req.query.content;
	
	res.render('xssFromBackendScript.ejs', {
		content: content
	})
});

app.listen(9000, function () {
	console.log('第一个服务器：localhost:9000');
});