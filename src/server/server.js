var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
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

		if (error) {
			console.log('error:\n'+error);
			return;
		}

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

	fs.readdir('src/lib/instrument/', function(err, files) {

		if (err) {
			console.log('error:\n'+err);
			return;
		}

		files.forEach(function(file) {
			var fileName = file.toString('utf-8');
			if(fileName != "") jsonObj.data.push(fileName);
		})

		var jsonStr = JSON.stringify(jsonObj);
		res.set('Content-Type','text/plain');
		var cFuncName = req.query.callbackparam;
		res.send(cFuncName + "([ " + jsonStr + " ])");
	})
})

app.get('/getInstrument', (req, res)=>{
	var fileDir = 'src/lib/instrument/' + req.query.name;
	
	var jsonObj = {
		data: {}
	}

	fs.readdir(fileDir, function(err, files) {

		if (err) {
			console.log('error: '+err + '\n');
			return;
		}

		files.forEach(function(file) {
			var fileName = file.slice(0, file.indexOf('.'));
			if(fileName != "") {
				var content = fs.readFileSync(fileDir + '/' + fileName + '.mp3');
				jsonObj.data[fileName] = 'data:audio/mp3;base64,' + content.toString('base64');
			}
		})
		var jsonStr = JSON.stringify(jsonObj);
		res.set('Content-Type','text/plain');
		var cFuncName = req.query.callbackparam;
		res.send(cFuncName + "([ " + jsonStr + " ])");
	})
})

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server start");
});