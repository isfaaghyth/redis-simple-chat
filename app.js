var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs');
	
	app.listen(3001); //, "192.168.178.34");
	
	function handler(req, res) {
		fs.readFile(__dirname + '/index.html',
			function (err, data) {
				if (err) {
					res.writeHead(500);
					return res.end('Error loading index.html');
				}
				
				res.writeHead(200);
				res.end(data);
			});
	}