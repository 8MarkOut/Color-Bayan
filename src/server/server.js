var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var jsonfile = require('jsonfile');
var router = express.Router();

app.use(express.static(path.join(__dirname, '../css')));
app.use(express.static(path.join(__dirname, '../lib')));
app.use(express.static(path.join(__dirname, '../ts')));

app.get('/', function(req, res) {
	res.redirect('/Color-Bayan');
});

app.get('/Color-Bayan', function(req, res) {
	res.sendFile(path.join(__dirname, '../', 'index.html'));
	app.use(express.static(path.join(__dirname, '../')));
});

app.get('/musicList', function (req, res) {
	var jsonObj = {
		data: []
	}

	fs.readdir('src/lib/music', function(err, files) {

		if (err) {
			console.log('error:\n'+err);
			return;
		}

		files.forEach(function(file) {
			var fileName = file.slice(0, file.indexOf('.'));
			jsonObj.data.push(fileName);

		})

		var jsonStr = JSON.stringify(jsonObj);
		res.set('Content-Type','text/plain');
		var cFuncName = req.query.callbackparam;
		res.send(cFuncName + "([ " + jsonStr + " ])");

	})
})

app.get('/music', function(req, res) {
	console.log('name', req.query.name);
	fs.readFile('src/lib/music/'+ req.query.name + '.mid', function(error, data) {

		if (error) throw error;

		var jsonObj = {
			data: null
		};

		jsonObj.data = data;
		var jsonStr = JSON.stringify(jsonObj);
		res.set('Content-Type','text/plain');
		var cFuncName = req.query.callbackparam;
		res.send(cFuncName + "([ " + jsonStr + " ])");

	})
});

app.get('/instrument', function (req, res) {
	var jsonObj = {
		data: []
	}

	fs.readdir('src/lib/instrument', function(err, files) {

		if (err) {
			console.log('error:\n'+err);
			return;
		}

		files.forEach(function(file) {
			var fileName = file.slice(0, file.indexOf('.'));
			if(fileName != "") jsonObj.data.push(fileName);

		})

		var jsonStr = JSON.stringify(jsonObj);
		res.set('Content-Type','text/plain');
		var cFuncName = req.query.callbackparam;
		res.send(cFuncName + "([ " + jsonStr + " ])");
	})
})

app.get('/getInstrument', (req, res)=>{
    console.log('name', req.query.name);
	var file = 'src/lib/instrument/' + req.query.name + '.json';
	res.set('Content-Type','text/plain');
	var jsonStr = jsonfile.readFileSync(file);
	res.send(jsonStr);
})

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server start");
});