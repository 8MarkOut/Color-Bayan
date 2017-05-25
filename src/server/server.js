var express = require('express');
var app = express();
var fs = require('fs')
 
app.get('/', function (req, res) {
	res.send('Server is running!');
})

app.get('/musicList', function (req, res) {
	var jsonObj = {
		data: []
	}

	fs.readdir('./music', function(err, files) {
		if (err) {
			console.log('error:\n'+err);
			return;
		}
		files.forEach(function(file) {
			var fileName = file.slice(0, file.indexOf('.'));
			jsonObj.data.push(fileName);

		})
		var jsonStr = JSON.stringify(jsonObj);
		console.log(jsonStr);
		res.json(jsonStr);
	})
})

app.get('/music', function(req, res) {
	console.log('name', req.query.name);
	fs.readFile('./music/'+ req.query.name + '.mid', 'ascii', function(error, data) {
		if (error) throw error;

		var jsonObj = {
			data: null
		};
		jsonObj.data = data;
		var jsonStr = JSON.stringify(jsonObj);
		console.log(jsonStr);
		res.json(jsonStr);
	})
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
