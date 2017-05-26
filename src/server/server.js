var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs')
var router = express.Router();

app.use(express.static('../css'));
app.use(express.static('../lib'));
app.use(express.static('../ts'));
app.use(express.static('../../dist'));

/*router.all('/', function(req, res, next) {
	res.sendFile("../index.html");
});*/


/*app.get('/', function(req, res) {
	res.sendFile("../index.html");
});*/

app.get('/', function(req, res) {
	res.send("Server!");
});

app.get('/musicList', function (req, res) {
	var jsonObj = {
		data: []
	}

	fs.readdir('../lib/music', function(err, files) {

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
	fs.readFile('../lib/music/'+ req.query.name + '.mid', 'ascii', function(error, data) {

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
    console.log("Start server at ", host, port)

})

//module.exports = router;