const http = require('http')
const app = http.createServer((req, res) => {

	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000, https://vlw2.com/chat');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Handle requests
	if (req.method === 'OPTIONS') {
		// This is an OPTIONS request, so just return 200 OK
		res.writeHead(200);
		res.end();
	} else {
		// This is a normal request, so handle it as usual
		// For example:
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('Hello World!');
	}

})

const io = module.exports.io = require('socket.io')(app)

const cors = require('cors');

const PORT = process.env.PORT || 3231

const SocketManager = require('./SocketManager')


io.on('connection', SocketManager)

app.listen(PORT, () => {
	console.log("Connected to port:" + PORT);
})
